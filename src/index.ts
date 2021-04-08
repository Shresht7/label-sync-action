import * as core from '@actions/core'
import * as github from '@actions/github'
import { GitHub } from '@actions/github/lib/utils'

import { readYAML } from './config'
import { colorString, getLabels, labelSorter, readLabels } from './utils'

import {  LabelsMap } from './typedefs'

//  =======
//  OCTOKIT
//  =======

const GITHUB_ACCESS_TOKEN = process.env.GITHUB_TOKEN
const octokit = new GitHub({ auth: GITHUB_ACCESS_TOKEN })

//  ===========
//  YAML CONFIG
//  ===========

const config = readYAML(core)

//  =================
//  RUN GITHUB ACTION
//  =================

//  Runs the GitHub Action
const runAction = async () => {

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
    
    //  CREATE LABELS
    //  =============

    core.info('\u001b[37;1m\nCREATE LABELS\u001b[0m')
    createLabels.forEach(async (labelName) => {
        const label = configLabelsMap.get(labelName)
        if (!label) { return }
        core.info(`\u001b[32;1mCreating\u001b[0m ${colorString(label.name, label?.color)} (${label?.description})`)
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

    core.info('\u001b[37;1m\nUPDATE LABELS\u001b[0m')
    updateLabels.forEach(async (labelName) => {
        const label = configLabelsMap.get(labelName)
        if (!label) { return }
        core.info(`\u001b[34;1mUpdating\u001b[0m ${colorString(label.name, label.color)} (${label?.description})`)
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

    core.info('\u001b[37;1m\nDELETE LABELS\u001b[0m')
    deleteLabels.forEach(async (labelName) => {
        const label = existingLabelsMap.get(labelName)
        if (!label) { return }
        core.info(`\u001b[31;1mDeleting\u001b[0m ${colorString(label.name, label.color)} (${label?.description})`)
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
try { runAction() }
catch(err) { core.setFailed(err.message) }