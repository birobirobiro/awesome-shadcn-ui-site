import { Octokit } from "@octokit/rest";

const octokit = new Octokit();

export interface Resource {
  id: number;
  name: string;
  url: string;
  description: string;
  category: string;
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
          const url = parts[3];
          const formattedUrl = url.startsWith("[") ? url : `[Link](${url})`;
          resources.push({
            id: id++,
            name: parts[1],
            description: parts[2],
            url: formattedUrl,
            category: currentCategory,
          });
        }
      }
    }

    // Filter out unwanted entries
    const filteredResources = resources.filter(
      (resource) =>
        resource.name !== "Name" &&
        resource.description !== "Description" &&
        resource.url !== "[Link](Link)"
    );

    return filteredResources;
  } catch (error) {
    console.error("Error fetching or parsing README:", error);
    throw error;
  }
}
