//  ================
//  TYPE DEFINITIONS
//  ================

import { Octokit } from "@octokit/core"
import { PaginateInterface } from '@octokit/plugin-paginate-rest'
import { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types'

export type octokit = { [x: string]: any } & { [x: string]: any } & Octokit & RestEndpointMethods & { paginate: PaginateInterface }
export type github = typeof import("@actions/github")
export type core = typeof import("@actions/core")

export interface GitHubLabel {
    name: string
    description: string | null
    color: string
}

export interface ConfigYAML {
    dryRun?: boolean
    create?: boolean
    update?: boolean
    delete?: boolean
    repoLabels: GitHubLabel[]
    commitMessage: string
}

export type LabelsMap = Map<string, GitHubLabel>