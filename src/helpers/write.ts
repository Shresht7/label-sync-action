//  Type Definitions
import type { MODE, GitHubLabel } from '../types'

/** Maps modes to ANSI color codes */
const colorMap = {
    CREATE: '\u001b[32;1m',
    UPDATE: '\u001b[34;1m',
    DELETE: '\u001b[31;1m'
}

/** Writes message to the console */
export const write = (mode: MODE, label: GitHubLabel) =>
    `${colorMap[mode]}${mode[0] + mode.slice(1, -1).toLowerCase() + 'ing'}\u001b[0m ${color(label.name, label.color)} ${label.description}`

/** Colors the string using the given hex-code */
function color(str: string, hex: string) {

    hex = hex.startsWith('#') ? hex.slice(1) : hex
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(0, 2), 16)
    const b = parseInt(hex.substring(0, 2), 16)

    return `\u001b[38;2;${r};${g};${b}m${str}\u001b[0m`

}