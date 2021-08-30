/**
 * Converts a string path to a Regular Expression.
 * Transforms path parameters into named RegExp groups.
 */
 export const pathToRegExp = (path: string): RegExp => {
    const pattern = path
      // Escape literal dots
      .replace(/\./g, '\\.')
      // Escape literal slashes
      .replace(/\//g, '/')
      // Escape literal question marks
      .replace(/\?/g, '\\?')
      // Ignore trailing slashes
      .replace(/\/+$/, '')
      // Replace wildcard with any zero-to-any character sequence
      .replace(/\*+/g, '.*')
      // Replace parameters with named capturing groups
      .replace(
        /:([^\d|^\/][a-zA-Z0-9_]*(?=(?:\/|\\.)|$))/g,
        (_, paramName) => `(?<${paramName}>[^\/]+?)`,
      )
      // Allow optional trailing slash
      .concat('(\\/|$)')
  
    return new RegExp(pattern, 'gi')
}


export type Path = RegExp | string

export interface Match {
  matches: boolean
  params: Record<string, string> | null
}

/**
 * Matches a given url against a path.
 */
export const matchPath = (path: Path, url: string): Match => {
  const expression = path instanceof RegExp ? path : pathToRegExp(path)
  const match = expression.exec(url) || false

  // Matches in strict mode: match string should equal to input (url)
  // Otherwise loose matches will be considered truthy:
  // match('/messages/:id', '/messages/123/users') // true
  const matches =
    path instanceof RegExp ? !!match : !!match && match[0] === match.input

  return {
    matches,
    params: match && matches ? match.groups || null : null,
  }
}
