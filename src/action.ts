//  Library
import * as core from '@actions/core'
import * as github from '@actions/github'
import { syncConfigLabels, syncRepoLabels } from './library'
import { src, dest } from './config'

//  ==========
//  LABEL SYNC
//  ==========

/** Label-Sync-Action */
async function action() {

    if (github.context.eventName === 'label') {     //  If the action was triggered by the label webhook event

        core.info(`Synchronizing labels from your repository to ${dest}`)
        await syncConfigLabels()

    } else {    //  If the action was triggered on push or manually by workflow dispatch or any other means

        core.info(`Synchronizing labels from ${src} to your repository`)
        await syncRepoLabels()

    }

    core.notice('🏷 Synchronization Complete! ✅')

}


//  -----------------
export default action
//  -----------------