//  Library
import * as fs from 'fs'
import * as path from 'path'

//  Type Definitions
type testType = { name: string, callback: () => void }

//  =============
//  CRITERIA LITE
//  =============

/** Array of all registered tests */
const tests: testType[] = []

/** Register a new test suite */
export function test(name: string, callback: () => void) {
    tests.push({ name, callback })
}

/** Test stats */
const stats = {
    successes: 0,
    failures: 0,
    total: 0
}

/** fileExtension Regex */
const fileExtension = /\.(test|spec)\.(js|ts)$/

/** Script's Main Function */
function main() {

    //  Parse Command-Line Arguments
    const target = process.argv.slice(2)[0]
    const dir = path.join(process.cwd(), target || 'tests')

    //  Walk over the current directory and require all test files
    const done: string[] = []
    walkDir(dir, (x) => {
        if (fileExtension.test(x)) {
            const fileName = path.basename(x).replace(fileExtension, '')
            if (!fileName || done.includes(fileName)) { return }    //  If a test with the same fileName is already done then skip it
            done.push(fileName)
            console.log('loading: ' + x.replace(fileName, `\u001b[1m${fileName}\u001b[22m`))
            require(x)
        }
    })

    console.log('\n')

    //  Iterate over the map and run all test suites
    tests.forEach(test => {
        //  Try to run the test
        try {
            test.callback()
            //  If the callback doesn't throw an exception, report success
            console.log(`  ✅ ${test.name}`)
            stats.successes++
        } catch (e) {
            const error = e as Error
            //  If exception then report failure and log the error stack
            console.error(`  ❌ \u001b[31m${test.name}\u001b[39m`)
            console.error(error.stack)
            stats.failures++
        } finally {
            stats.total++
        }
    })

    //  Log results
    console.log(`
         \u001b[32mPASS\u001b[39m: ${stats.successes}
         \u001b[31mFAIL\u001b[39m: ${stats.failures}
        \u001b[34mTOTAL\u001b[39m: ${stats.total}
    `)

}

main()

//  =======
//  HELPERS
//  =======

/**
 * Walks the provided path and executes the callback function
 * @param dir Directory to walk
 * @param callback Callback function to execute for every entry
 */
function walkDir(dir: string, callback: (entry: string) => void) {

    fs.readdirSync(dir).forEach(f => {

        const dirPath = path.join(dir, f)
        const isDirectory = fs.statSync(dirPath).isDirectory()

        isDirectory
            ? walkDir(dirPath, callback)
            : callback(path.join(dir, f))

    })

}