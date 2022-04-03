//  Library
import * as core from '@actions/core'
import { syncRepoLabels } from './library'

//  ==========
//  LABEL SYNC
//  ==========

/** Label-Sync-Action */
async function action() {
    await syncRepoLabels()
    core.notice('🏷 Synchronization Complete! ✅')
}


//  -----------------
export default action
//  -----------------