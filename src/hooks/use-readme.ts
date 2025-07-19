import { Octokit } from "@octokit/rest";

/**
 * Structure of a parsed resource.
 */
export interface Resource {
  id: number;
  name: string;
  url: string;
  description: string;
  category: string;
  date: string;
}

interface RepoConfig {
  owner: string;
  repo: string;
  path: string;
}

/**
 * Extracts the URL from a markdown link or plain URL string.
 */
function extractUrl(input: string): string {
  if (!input) return "";
  const match = input.match(/\[.*?\]\((.*?)\)/);
  return match ? match[1].trim() : input.replace(/^Link:?\s*/i, "").trim();
}

/**
 * Checks if a string contains only dashes or is empty.
 */
function isOnlyDashesOrEmpty(str: string): boolean {
  return str.trim() === "" || /^-+$/.test(str.trim());
}

/**
 * Checks if the row is a markdown table header or separator.
 */
function isHeaderOrSeparator(parts: string[]): boolean {
  const normalized = parts.map((p) => p.toLowerCase());
  return (
    normalized.includes("name") ||
    normalized.includes("description") ||
    normalized.includes("link") ||
    normalized.includes("date") ||
    parts.every(isOnlyDashesOrEmpty)
  );
}

/**
 * Validates the structure and content of a resource.
 */
function isValidResource(resource: Resource): boolean {
  const { name, description, url } = resource;
  const isNotPlaceholder = (value: string) =>
    !!value && !["name", "description", "link"].includes(value.toLowerCase());

  return (
    name.trim() !== "" &&
    description.trim() !== "" &&
    url.trim() !== "" &&
    isNotPlaceholder(name) &&
    isNotPlaceholder(description) &&
    isNotPlaceholder(url)
  );
}

/**
 * Parses markdown table rows into Resource objects.
 */
function parseMarkdownTableLine(
  parts: string[],
  category: string,
  id: number
): Resource | null {
  if (parts.length < 4) return null;

  const resource: Resource = {
    id,
    name: parts[1]?.trim() ?? "",
    description: parts[2]?.trim() ?? "",
    url: extractUrl(parts[3] ?? ""),
    category,
    date: parts[4]?.trim() ?? "Unknown",
  };

  return isValidResource(resource) ? resource : null;
}

/**
 * Parses markdown README content to extract resources.
 */
function parseReadmeContent(content: string): Resource[] {
  const lines = content.split("\n").map((line) => line.trim());
  const resources: Resource[] = [];

  let category = "";
  let id = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect category
    if (line.startsWith("## ")) {
      category = line.replace(/^##\s*/, "").trim();
      continue;
    }

    // Detect table row
    if (line.startsWith("|") && line.includes("|") && category) {
      const parts = line.split("|").map((part) => part.trim());

      if (isHeaderOrSeparator(parts)) continue;

      const resource = parseMarkdownTableLine(parts, category, id);
      if (resource) {
        resources.push(resource);
        id++;
      } else {
        console.warn(`Skipped malformed or invalid row at line ${i + 1}:`, line);
      }
    }
  }

  return resources;
}

/**
 * Fetches and parses README.md from GitHub to extract structured resources.
 */
export async function fetchAndParseReadme(
  config: RepoConfig = {
    owner: "birobirobiro",
    repo: "awesome-shadcn-ui",
    path: "README.md",
  }
): Promise<Resource[]> {
  const octokit = new Octokit();

  try {
    const { data } = await octokit.repos.getContent({...config});

    if (Array.isArray(data) || !("content" in data)) {
      throw new Error("Unexpected data format from GitHub API.");
    }

    const decoded = Buffer.from(data.content, "base64").toString("utf-8");
    return parseReadmeContent(decoded);
  } catch (err) {
    console.error("Error fetching or parsing README:", err);
    throw new Error(
      `Failed to process README.md: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
  }
}
