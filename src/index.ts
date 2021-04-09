import * as fs from 'fs'
import * as path from 'path'
import * as YAML from 'yaml'

import * as core from '@actions/core'
import * as github from '@actions/github'

import { readConfigYAML as readConfig } from './config'
import { getLabels, labelSorter, readLabels, writeLabelMessage } from './utils'

import {  GitHubLabel, LabelsMap } from './typedefs'

//  ======
//  CONFIG
//  ======

const GITHUB_ACCESS_TOKEN = process.env.GITHUB_TOKEN || ''
if (!GITHUB_ACCESS_TOKEN) { core.setFailed(`Invalid GITHUB_ACCESS_TOKEN`) }
const octokit = github.getOctokit(GITHUB_ACCESS_TOKEN)

const workspaceURL = process.env.GITHUB_WORKSPACE || ''
const configPath = path.join('.github', 'labels.yaml') || ''
const configPathURL = path.join(workspaceURL, configPath) || ''
const [config, firstRun] = readConfig(configPathURL, core)

//  =================
//  RUN GITHUB ACTION
//  =================

//  Responds to user editing repo-labels and syncs changes to .github/labels.yaml
const syncYamlLabels = async () => {
    let yamlContent = ''
    if (!firstRun) {
        const configLabelNames = readLabels(config).map(label => label.name)
        let { payload: { action, label } } = github.context

        label = label.map((x: GitHubLabel) => {
            x.name,
            x.color,
            x.description
        })

        if (action === 'created' && !configLabelNames.includes(label.name)) {
            config.repoLabels = [ ...config.repoLabels, label ]
        } else if (action === 'updated' && configLabelNames.includes(label.name)) {
            const index = config.repoLabels.findIndex(x => x.name === label.name)
            config.repoLabels[index] = label
        } else if (action === 'deleted'&& configLabelNames.includes(label.name)) {
            const index = config.repoLabels.findIndex(x => x.name === label.name)
            delete config.repoLabels[index]
        }
    } else {
        const existingLabels = await getLabels(octokit, github)
        config.repoLabels = [...existingLabels]
    }

    yamlContent = YAML.stringify(config)
    yamlContent = yamlContent.replace(/(\s+-\s+\w+:.*)/g, '\n$1')
    yamlContent = yamlContent.replace(/dryRun:(.*)/g, 'dryRun:$1\n')
    yamlContent = yamlContent.replace('repoLabels:\n', '\nrepoLabels:')
    yamlContent = yamlContent.replace(/commitMessage:(.*)/g, '\ncommitMessage:$1')

    if (config.dryRun) {
        core.info('\u001b[33;1mNOTE: This is a dry run\u001b[0m')
        core.info(yamlContent)
        return
    }

    const { data } = await octokit.repos.getContent({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        path: configPath
    })

    if (Array.isArray(data)) { return }

    const response = await octokit.repos.createOrUpdateFileContents({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        path: configPath,
        message: config.commitMessage,
        content: Buffer.from(yamlContent).toString('base64'),
        sha: data.sha
    })

    if (response.status === 200) {
        core.info(`Your changes have been synced to ${configPath}`)
    } else {
        core.warning(`Something went wrong! [response-code: ${response.status.toString()}]`)
    }
}

//  When run, syncs labels from ./github/labels.yaml to the repository
const syncRepoLabels = async () => {

    //  GET EXISTING LABELS
    //  ===================

    const existingLabelsMap: LabelsMap = new Map()
    const existingLabels = await getLabels(octokit, github)
    existingLabels.forEach(label => existingLabelsMap.set(label.name, label))

    //  GET CONFIG LABELS
    //  =================

    const configLabelsMap: LabelsMap = new Map()
    const configLabels = readLabels(config)
    configLabels.forEach(label => configLabelsMap.set(label.name, label))

    //  SORT LABELS INTO ACTIONABLE CATEGORIES
    const [createLabels, updateLabels, deleteLabels] = labelSorter(existingLabelsMap, configLabelsMap)
    
    //  Dry Run Message
    if (config.dryRun) { core.info('\u001b[33;1mNOTE: This is a dry run\u001b[0m') }

    //  CREATE LABELS
    //  =============

    core.info('\nCREATE LABELS')
    createLabels.forEach(async (labelName) => {
        const label = configLabelsMap.get(labelName)
        if (!label || !config.create) { return }
        core.info(writeLabelMessage('CREATE', label))
        if (config.dryRun) { return }
        
        //  REAL STUFF HERE
        await octokit.issues.createLabel({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            name: label.name,
            color: label.color || '000000',
            description: label.description || ''
        })
    })
    
    //  UPDATE LABELS
    //  =============

    core.info('\nUPDATE LABELS')
    updateLabels.forEach(async (labelName) => {
        const label = configLabelsMap.get(labelName)
        if (!label || !config.update) { return }
        core.info(writeLabelMessage('UPDATE', label))
        if (config.dryRun) { return }
        
        //  REAL STUFF HERE
        await octokit.issues.updateLabel({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            name: label.name,
            color: label.color || '000000',
            description: label.description || ''
        })
    })
    
    //  DELETE LABELS
    //  =============

    core.info('\nDELETE LABELS')
    deleteLabels.forEach(async (labelName) => {
        const label = existingLabelsMap.get(labelName)
        if (!label || !config.delete) { return }
        core.info(writeLabelMessage('DELETE', label))
        if (config.dryRun) { return }
        
        //  REAL STUFF HERE
        await octokit.issues.deleteLabel({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            name: label.name
        })
    })
}

//  ==============
//  EXECUTE ACTION
//  ==============

//  Try running GitHub Action and catch errors if any
try {
    if (github.context.eventName === 'label') {
        core.info('Syncing your changes with ./github/labels.yaml')
        syncYamlLabels()
    } else {    //TODO:  Use better else clause
        core.info('Syncing labels from ./github/labels.yaml to your repository')
        syncRepoLabels()
    }
} catch(err) {
    core.error(err.message)
    core.setFailed(err.message)
}