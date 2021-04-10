import * as core from '@actions/core'
import * as github from '@actions/github'

import config from './config'

import syncRepoLabels from './lib/syncRepoLabels'
import syncSynLabels from './lib/syncSynLabels'

//  =======
//  OCTOKIT
//  =======

const GITHUB_ACCESS_TOKEN = process.env.GITHUB_TOKEN || ''
!GITHUB_ACCESS_TOKEN && core.setFailed(`Invalid GITHUB_ACCESS_TOKEN`)
const octokit = github.getOctokit(GITHUB_ACCESS_TOKEN)

//  =====================
//  EXECUTE GITHUB ACTION
//  =====================

if (github.context.eventName === 'label') { //  If action was triggered by the label webhook event (when user changes the labels manually)
    core.info('Syncing your changes with ./github/labels.yaml')

    //  Sync user's changes to .github/labels.yaml file
    syncSynLabels(config, core, octokit, github)
        .then(() => core.info(`Your changes have been synced to ${config.path}`))
        .catch((err) => core.setFailed(err))

} else {    //  If the action was triggered on push or manually by workflow_dispatch //TODO:  Use better else clause if possible
    core.info('Syncing labels from ./github/labels.yaml to your repository')
    
    //  Sync label-data from .github/labels.yaml to this repository
    syncRepoLabels(config, core, octokit, github)
        .then(() => core.info(`Successfully synced label-data from ${config.path} to this repository`))
        .catch((err) => core.setFailed(err))
}
