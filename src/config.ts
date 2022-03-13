//  Library
import * as core from '@actions/core'
import * as path from 'node:path'

if (!process.env.GITHUB_WORKSPACE) {
    core.error("Could not find GITHUB_WORKSPACE environment variable. You need to use actions/checkout@v3 action for this action to have access to the repository's workspace")
    process.exit(1)
}
//  ======
//  CONFIG
//  ======

/** Boolean to determine if this is a dry-run */
export const isDryRun = core.getBooleanInput('dryrun')

/** Config file path (default: '.github/labels.yaml') */
export const config = core.getInput('config')

/** Config file path in the workspace */
export const workspacePath = path.join(process.env.GITHUB_WORKSPACE, config)

/** Permissions */
export const permissions = {
    create: core.getBooleanInput('create'),
    update: core.getBooleanInput('update'),
    delete: core.getBooleanInput('delete')
}

/** Boolean to determine if an artifact containing an updated labels config should be created */
export const createArtifact = core.getBooleanInput('artifact')