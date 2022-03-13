//  Library
import * as github from '@actions/github'
import { octokit } from '../library'

export async function createPullRequest(path: string, content: string, message: string, branch: string = 'label-sync') {


    //  Get the HEAD reference
    const ref = await octokit.rest.git.getRef({
        ...github.context.repo,
        ref: `heads/${branch}`
    })

    console.log('Got reference', ref)

    const tree = await octokit.rest.git.getTree({
        ...github.context.repo,
        tree_sha: ref.data.object.sha
    })

    console.log('Got tree', tree)

    const blob = await octokit.rest.git.createBlob({
        ...github.context.repo,
        content,
        encoding: 'utf-8'
    })

    console.log('Created blob', blob)

    const newTree = await octokit.rest.git.createTree({
        ...github.context.repo,
        tree: [{
            path,
            sha: blob.data.sha,
            mode: '100644',
            type: 'blob'
        }],
        base_tree: tree.data.sha
    })

    console.log('Created tree', newTree)

    const newCommit = await octokit.rest.git.createCommit({
        ...github.context.repo,
        message,
        parents: [ref.data.object.sha],
        tree: newTree.data.sha
    })

    console.log('Created commit', newCommit)

    await octokit.rest.git.createRef({
        ...github.context.repo,
        ref: `refs/heads/${branch}`,
        sha: newCommit.data.sha
    })

    console.log('Created commit', newCommit)

    const pr = await octokit.rest.pulls.create({
        ...github.context.repo,
        title: message,
        body: 'Update Labels',
        head: branch,
        base: 'main'
    })

    console.log('Created PR', await pr)

    return pr
}
