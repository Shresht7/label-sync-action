//  Library
import { inputs, outputs } from '../src/metadata'
import * as fs from 'node:fs'
import * as jsYaml from 'js-yaml'

//  Testing Framework
import { test } from '.'
import * as assert from 'node:assert'

//  Type Definitions
import type { Action, PackageJSON } from './types'

const metadataFile = fs.readFileSync('./action.yml', { encoding: 'utf-8' })
const metadata = jsYaml.load(metadataFile) as Action
const packageJSON = JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf-8' })) as PackageJSON

test('name should be the same as in package.json', () => {
    assert.equal(metadata.name.toLowerCase(), packageJSON.name)
})

test('description should be the same as in package.json', () => {
    assert.equal(metadata.description, packageJSON.description)
})

test('package.json main should point to the main entrypoint of the action', () => {
    assert.equal(metadata.runs.main, packageJSON.main)
})

test('package.json should have the correct build script', () => {
    assert.equal(packageJSON.scripts.build, 'ncc build src/index.ts --license licenses.txt')
})

test('inputs used in the code should match those defined in action metadata file', () => {
    const metadataInputs = Object.keys(metadata?.inputs || {}).sort()
    const codeInputs = Object.values(inputs).sort()
    assert.deepEqual(metadataInputs, codeInputs)
})

test('outputs used in the code should match those defined in the action metadata file', () => {
    const metadataOutputs = Object.keys(metadata?.outputs || {}).sort()
    const codeOutputs = Object.values(outputs).sort()
    assert.deepEqual(metadataOutputs, codeOutputs)
})