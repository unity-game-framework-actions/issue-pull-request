import * as core from '@actions/core'
import * as utility from './utility'
import * as action from './action'

run()

async function run(): Promise<void> {
  try {
    const issue = core.getInput('issue')
    const base = core.getInput('base', {required: true})
    const head = core.getInput('head', {required: true})
    const body = core.getInput('body', {required: true}) === 'true'
    const link = core.getInput('link', {required: true})
    const repository = utility.getRepository()
    const config = await utility.readConfigAny()
    const context = await utility.getContextAny()
    const result = await action.createIssuePullRequest(repository.owner, repository.repo, issue, base, head, body, link, config, context)

    await utility.setOutput(result)
  } catch (error) {
    core.setFailed(error.message)
  }
}
