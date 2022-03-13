//  Library
import * as github from '@actions/github'
import { octokit } from './octokit'

//  Type Definitions
import type { LabelMap } from '../types'

/** Returns a list of all labels in the current repository */
export async function getRepoLabels(): Promise<LabelMap> {

    const repoLabels: LabelMap = new Map()
    const { owner, repo } = github.context.repo

    //  Fetch labels for current repo
    const labelIterator = octokit.paginate.iterator(octokit.rest.issues.listLabelsForRepo, { owner, repo })
    for await (const { data } of labelIterator) {
        data.forEach(({ name, color, description }) => repoLabels.set(name, { name, color, description }))
    }

    return repoLabels
}