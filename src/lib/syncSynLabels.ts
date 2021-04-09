import * as YAML from 'yaml'    //  YAML parser

import { getRepoLabels } from '../utils'    //  Get's repository label-data

import { Config, core, github, GitHubLabel, octokit } from '../typedefs'    //  Type definitions

//  ==============
//  SYNC SYNLABELS
//  ==============

//  Responds to user editing repo-labels and syncs changes to .github/labels.yaml
const syncSynLabels = async (config: Config, core: core, octokit: octokit, github: github) => {
    const repoLabelsMap = await getRepoLabels(octokit, github)  //  Get repo's label-data
    let yamlContent = ''

    if (!config.firstRun) {
        let { payload: { action, label } } = github.context
        
        //  Only keep properties that are needed
        label = {
            name: label.name,
            description: label.description,
            color: label.color
        }
        
        if (action === 'created' && !repoLabelsMap.has(label.name)) {   //  New Label Created
            repoLabelsMap.set(label.name, label)

        } else if (action === 'updated' && repoLabelsMap.has(label.name)) { //  Existing Label Updated
            repoLabelsMap.set(label.name, label)

        } else if (action === 'deleted'&& repoLabelsMap.has(label.name)) {  //  Existing Label Deleted
            repoLabelsMap.delete(label.name)
        }
    }
    
    //  Create array
    let repoLabels: GitHubLabel[] = []
    repoLabelsMap.forEach(label => repoLabels.push(label))

    //  YAMLify repoLabels
    yamlContent = YAML.stringify({ repoLabels })
    yamlContent = yamlContent.replace(/(\s+-\s+\w+:.*)/g, '\n$1')   //  Add additional \n for clarity sake

    //  Log and exit if Dry-Run Mode
    if (config.dryRun) {
        core.info('\u001b[33;1mNOTE: This is a dry run\u001b[0m')
        core.info(yamlContent)
        return
    }

    //  Get .github/labels.yaml file (if it exists). For SHA
    const { data } = await octokit.repos.getContent({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        path: config.path
    })

    if (Array.isArray(data)) { return } //  If the response is not for a single file then exit

    //  Create or Update .github/labels.yaml file in the repo   //TODO: Maybe not push directly to master
    await octokit.repos.createOrUpdateFileContents({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        path: config.path,
        message: config.commitMessage,
        content: Buffer.from(yamlContent).toString('base64'),
        sha: data.sha
    })
}

//  ========================
export default syncSynLabels
//  ========================