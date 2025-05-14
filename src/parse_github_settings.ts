import { parse } from '@std/jsonc'
import type { GithubSettings } from './types.ts'


/** @internal */
export type ParseGithubSettingsInjects = {
  parseConfig?: typeof parseDenoConfig
}

/** Parses the Github settings from deno.json(c) */
export async function parseGithubSettings(
    { parseConfig = parseDenoConfig }: ParseGithubSettingsInjects = {},
): Promise<GithubSettings|null>
{
  try {
    const config = await parseConfig()
    const githubPath: string = config.githubPath?.toString() ?? ''
    const description: string = config.description?.toString() ?? ''
    if(!githubPath) {
      return null
    }
    const [owner, repo] = githubPath.split('/')
    return {
      path: githubPath,
      owner,
      repo,
      description,
    }
  }catch(_e){
      return null
  }
}

/** @internal */
export class ParseError extends Error {}
/** @internal */
export type ParseDenoConfigInjects = {
  readFn?: typeof Deno.readTextFile
}
/** @internal */
export async function parseDenoConfig(
    {readFn = Deno.readTextFile}: ParseDenoConfigInjects = {}
): Promise<Record<string, unknown>> {
  try {
    const text = await readFn('deno.jsonc')
        .catch(() => readFn('deno.json'))
    return parse(text) as Record<string, unknown>
  } catch {
    throw new ParseError('Failed to read deno.json(c).')
  }
}