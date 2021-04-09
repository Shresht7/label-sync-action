import * as path from 'path'    //  Path module
import * as core from '@actions/core'   //  GitHub Action toolkit core

import { Config } from './typedefs' //  Type definitions

//  =============
//  CONFIG INPUTS
//  =============

const workspaceURL = process.env.GITHUB_WORKSPACE || ''
let fileName = 'labels.yaml'    //  .github/labels.yaml
const filePath = path.join('.github', fileName)

//  Converts core.getInput() -> string to a boolean
const convertStrToBoolean = (str: string): boolean => str.toLowerCase() === 'true'

const config: Config = {
    fileName,
    commitMessage: core.getInput('commitmessage', { required: true }),
    dryRun: convertStrToBoolean(core.getInput('dryrun')) ?? false,
    path: filePath,
    pathURL: path.join(workspaceURL, filePath),
    permission: {
        create: convertStrToBoolean(core.getInput('create')),
        update: convertStrToBoolean(core.getInput('update')),
        delete: convertStrToBoolean(core.getInput('delete'))
    },
    firstRun: false
}

//  =================
export default config
//  =================