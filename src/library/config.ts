//  Library
import * as nodePath from 'node:path'
import * as core from '@actions/core'

//  ======
//  CONFIG
//  ======

export const isDryRun = core.getBooleanInput('dryrun') || false

const workspaceURL = process.env.GITHUB_WORKSPACE || ''

/** Name of config file  */
export const fileName = 'labels.yaml'    //  .github/labels.yaml

/** Path to config file */
export const path = nodePath.join('.github', fileName)

/** Path URL */
export const pathURL = nodePath.join(workspaceURL, path)

/** Permissions */
export const permissions = {
    create: core.getBooleanInput('create'),
    update: core.getBooleanInput('update'),
    delete: core.getBooleanInput('delete')
}

/** Commit message to show */
export const commitMessage = core.getInput('commitmessage', { required: true })