//  Library
import * as core from '@actions/core'
import * as github from '@actions/github'

//  =======
//  OCTOKIT
//  =======

/** GitHub Token */
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''

if (!GITHUB_TOKEN) {
    core.error('Invalid GITHUB_TOKEN');
}

//  --------------------------------------------------
export const octokit = github.getOctokit(GITHUB_TOKEN)
//  --------------------------------------------------