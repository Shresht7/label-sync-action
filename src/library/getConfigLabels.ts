//  Library
import * as path from 'node:path'
import { src } from '../config'

//  Helpers
import { readConfigFile, parseConfig } from '../helpers'

//  Type Definitions
import type { GitHubLabel, LabelMap } from '../types'


/** Reads labels from the config-file and generates a LabelMap */
export async function getConfigLabels(): Promise<LabelMap> {
    const configLabels: LabelMap = new Map()

    const contents: string = await readConfigFile(src)
    const extension = path.extname(src)

    parseConfig<GitHubLabel[]>(contents, extension)
        .forEach(label => configLabels.set(label.name, label))

    return configLabels

}