//  Type Definitions
import type { LabelMap } from '../types'

/** Sort labels into create, update and delete categories */
export function labelSorter(existingLabels: LabelMap, configLabels: LabelMap) {

    const createLabels: string[] = []
    const updateLabels: string[] = []
    const deleteLabels: string[] = []

    //  Create and Update lists
    configLabels.forEach((label, labelName) => {

        //  If Label already exist ...
        if (existingLabels.has(labelName)) {

            const existingLabel = existingLabels.get(labelName)

            //  ... and has property mismatch
            if (label.color !== existingLabel?.color || label.description !== existingLabel?.description) {
                updateLabels.push(labelName)    //  Sort in updateLabels array
            }

        } else { //  If it does not exist ...
            createLabels.push(labelName)        //  Sort in createLabels array
        }

    })

    //  Delete labels
    existingLabels.forEach((_label, labelName) => {
        //  if existing label doesn't exist in the config, delete it
        if (!configLabels.has(labelName)) {
            deleteLabels.push(labelName)
        }
    })

    return { createLabels, updateLabels, deleteLabels }
}