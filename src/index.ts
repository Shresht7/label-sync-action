import * as core from '@actions/core'
import * as github from '@actions/github'

try {
    console.log(github.context.repo.owner)
} catch(err) {
    core.setFailed(err.message)
}