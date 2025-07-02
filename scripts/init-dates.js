// This script updates the README with dates from the resource date map
// ONLY NEEDED TO GET ALL INITIAL DATES

import axios from "axios";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";

// Get the directory name properly in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = "birobirobiro";
const REPO_NAME = "awesome-shadcn-ui";
const README_PATH = path.join(__dirname, "README.md");

// GitHub API client with token
const github = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: GITHUB_TOKEN ? `token ${GITHUB_TOKEN}` : "",
    Accept: "application/vnd.github.v3+json",
  },
});

// Fetch all PRs for the repository
async function fetchAllPRs() {
  try {
    console.log("Fetching all PRs...");

    let prs = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      console.log(`Fetching PRs page ${page}...`);
      try {
        const response = await github.get(
          `/repos/${REPO_OWNER}/${REPO_NAME}/pulls`,
          {
            params: {
              state: "all", // Get all PRs, not just closed ones
              per_page: 100,
              page: page,
            },
          },
        );

        const data = response.data;
        if (data.length === 0) {
          hasMore = false;
        } else {
          prs = prs.concat(data);
          page++;
        }
      } catch (error) {
        console.error(`Error fetching page ${page}:`, error.message);
        if (error.response && error.response.status === 403) {
          console.error(
            "Rate limit exceeded. Try again later or use a GitHub token with higher rate limits.",
          );
        }
        hasMore = false;
      }
    }

    console.log(`Found ${prs.length} PRs in total`);
    return prs;
  } catch (error) {
    console.error("Error fetching PRs:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    return [];
  }
}

// Extract all resource names from the README
function extractResourceNames(readmeContent) {
  const lines = readmeContent.split("\n");
  const resources = [];
  let inTable = false;

  for (const line of lines) {
    // Detect table headers
    if (line.startsWith("| Name") || line.startsWith("|Name")) {
      inTable = true;
      continue;
    }

    // Skip separator row
    if (inTable && line.match(/^\|[\s-]+\|/)) {
      continue;
    }

    // Handle table data rows
    if (inTable && line.startsWith("|") && !line.match(/^\|[\s-]+\|/)) {
      const parts = line.split("|").map((part) => part.trim());

      if (parts.length >= 3) {
        const resourceName = parts[1]; // Name column
        if (resourceName && resourceName !== "") {
          resources.push(resourceName);
        }
      }
    }

    // End of table
    if (inTable && !line.startsWith("|")) {
      inTable = false;
    }
  }

  return resources;
}

// Build a mapping of resource names to their addition dates
async function buildResourceDateMap() {
  try {
    // First, read the README to get all resource names
    const readmeContent = fs.readFileSync(README_PATH, "utf8");
    const resourceNames = extractResourceNames(readmeContent);
    console.log(`Found ${resourceNames.length} resources in the README`);

    // Create a map to store resource name -> date
    const resourceDateMap = {};

    // Get default date (repository creation date) for fallback
    const repoResponse = await github.get(`/repos/${REPO_OWNER}/${REPO_NAME}`);
    const defaultDate = new Date(repoResponse.data.created_at)
      .toISOString()
      .split("T")[0];

    // Fetch all PRs once
    const prs = await fetchAllPRs();

    // Sort PRs by created date (oldest first)
    const sortedPRs = [...prs].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at),
    );

    // Process each PR to find resources it added
    console.log("Processing PRs to find when resources were added...");
    let processedCount = 0;

    for (const pr of sortedPRs) {
      if (!pr.merged_at) continue; // Skip PRs that weren't merged

      processedCount++;
      if (processedCount % 10 === 0) {
        console.log(`Processed ${processedCount}/${sortedPRs.length} PRs...`);
      }

      try {
        // Get the PR diff
        const diffResponse = await github.get(pr.diff_url, {
          headers: { Accept: "text/plain" },
          responseType: "text",
        });

        const diff = diffResponse.data;

        // Only process PRs that modified the README
        if (!diff.includes("README.md")) {
          continue;
        }

        // Check which resources were added in this PR
        const prDate = new Date(pr.merged_at).toISOString().split("T")[0]; // YYYY-MM-DD

        for (const resourceName of resourceNames) {
          // Skip resources that already have a date assigned
          if (resourceDateMap[resourceName]) {
            continue;
          }

          // Clean up the resource name for better matching
          const cleanName = resourceName.trim().toLowerCase();

          // Check if this PR added the resource
          if (
            diff.toLowerCase().includes(cleanName) ||
            pr.title.toLowerCase().includes(cleanName) ||
            (pr.body && pr.body.toLowerCase().includes(cleanName))
          ) {
            resourceDateMap[resourceName] = prDate;
            console.log(
              `Found date for "${resourceName}": ${prDate} in PR #${pr.number}`,
            );
          }
        }
      } catch (diffError) {
        console.error(
          `Error fetching diff for PR #${pr.number}:`,
          diffError.message,
        );
        continue; // Try the next PR
      }
    }

    console.log(`Processed all ${processedCount} PRs`);

    // Assign default date to resources that weren't found in any PR
    for (const resourceName of resourceNames) {
      if (!resourceDateMap[resourceName]) {
        resourceDateMap[resourceName] = defaultDate;
        console.log(`Using default date for "${resourceName}": ${defaultDate}`);
      }
    }

    return resourceDateMap;
  } catch (error) {
    console.error("Error building resource date map:", error.message);
    return {};
  }
}

