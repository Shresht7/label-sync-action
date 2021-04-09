import * as fs from 'fs'
import * as YAML from 'yaml'

import { ConfigYAML, core } from './typedefs'

//  ================
//  READ CONFIG YAML
//  ================

//  Reads and parses ./github/labels.yaml
export const readConfigYAML = (pathURL: string, core: core): [ConfigYAML, boolean] => {
    let file
    let firstRun = false

    try {
        file = fs.readFileSync(pathURL, 'utf8')
    } catch(err) {
        core.warning(`Could not read ${pathURL}. Assuming empty file`)
        file = ''   //  If readFile fails, assume empty yaml
        firstRun = true
    }
    
    //  Parse file
    const config: ConfigYAML = YAML.parse(file)
    
    //  Set defaults
    config.dryRun = config?.dryRun ?? false
    config.create = config?.create ?? true
    config.update = config?.update ?? true
    config.delete = config?.delete ?? false
    config.repoLabels = config?.repoLabels ?? []
    config.commitMessage = config?.commitMessage || 'Update Repo-Labels'

    return [config, firstRun]
}