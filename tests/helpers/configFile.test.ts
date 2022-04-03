//  Library
import { readConfigFile, parseConfig } from '../../src/helpers/configFile'

describe('Read Config File', () => {

    it('should read config file from the local workspace', async () => {
        const contents = await readConfigFile('./package.json')
        const data = JSON.parse(contents)
        expect(data.name).toBe('label-sync')
    })

    //? Node fetch is not implemented
    // it('should read config file from a remote URL', async () => {
    //     const contents = await readConfigFile('https://raw.githubusercontent.com/Shresht7/label-sync-action/main/package.json')
    //     const data = JSON.parse(contents)
    //     expect(data.name).toBe('label-sync')
    // })

    it('should parse JSON files', () => {
        const contents = JSON.stringify(['1', '2', '3'])
        const data = parseConfig(contents, 'json')
        expect(data).toStrictEqual(['1', '2', '3'])
    })

    it('should parse YAML files', () => {
        const contents = `
            - id: 1
              name: john
            - id: 2
              name: jane
        `
        const data = parseConfig(contents, 'yaml')
        expect(data).toStrictEqual([{ id: 1, name: 'john' }, { id: 2, name: 'jane' }])
    })

    it('should parse YML files', () => {
        const contents = `
            - id: 1
              name: john
            - id: 2
              name: jane
        `
        const data = parseConfig(contents, 'yml')
        expect(data).toStrictEqual([{ id: 1, name: 'john' }, { id: 2, name: 'jane' }])
    })


})