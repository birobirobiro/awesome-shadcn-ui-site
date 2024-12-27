import { AwesomeCategory } from "@/types/awesome-list";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit();

export async function fetchAwesomeList() {
  const response = await octokit.repos.getContent({
    owner: "birobirobiro",
    repo: "awesome-shadcn-ui",
    path: "README.md",
  });

  // GitHub returns base64 encoded content
  if (Array.isArray(response.data)) {
    throw new Error("Unexpected response format: data is an array");
  }
  if (!("content" in response.data)) {
    throw new Error("Unexpected response format: content not found");
  }
  const content = Buffer.from(response.data.content, "base64").toString();

  // Parse the markdown content into categories
  const categories: AwesomeCategory[] = [];
  let currentCategory: AwesomeCategory | null = null;

  const lines = content.split("\n");

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (currentCategory) {
        categories.push(currentCategory);
      }
      currentCategory = {
        name: line.replace("## ", "").trim(),
        items: [],
      };
    } else if (line.startsWith("- [") && currentCategory) {
      const matches = line.match(/- \[(.*?)\]$$(.*?)$$(.*)/);
      if (matches) {
        currentCategory.items.push({
          name: matches[1],
          url: matches[2],
          description: matches[3].replace(/^( ?[-–] ?| ?– ?)/, "").trim(),
        });
      }
    }
  }

  if (currentCategory) {
    categories.push(currentCategory);
  }

  return { categories };
}
