//  Library
import * as core from '@actions/core'
import * as github from '@actions/github'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { octokit } from './octokit'
import * as yaml from 'js-yaml'

//  Helpers
import * as config from '../config'
import { getConfigLabels } from './getConfigLabels'
import { getRepoLabels } from './getRepoLabels'

//  Type Definitions
import type { GitHubLabel, LabelMap } from '../types'
import { createArtifacts } from './artifacts'


const workspace = process.env.GITHUB_WORKSPACE || ''
const configPath = path.join(workspace, config.path)
const extension = path.extname(config.path)

export async function syncConfigLabels() {

    const repoLabelsMap: LabelMap = await getRepoLabels()    //  Get repo's label data

    const configLabelsMap = await getConfigLabels()

    const firstRun = configLabelsMap.keys.length === 0

    if (!firstRun) {
        let { payload: { action, label } } = github.context

        //  Only keep properties that are needed
        label = {
            name: label.name,
            description: label.description,
            color: label.color
        }

        if (action === 'created' && !repoLabelsMap.has(label.name)) {  //  New label created
            repoLabelsMap.set(label.name, label)
        } else if (action === 'updated' && repoLabelsMap.has(label.name)) {    //  Existing label updated
            repoLabelsMap.set(label.name, label)
        } else if (action === 'deleted' && repoLabelsMap.has(label.name)) {    //  Existing label deleted
            repoLabelsMap.delete(label.name)
        }

    }

    //  Create array
    let repoLabels: GitHubLabel[] = []
    repoLabelsMap.forEach(label => repoLabels.push(label))

    //  YAMLify
    let yamlContent = yaml.dump(repoLabels)
    yamlContent = yamlContent.replace(/(\s+-\s+\w+:.*)/g, '$1')   //  Add additional \n for clarity sake


    //  Log and exit if Dry-Run Mode
    if (config.isDryRun) {
        core.info('\u001b[33;1mNOTE: This is a dry run\u001b[0m')
        core.info(yamlContent)
        return
    }

    fs.writeFileSync(configPath, yamlContent, { encoding: 'utf-8' })

    createArtifacts('labels', [`./${config.path}`])

    // //  Get .github/labels.yaml file (if it exists). For SHA
    // let SHA
    // if (!firstRun) {
    //     const { data } = await octokit.rest.repos.getContent({
    //         owner: github.context.repo.owner,
    //         repo: github.context.repo.repo,
    //         path: config.path
    //     })

    //     if (Array.isArray(data)) { return } //  If the response is not for a single file then exit
    //     SHA = data.sha
    // }

    // //  Create or Update .github/labels.yaml file in the repo   //TODO: Maybe not push directly to master
    // await octokit.rest.repos.createOrUpdateFileContents({
    //     owner: github.context.repo.owner,
    //     repo: github.context.repo.repo,
    //     path: config.path,
    //     message: config.commitMessage,
    //     content: Buffer.from(yamlContent).toString('base64'),
    //     sha: SHA
    // })
}