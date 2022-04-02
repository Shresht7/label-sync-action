//  ================
//  TYPE DEFINITIONS
//  ================

export interface ActionInput {
    description: string,
    required: boolean,
    default?: string
}

export interface ActionOutput {
    description: string
}

export interface Action {
    name: string,
    author: string,
    description: string,
    runs: {
        using: string,
        main: string,
    },
    branding?: {
        icon?: string,
        color?: string
    },
    inputs?: Record<string, ActionInput>
    outputs?: Record<string, ActionOutput>
}

export interface PackageJSON {
    name: string,
    description: string,
    main: string,
    scripts: Record<string, string>
}