//  Library
import * as core from '@actions/core'
import labelSync from './labelSync'

//  ====
//  MAIN
//  ====

/** Main entrypoint to the GitHub Action */
async function run() {
    try {
        await labelSync()
        core.notice('🏷 Synchronization Complete! ✅')
    } catch (err) {
        const error = err as Error
        core.error(error)
    }
}

run()