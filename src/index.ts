//  Library
import * as core from '@actions/core'
import labelSync from './labelSync'

//  ====
//  MAIN
//  ====

labelSync()
    .then(() => core.info('Synchronization Complete!'))
    .catch(error => core.setFailed(error))
