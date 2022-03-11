//  Library
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as yaml from 'js-yaml'
import * as config from './config'

//  Type Definitions
import type { GitHubLabel, LabelMap } from '../types'

const workspace = process.env.GITHUB_WORKSPACE || ''
const configPath = path.join(workspace, config.path)

/** Reads labels from '.github/labels.yaml  file and returns a LabelMap */
export async function getConfigLabels(): Promise<LabelMap> {

    //  Read config file from directory
    const file: string = await fs.promises.readFile(configPath, { encoding: 'utf-8' }).catch(_ => "")

    const configLabels: LabelMap = new Map()
    const labels: GitHubLabel[] = yaml.load(file) as GitHubLabel[]
    labels.forEach(label => configLabels.set(label.name, label))

    return configLabels

}