// Update the README with dates from the resource date map
function updateReadmeWithDates(resourceDateMap) {
  try {
    console.log("Updating README with dates...");

    // Read the README
    const content = fs.readFileSync(README_PATH, "utf8");
    const lines = content.split("\n");
    const updatedLines = [];

    let inTable = false;
    let tableHeaders = [];
    let hasDateColumn = false;
    let currentSection = "";

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      // Track current section
      if (line.startsWith("## ")) {
        currentSection = line.substring(3).trim();
        inTable = false;
        tableHeaders = [];
        hasDateColumn = false;
        console.log(`Processing section: ${currentSection}`);
      }

      // Detect table headers
      if (line.startsWith("| Name") || line.startsWith("|Name")) {
        inTable = true;
        tableHeaders = line.split("|").map((part) => part.trim());
        hasDateColumn = tableHeaders.includes("Date");

        // Add Date column if it doesn't exist
        if (!hasDateColumn) {
          line = line + " Date |";
          console.log(
            `Added Date column to table in section: ${currentSection}`,
          );
        }
      }

      // Handle table separator row
      else if (inTable && line.match(/^\|[\s-]+\|/)) {
        if (!hasDateColumn) {
          line = line + " ------- |";
        }
      }

      // Handle table data rows
      else if (inTable && line.startsWith("|") && !line.match(/^\|[\s-]+\|/)) {
        const parts = line.split("|").map((part) => part.trim());

        if (parts.length >= 3) {
          const resourceName = parts[1]; // Name column

          if (resourceName && resourceName !== "") {
            // Get the date for this resource
            const date = resourceDateMap[resourceName] || "Unknown";

            if (hasDateColumn) {
              // Replace the existing date column
              parts[parts.length - 1] = date;
              line = "| " + parts.slice(1).join(" | ") + " |";
            } else {
              // Add a new date column
              line = line + ` ${date} |`;
            }
          }
        }
      }

      updatedLines.push(line);
    }

    // Write the updated README
    fs.writeFileSync(README_PATH, updatedLines.join("\n"));
    console.log("README.md has been updated with dates.");
  } catch (error) {
    console.error("Error updating README with dates:", error.message);
  }
}

// Main function
async function main() {
  try {
    console.log("Starting README update process...");

    // Build the resource date map
    const resourceDateMap = await buildResourceDateMap();

    // Update the README with dates
    updateReadmeWithDates(resourceDateMap);

    console.log("Process completed successfully!");
  } catch (error) {
    console.error("Error in main process:", error.message);
  }
}

// Run the main function
main();
