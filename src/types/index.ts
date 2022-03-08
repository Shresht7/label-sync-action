//  ================
//  TYPE DEFINITIONS
//  ================

export type MODE = 'CREATE' | 'UPDATE' | 'DELETE'

export type GitHubLabel = {
    name: string,
    description: string | null,
    color: string
}

export type LabelMap = Map<string, GitHubLabel>