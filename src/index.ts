//  Library
import * as core from '@actions/core'
import labelSync from './labelSync'

//  ====
//  MAIN
//  ====

async function run() {
    try {
        await labelSync()
        core.info('Synchronization Complete!')
    } catch (err) {
        const error = err as Error
        core.error(error)
    }
}

run()