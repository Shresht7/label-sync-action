//  Library
import * as core from '@actions/core'
import { inputs } from './metadata'

//  ======
//  CONFIG
//  ======

/** Boolean to determine if this is a dry-run */
export const isDryRun = core.getBooleanInput(inputs.isDryRun)

/** Config file path (default: '.github/labels.yaml') */
export const config = core.getInput(inputs.config)

/** Permissions */
export const permissions = {
    create: core.getBooleanInput(inputs.create),
    update: core.getBooleanInput(inputs.update),
    delete: core.getBooleanInput(inputs.delete)
}

/** Boolean to determine if an artifact containing an updated labels config should be created */
export const createArtifact = core.getBooleanInput(inputs.createArtifact)