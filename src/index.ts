//  Library
import * as core from '@actions/core'
import labelSync from './labelSync'

//  ====
//  MAIN
//  ====

async function run() {
    try {
        await labelSync()
    } catch (err) {
        const error = err as Error
        core.setFailed(error)
        process.exit(1)
    }
}

run()