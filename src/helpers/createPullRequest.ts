//  Library
import * as github from '@actions/github'
import { octokit } from '../library'

export async function createPullRequest(path: string, content: string, message: string, branch: string = 'update-label-sync') {

    //  Get the HEAD reference
    const ref = await octokit.rest.git.getRef({
        ...github.context.repo,
        ref: `heads/${branch}`
    })

    const pr = await octokit.rest.repos.createOrUpdateFileContents({
        ...github.context.repo,
        content,
        message,
        path,
        branch,
        sha: ref.data.object.sha
    })

    console.log(pr)
}
