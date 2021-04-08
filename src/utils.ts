import { octokit, github, GitHubLabel, ConfigYAML } from './typedefs'

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

    return data
}

//  ===========
//  READ LABELS
//  ===========

//  Reads labels from .github/labels.yaml
export const readLabels = (yaml: ConfigYAML) => {
    let labels: GitHubLabel[] = yaml.repoLabels
    //  Formats color property
    const formatColor = (color: string|number) => {
        color = color.toString()
        if (color[0] === '#') {
            color = color.substr(1)
        }
        return color
    }

    //  Remaps labels array
    labels = labels.map(label => ({
        ...label,
        color: formatColor(label.color)
    }))

    return labels
}

//  ===========
//  SORT LABELS
//  ===========

//  Sorts label into create, update and delete categories
export const labelSorter = (existingLabelsMap: Map<string, GitHubLabel>, configLabelsMap: Map<string, GitHubLabel>): string[][] => {
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

//  ============
//  COLOR STRING
//  ============

//  Colors the string in core.info messages
export const colorString = (str: string, hex: string) => {
    hex = hex.toString()[0] === '#' ? hex.substr(1) : hex
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    return `\u001b[38;2;${r};${g};${b}m${str}\u001b[0m`
}