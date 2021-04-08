import * as core from '@actions/core'
import * as github from '@actions/github'
import { GitHub } from '@actions/github/lib/utils'

import { readYAML } from './config'
import { colorString, getLabels, labelSorter, readLabels } from './utils'

//  =======
//  OCTOKIT
//  =======

const GITHUB_ACCESS_TOKEN = process.env.GITHUB_TOKEN
const octokit = new GitHub({ auth: GITHUB_ACCESS_TOKEN })

//  ===========
//  YAML CONFIG
//  ===========

const yaml = readYAML(core)

//  =================
//  RUN GITHUB ACTION
//  =================

//  Runs the GitHub Action
const runAction = async () => {
    const existingLabelsMap = new Map()
    const existingLabels = await getLabels(octokit, github)
    existingLabels.forEach(label => existingLabelsMap.set(label.name, label))

    const configLabelsMap = new Map()
    const configLabels = readLabels(yaml)
    configLabels.forEach(label => configLabelsMap.set(label.name, label))

    const [createLabels, updateLabels, deleteLabels] = labelSorter(existingLabelsMap, configLabelsMap)
    
    //  CREATE LABELS
    core.info('\u001b[37;1m\nCREATE LABELS\u001b[0m')
    createLabels.forEach(labelName => {
        const label = configLabelsMap.get(labelName)
        core.info(`\u001b[32;1mCreating\u001b[0m ${colorString(label.name, label.color)} (${label?.description})`)
        if (yaml.dryRun) { return }
        //  DO REAL STUFF HERE
    })
    
    //  UPDATE LABELS
    core.info('\u001b[37;1m\nUPDATE LABELS\u001b[0m')
    updateLabels.forEach(labelName => {
        const label = configLabelsMap.get(labelName)
        core.info(`\u001b[34;1mUpdating\u001b[0m ${colorString(label.name, label.color)} (${label?.description})`)
        if (yaml.dryRun) { return }
        //  DO REAL STUFF HERE
    })
    
    //  DELETE LABELS
    core.info('\u001b[37;1m\nDELETE LABELS\u001b[0m')
    deleteLabels.forEach(labelName => {
        const label = existingLabelsMap.get(labelName)
        core.info(`\u001b[31;1mDeleting\u001b[0m ${colorString(label.name, label.color)} (${label?.description})`)
        if (yaml.dryRun) { return }
        //  DO REAL STUFF HERE
    })
}

//  Try running GitHub Action and catch errors if any
try { runAction() }
catch(err) { core.setFailed(err.message) }