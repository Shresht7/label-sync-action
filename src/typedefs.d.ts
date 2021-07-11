//  ================
//  TYPE DEFINITIONS
//  ================

import { Octokit } from '@octokit/core'
import { PaginateInterface } from '@octokit/plugin-paginate-rest'
import { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types'

export type octokit = { [x: string]: any } & { [x: string]: any } & Octokit & RestEndpointMethods & { paginate: PaginateInterface }
export type github = typeof import('@actions/github')
export type core = typeof import('@actions/core')

//  GitHub Label
//  ============
export interface GitHubLabel {
    name: string    //  Label's name
    description: string | null  //  Label's description
    color: string   //  Label's color code (preferable without the prefix #)
}

//  Config Variable
//  ===============

export interface Config {
    fileName: string    //  SynLabels fileName. always labels.yaml
    commitMessage: string   //  Commit message to show when .github/labels.yaml is updated by the action (default: SynLabels Update)
    dryRun?: boolean    //  If true, no actual changes are made to the repository. (default: true)
    permission: {
        create?: boolean    //  If true, the action has the permission to create labels (default: true)
        update?: boolean    //  If true, the action has the permission to update labels (default: true)
        delete?: boolean    //  If true, the action has the permission to delete labels (default: false)
    }
    path: string    //  Path of the labels.yaml file
    pathURL: string //  Resolved URL path of the labels.yaml file
}

//  LabelsMap
//  ---------

export type LabelsMap = Map<string, GitHubLabel>