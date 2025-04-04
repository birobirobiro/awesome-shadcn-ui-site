import { Octokit } from "@octokit/rest";

const octokit = new Octokit();

export interface Resource {
  id: number;
  name: string;
  url: string;
  description: string;
  category: string;
  date: string;
}

export async function fetchAndParseReadme(): Promise<Resource[]> {
  try {
    const response = await octokit.repos.getContent({
      owner: "birobirobiro",
      repo: "awesome-shadcn-ui",
      path: "README.md",
    });

    if (Array.isArray(response.data) || !("content" in response.data)) {
      throw new Error("Invalid response data");
    }

    const content = Buffer.from(response.data.content, "base64").toString();

    const resources: Resource[] = [];
    let currentCategory = "";
    let id = 1;

    const lines = content.split("\n");

    for (const line of lines) {
      if (line.startsWith("## ")) {
        currentCategory = line.replace("## ", "").trim();
      } else if (
        line.startsWith("| ") &&
        line.includes(" | ") &&
        currentCategory
      ) {
        const parts = line.split("|").map((part) => part.trim());
        if (parts.length >= 4) {
          let url = parts[3];
          let date = "Unknown";

          // Extract URL from markdown link format [Link](url)
          const markdownMatch = url.match(/\[(.*?)\]\((.*?)\)/);
          if (markdownMatch && markdownMatch[2]) {
            url = markdownMatch[2];
          } else {
            // If not in markdown format, remove any "Link:" prefix
            url = url.replace(/^Link:?\s*/i, "").trim();
          }

          // Check if there's a date column (parts.length >= 5)
          if (parts.length >= 5) {
            date = parts[4];
          }

          resources.push({
            id: id++,
            name: parts[1],
            description: parts[2],
            url: url,
            category: currentCategory,
            date: date,
          });
        }
      }
    }

    // Filter out unwanted entries
    const filteredResources = resources.filter(
      (resource) =>
        resource.name !== "Name" &&
        resource.description !== "Description" &&
        resource.url !== "Link" &&
        resource.url !== "",
    );

    return filteredResources;
  } catch (error) {
    console.error("Error fetching or parsing README:", error);
    throw error;
  }
}
