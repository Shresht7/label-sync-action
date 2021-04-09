import { octokit, github, GitHubLabel, ConfigYAML, LabelsMap } from './typedefs'

//  ==========
//  GET LABELS
//  ==========

//  Gets all labels in current repository
export const getLabels = async (octokit: octokit, github: github): Promise<GitHubLabel[]> => {
    //  Fetch Labels for current repo
    const { data } = await octokit.issues.listLabelsForRepo({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo
    })

    //  Returns a sub-set of data
    const labels = data.map(label => ({
            name: label.name,
            color: label.color,
            description: label.description
        })
    )

    return labels
}

//  ===========
//  READ LABELS
//  ===========

//  Reads labels from .github/labels.yaml
export const readLabels = (config: ConfigYAML) => {
    let labels: GitHubLabel[] = config.repoLabels

    //  Remaps labels array after removing # from colors (if any)
    labels = labels.map(label => ({
        ...label,
        color: label.color[0] === '#' ? label.color.substr(1) : label.color
    }))

    return labels
}

//  ===========
//  SORT LABELS
//  ===========

//  Sorts label into create, update and delete categories
export const labelSorter = (existingLabelsMap: LabelsMap, configLabelsMap: LabelsMap): string[][] => {
    const createLabels: string[] = []
    const updateLabels: string[] = []
    const deleteLabels: string[] = []

    //  Create and Update lists
    configLabelsMap.forEach((label, labelName) => {

        //  If Label already exists ...
        if (existingLabelsMap.has(labelName)) {
            const existingLabel = existingLabelsMap.get(labelName)
            //  ... and has property mismatch
            if (label.color !== existingLabel?.color || label.description !== existingLabel.description) {
                updateLabels.push(labelName)    //  Sort in updateLabels array
            }

        //  If Label does not exist
        } else {
            createLabels.push(labelName)    //  Sort in createLabels array
        }
    })

    //  Delete list
    existingLabelsMap.forEach((label, labelName) => {
        !configLabelsMap.has(labelName) && deleteLabels.push(labelName)
    })

    return [createLabels, updateLabels, deleteLabels]
}

//  ===================
//  WRITE LABEL MESSAGE
//  ===================

//  Returns the label message to be displayed on console
export const writeLabelMessage = (mode: 'CREATE'|'UPDATE'|'DELETE', label: GitHubLabel): string => {

    //  Maps modes to ANSI colors
    const colorMap = {
        CREATE: '\u001b[32;1m',
        UPDATE: '\u001b[34;1m',
        DELETE: '\u001b[31;1m',
        RESET: '\u001b[0m'
    }

    //  Colors the given string with hex color (converted to ANSI)
    const colorString = (str: string, hex: string) => {
        hex = hex.toString()[0] === '#' ? hex.substr(1) : hex || 'ffffff'
        const r = parseInt(hex.substring(0, 2), 16)
        const g = parseInt(hex.substring(2, 4), 16)
        const b = parseInt(hex.substring(4, 6), 16)
    
        return `\u001b[38;2;${r};${g};${b}m${str}${colorMap.RESET}`
    }

    return `${colorMap[mode]}${mode[0] + mode.slice(1, -1).toLowerCase() + 'ing'}${colorMap.RESET} ${colorString(label.name, label.color)} (${label.description})`
}