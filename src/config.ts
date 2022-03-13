//  Library
import * as core from '@actions/core'
import * as nodePath from 'node:path'

const workspace = process.env.GITHUB_WORKSPACE || ''

//  ======
//  CONFIG
//  ======

/** Boolean to determine if this is a dry-run */
export const isDryRun = core.getBooleanInput('dryrun')

/** Config file-path (default: '.github/labels.yaml') */
export const path = core.getInput('path')

/** Config file-path in the workspace */
export const workspacePath = nodePath.join(workspace, path)

/** Permissions */
export const permissions = {
    create: core.getBooleanInput('create'),
    update: core.getBooleanInput('update'),
    delete: core.getBooleanInput('delete')
}

/** Boolean to determine if an artifact containing an updated labels.yaml should be created */
export const createArtifact = core.getBooleanInput('create-artifact')