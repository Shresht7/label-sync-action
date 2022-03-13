//  Library
import * as fs from 'node:fs'
import * as yaml from 'js-yaml'
import isUrl from 'is-url-superb'

/** Read Config File from given path/url */
export const readConfigFile = (path: string) => isUrl(path)
    ? fetch(path).then(res => res.text())
    : fs.promises.readFile(path, { encoding: 'utf-8' })

/** Parse config file contents */
export function parseConfig<T extends any[]>(contents: string, ext: string = 'yml'): T {
    let result = []

    if (ext.endsWith('json')) {
        result = JSON.parse(contents) as T
    } else if (ext.endsWith('yml') || ext.endsWith('yaml')) {
        result = yaml.load(contents) as T
    } else {
        throw new Error('Incompatible config format. Please provide a `yaml` or `json` file.')
    }

    if (!Array.isArray(result)) { throw new Error('Config is not an array!') }

    return result
}