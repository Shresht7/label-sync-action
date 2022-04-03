//  Library
import * as core from '@actions/core'
import * as github from '@actions/github'
import * as config from '../config'
import { octokit } from './octokit'

//  Helpers
import { getConfigLabels } from './getConfigLabels'
import { getRepoLabels } from './getRepoLabels'
import { labelSorter } from '../helpers'
import { write } from '../helpers'

/** Syncs labels from .github/labels.yaml to the repository */
export async function syncRepoLabels() {

    const { owner, repo } = github.context.repo
    const configLabels = await getConfigLabels()    //  Get label data from file (.github/labels.yaml)
    const repoLabels = await getRepoLabels()    //  Get label data from the repository

    //  Sort labels into actionable categories
    const { createLabels, updateLabels, deleteLabels } = labelSorter(repoLabels, configLabels)

    //  Show dry-run notice
    if (config.dryrun) { core.warning('NOTE: This is a dry run') }

    //  CREATE LABELS
    //  -------------

    if (config.permissions.create && createLabels.length > 0) {
        core.info('\nCREATE LABELS')

        createLabels.forEach((labelName) => {
            const label = configLabels.get(labelName)   //  Get label object from LabelMap
            if (!label) { return }  //  If label is undefined, exit

            core.info(write('CREATE', label))
            if (config.dryrun) { return }

            octokit.rest.issues.createLabel({
                owner,
                repo,
                name: label.name,
                color: label.color || '#000000',
                description: label.description || ''
            })
        })
    }

    //  UPDATE LABELS
    //  -------------

    if (config.permissions.update && updateLabels.length > 0) {
        core.info('\nUPDATE LABELS')

        updateLabels.forEach((labelName) => {
            const label = configLabels.get(labelName)   //  Get label object from LabelMap
            if (!label) { return }  //  If label is undefined, exit

            core.info(write('UPDATE', label))
            if (config.dryrun) { return }

            octokit.rest.issues.updateLabel({
                owner,
                repo,
                name: label.name,
                color: label.color || '#000000',
                description: label.description || ''
            })
        })
    }

    //  DELETE LABELS
    //  -------------

    if (config.permissions.delete && deleteLabels.length > 0) {
        core.info('\nDELETE LABELS')

        deleteLabels.forEach((labelName) => {
            const label = repoLabels.get(labelName)     //  Get label object from LabelMap
            if (!label) { return }  //  If label is undefined, return

            core.info(write('DELETE', label))
            if (config.dryrun) { return }

            octokit.rest.issues.deleteLabel({
                owner,
                repo,
                name: label.name
            })
        })
    }
}