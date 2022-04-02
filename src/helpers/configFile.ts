//  Library
import * as fs from 'node:fs'
import * as yaml from 'js-yaml'
import { isURL } from './isURL'

/** Read file from the given path or url */
export async function readConfigFile(src: string) {
    return isURL(src)
        ? readFromURL(src)
        : readFromFile(src)
}

/** Read from the given URL */
function readFromURL(url: string): Promise<string> {
    return fetch(url)
        .then(res => {
            if (res.ok) {
                return res.text()
            } else {
                throw new Error(`Failed to read from ${url}`)
            }
        })
}

/** Read from the given path */
function readFromFile(src: string): Promise<string> {
    return fs.promises.readFile(src, { encoding: 'utf-8' })
}

/** Parse config file contents */
export function parseConfig<T extends any[]>(contents: string, ext: string = 'yml'): T {
    let result = []

    if (ext.endsWith('json')) {
        result = JSON.parse(contents) as T
    }
    else if (ext.endsWith('yml') || ext.endsWith('yaml')) {
        result = yaml.load(contents) as T
    }
    else {
        throw new Error('Incompatible config format. Please provide a `yaml` or `json` file.')
    }

    if (!Array.isArray(result)) { throw new Error('Config is not an array!') }

    return result
}