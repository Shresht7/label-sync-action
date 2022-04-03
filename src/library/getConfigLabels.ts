//  Library
import * as path from 'node:path'
import { config } from '../config'

//  Helpers
import { readConfigFile, parseConfig } from '../helpers'

//  Type Definitions
import type { GitHubLabel, LabelMap } from '../types'


/** Reads labels from the config-file and generates a LabelMap */
export async function getConfigLabels(): Promise<LabelMap> {
    const configLabels: LabelMap = new Map()

    for (const cfg of config) {
        const contents: string = await readConfigFile(cfg)
        const extension = path.extname(cfg)

        parseConfig<GitHubLabel[]>(contents, extension)
            .forEach(label => configLabels.set(label.name, label))
    }

    return configLabels

}