//  Library
import * as artifact from '@actions/artifact'

/** Generate artifacts from the provided file paths */
export function createArtifacts(
    name: string,
    files: string[],
    rootDir: string = './',
    options?: artifact.UploadOptions
) {
    const client = artifact.create()
    return client.uploadArtifact(name, files, rootDir, options)
}