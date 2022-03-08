//  Library
import * as fs from 'node:fs'
import * as yaml from 'js-yaml'
import * as config from './config'

//  Type Definitions
import type { GitHubLabel, LabelMap } from '../types'

/** Reads labels from '.github/labels.yaml  file and returns a LabelMap */
export async function getConfigLabels(): Promise<LabelMap> {

    //  Read config file from directory
    const file: string = await fs.promises.readFile(config.pathURL, { encoding: 'utf-8' })
        .then(res => res)
        .catch(_ => "")

    console.log(file)

    const configLabels: LabelMap = new Map()
    const labels: GitHubLabel[] = yaml.load(file) as GitHubLabel[]
    labels.forEach(label => configLabels.set(label.name, label))

    console.log(labels)
    return configLabels

}