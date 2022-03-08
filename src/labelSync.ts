//  Library
import * as core from '@actions/core'
import * as github from '@actions/github'
import { syncConfigLabels, syncRepoLabels } from './library'

//  ==========
//  LABEL SYNC
//  ==========

async function labelSync() {

    if (github.context.eventName === 'label') {     //  If the action was triggered by the label webhook event

        core.info('Synchronizing labels from your repository to `.github/labels.yaml`')
        await syncConfigLabels()
        core.info('Success')

    } else {    //  If the action was triggered on push or manually by workflow dispatch

        core.info('Synchronizing labels from `.github/labels.yaml` to your repository')
        await syncRepoLabels()
        core.info('Success')

    }

}


//  --------------------
export default labelSync
//  --------------------