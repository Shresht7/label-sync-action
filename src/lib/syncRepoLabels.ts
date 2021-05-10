import { getRepoLabels, getSynLabels, labelSorter, writeLabelMessage } from '../utils'  //  Utility functions

import { Config, core as coreType, octokit, github } from '../typedefs' //  Type definitions

//  ================
//  SYNC REPO LABELS
//  ================

//  When run, syncs labels from ./github/labels.yaml to the repository
const syncRepoLabels = async (config: Config, core: coreType, octokit: octokit, github: github) => {
    const synLabelsMap = getSynLabels(config)   //  Get label-data from SynLabels file (.github/labels.yaml)
    const repoLabelsMap = await getRepoLabels(octokit, github)  //  Get label-data from the repository

    //  Sort labels into actionable categories
    const [createLabels, updateLabels, deleteLabels] = labelSorter(repoLabelsMap, synLabelsMap)
    
    //  Print Dry-Run notice
    if (config.dryRun) { core.info('\u001b[33;1mNOTE: This is a dry run\u001b[0m') }
    
    //  CREATE LABELS
    //  =============

    if (config.permission.create && createLabels.length > 0) {
        core.info('\nCREATE LABELS')

        createLabels.forEach(async (labelName) => {
            const label = synLabelsMap.get(labelName)   //  Get label from LabelMap
            if (!label) { return } //  If label is undefined then exit
        
            core.info(writeLabelMessage('CREATE', label))
            if (config.dryRun) { return }   //  If Dry-Run then exit
        
            try {
                await octokit.issues.createLabel({
                    owner: github.context.repo.owner,
                    repo: github.context.repo.repo,
                    name: label.name,
                    color: label.color || '000000',
                    description: label.description || ''
                })
            } catch (err) {
                core.setFailed(err)
            }
        })
    }

    
    //  UPDATE LABELS
    //  =============

    if (config.permission.update && updateLabels.length > 0) {
        core.info('\nUPDATE LABELS')

        updateLabels.forEach(async (labelName) => {
            const label = synLabelsMap.get(labelName)   //  Get label from LabelMap
            if (!label) { return }  //  If label is undefined then exit

            core.info(writeLabelMessage('UPDATE', label))
            if (config.dryRun) { return }   //  If Dry-Run then exit
            
            try {
                await octokit.issues.updateLabel({
                    owner: github.context.repo.owner,
                    repo: github.context.repo.repo,
                    name: label.name,
                    color: label.color || '000000',
                    description: label.description || ''
                })
            } catch (err) {
                core.setFailed(err)
            }
        })
    }
    
    //  DELETE LABELS
    //  =============

    if (config.permission.delete && deleteLabels.length > 0) {
        core.info('\nDELETE LABELS')

        deleteLabels.forEach(async (labelName) => {
            const label = repoLabelsMap.get(labelName)  //  Get label from LabelMap
            if (!label) { return }  //  If label is undefined then exit

            core.info(writeLabelMessage('DELETE', label))
            if (config.dryRun) { return }   //  If Dry-Run then exit

            try {
                await octokit.issues.deleteLabel({
                    owner: github.context.repo.owner,
                    repo: github.context.repo.repo,
                    name: label.name
                })
            } catch (err) {
                core.setFailed(err)
            }
        })
    }
}

//  =========================
export default syncRepoLabels
//  =========================