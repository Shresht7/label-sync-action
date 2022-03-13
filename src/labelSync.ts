//  Library
import * as core from '@actions/core'
import * as github from '@actions/github'
import { syncConfigLabels, syncRepoLabels } from './library'
import * as config from './config'

//  ==========
//  LABEL SYNC
//  ==========

/** Label-Sync-Action */
async function labelSync() {

    if (github.context.eventName === 'label' && !config.readonly) {     //  If the action was triggered by the label webhook event

        core.info(`Synchronizing labels from your repository to ${config.path}`)
        await syncConfigLabels()

    } else {    //  If the action was triggered on push or manually by workflow dispatch

        core.info(`Synchronizing labels from ${config.path} to your repository`)
        await syncRepoLabels()

    }

}


//  --------------------
export default labelSync
//  --------------------