import * as fs from 'fs'
import * as path from 'path'
import * as YAML from 'yaml'

import { core, octokit, github, GitHubLabel } from './typedefs'

//  ==========
//  GET LABELS
//  ==========

//  Gets all labels in current repository
export const getLabels = async (octokit: octokit, github: github): Promise<GitHubLabel[]> => {
    //  Fetch Labels for current repo
    const { data } = await octokit.issues.listLabelsForRepo({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo
    })

    return data
}

//  ===========
//  READ LABELS
//  ===========

//  Reads labels from .github/labels.yaml
export const readLabels = (core: core) => {
    //  Get Workspace URL
    const workspaceURL = process.env.GITHUB_WORKSPACE || ''
    if (!workspaceURL) { core.setFailed('Failed to read GitHub workspace URL') }

    //  Read Labels from ./.github/labels.yaml
    let file
    const url = path.join(workspaceURL, '.github', 'labels.yaml')
    try { file = fs.readFileSync(url, 'utf8') }
    catch(err) { file = '' }    //  If readFileSync fails, assume empty yaml
    
    const yaml = YAML.parse(file)
    if (!yaml) { core.setFailed('Failed to read ./.github/labels.yaml') }
    let labels: GitHubLabel[] = yaml.repoLabels

    //  Formats color property
    const formatColor = (color: string|number) => {
        color = color.toString()
        if (color[0] === '#') {
            color = color.substr(1)
        }
        return color
    }

    //  Remaps labels array
    labels = labels.map(label => ({
        ...label,
        color: formatColor(label.color)
    }))

    return labels
}