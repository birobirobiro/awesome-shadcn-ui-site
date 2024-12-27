import { Octokit } from '@octokit/rest'

const octokit = new Octokit()

export interface Resource {
  id: number
  name: string
  url: string
  description: string
  category: string
}

export async function fetchReadmeContent() {
  const response = await octokit.repos.getContent({
    owner: 'birobirobiro',
    repo: 'awesome-shadcn-ui',
    path: 'README.md',
  })

  const content = Buffer.from(response.data.content, 'base64').toString()
  
  const resources: Resource[] = []
  let currentCategory = ''
  let id = 1

  const lines = content.split('\n')
  
  for (const line of lines) {
    if (line.startsWith('## ')) {
      currentCategory = line.replace('## ', '').trim()
    } else if (line.startsWith('- [') && currentCategory) {
      const matches = line.match(/- \[(.*?)\]$$(.*?)$$(.*)/)
      if (matches) {
        resources.push({
          id,
          name: matches[1],
          url: matches[2],
          description: matches[3].replace(/^( ?[-–] ?| ?– ?)/, '').trim(),
          category: currentCategory
        })
        id++
      }
    }
  }

  return resources
}

