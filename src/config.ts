import * as fs from 'fs'
import * as path from 'path'
import * as YAML from 'yaml'

import { ConfigYAML, core } from "./typedefs"

//  ================
//  READ CONFIG YAML
//  ================

export const readYAML = (core: core): ConfigYAML => {
    //  Get Workspace URL
    const workspaceURL = process.env.GITHUB_WORKSPACE || ''
    if (!workspaceURL) { core.setFailed('Failed to read GitHub workspace URL') }

    //  Read Labels from ./.github/labels.yaml
    let file
    const targetDir = path.join('.github', 'labels.yaml')
    const url = path.join(workspaceURL, '.github', 'labels.yaml')
    try { file = fs.readFileSync(url, 'utf8') }
    catch(err) { core.warning(`Could not read ${targetDir}. Assuming empty file`); file = '' }    //  If readFileSync fails, assume empty yaml
    
    const yaml: ConfigYAML = YAML.parse(file)
    if (!yaml) { core.setFailed(`Failed to read ${targetDir}`) }
    
    return yaml
}