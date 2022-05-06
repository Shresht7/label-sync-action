/** Formats the color to be compliant with GitHub API */
export const formatColor = (color: string) => color.startsWith('#') ? color.substring(1) : color