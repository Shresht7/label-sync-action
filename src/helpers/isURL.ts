/** Determine if the str is a valid URL */
export function isURL(str: string) {
    try {
        new URL(str)
        return true
    } catch (_) {
        return false
    }
}