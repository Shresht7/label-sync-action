//  Library
import * as path from 'node:path'
import * as config from './config'

//  Helpers
import { readConfigFile, parseConfig } from '../helpers'

//  Type Definitions
import type { GitHubLabel, LabelMap } from '../types'

const workspace = process.env.GITHUB_WORKSPACE || ''
const configPath = path.join(workspace, config.path)
const extension = path.extname(config.path)

/** Reads labels from the config-file and generates a LabelMap */
export async function getConfigLabels(): Promise<LabelMap> {
    const configLabels: LabelMap = new Map()

    const contents: string = await readConfigFile(configPath)
    parseConfig<GitHubLabel[]>(contents, extension)
        .forEach(label => configLabels.set(label.name, label))

    return configLabels

}