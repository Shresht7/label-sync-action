//  Library
import * as core from '@actions/core'
import { inputs } from './metadata'

//  ======
//  CONFIG
//  ======

/** Boolean to determine if this is a dry-run */
export const dryrun = core.getBooleanInput(inputs.dryrun)

/** Config file path (default: '.github/labels.yaml') */
export const src = core.getInput(inputs.src)

/** Destination file to write update label config */
export const dest = core.getInput(inputs.dest)

/** Permissions */
export const permissions = {
    create: core.getBooleanInput(inputs.create),
    update: core.getBooleanInput(inputs.update),
    delete: core.getBooleanInput(inputs.delete)
}