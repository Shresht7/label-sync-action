import { octokit, github, GitHubLabel } from './typedefs'

//  ==========
//  GET LABELS
//  ==========

//  Gets all labels in current repository
export const getLabels = async (octokit: octokit, github: github): Promise<GitHubLabel[]> => {
    const { data } = await octokit.issues.listLabelsForRepo({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo
    })
    return data
}