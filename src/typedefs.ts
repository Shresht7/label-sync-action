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
    id: number
    node_id: string
    url: string
    name: string
    description: string | null
    color: string
    default: boolean
}

export interface ConfigYAML {
    dryRun?: boolean
    repoLabels: GitHubLabel[]
}

export type LabelsMap = Map<string, GitHubLabel>