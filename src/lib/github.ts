import { Octokit } from "@octokit/rest";

const octokit = new Octokit();

export interface Resource {
  name: string;
  description: string;
  link: string;
  category: string;
}

export async function fetchReadmeContent() {
  const response = await octokit.repos.getContent({
    owner: "birobirobiro",
    repo: "awesome-shadcn-ui",
    path: "README.md",
  });

  if (Array.isArray(response.data)) {
    throw new Error("Expected file content but found a directory");
  }
  if (!("content" in response.data)) {
    throw new Error("Content not found in response data");
  }
  const content = Buffer.from(response.data.content, "base64").toString();

  const resources: Resource[] = [];
  let currentCategory = "";

  const lines = content.split("\n");

  for (const line of lines) {
    if (line.startsWith("## ")) {
      currentCategory = line.replace("## ", "").trim();
    } else if (line.startsWith("| ") && !line.startsWith("| Name")) {
      const [name, description, link] = line
        .split("|")
        .slice(1, -1)
        .map((item) => item.trim());
      resources.push({
        name,
        description,
        link,
        category: currentCategory,
      });
    }
  }

  return resources;
}
