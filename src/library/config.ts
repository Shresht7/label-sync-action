//  Library
import * as core from '@actions/core'

//  ======
//  CONFIG
//  ======

/** Boolean to determine if this is a dry-run */
export const isDryRun = core.getBooleanInput('dryrun') || false

/** Config file path (default: '.github/labels.yaml') */
export const path = core.getInput('path')

/** Permissions */
export const permissions = {
    create: core.getBooleanInput('create'),
    update: core.getBooleanInput('update'),
    delete: core.getBooleanInput('delete')
}

/** Commit message to show */
export const commitMessage = core.getInput('commit-message', { required: true })