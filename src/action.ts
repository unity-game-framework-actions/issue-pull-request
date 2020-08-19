import * as utility from './utility'

export async function createIssuePullRequest(owner: string, repo: string, number: string, base: string, head: string, body: boolean, link: boolean, config: any, context: any): Promise<string> {
  const issue = await utility.getIssue(owner, repo, number)
  const pullRequest = await createPullRequest(owner, repo, issue.title, body ? issue.body : '', base, head)

  if (link) {
    const body = getComment(base, issue.number, config, context)

    await createIssueComment(owner, repo, pullRequest.number, body)
  }

  return pullRequest.number
}

async function createPullRequest(owner: string, repo: string, title: string, body: string, base: string, head: string): Promise<any> {
  const octokit = utility.getOctokit()
  const response = await octokit.request(`POST /repos/${owner}/${repo}/pulls`, {
    title: title,
    body: body,
    base: base,
    head: head
  })

  return response.data
}

function getComment(base: string, number: string, config: any, context: any): string {
  const values = {
    context: context,
    base: base,
    number: number
  }

  const result = utility.formatValues(config.comment, values)

  return result
}

async function createIssueComment(owner: string, repo: string, number: string, body: string): Promise<void> {
  const octokit = utility.getOctokit()

  await octokit.request(`POST /repos/${owner}/${repo}/issues/${number}/comments`, {
    body: body
  })
}
