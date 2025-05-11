import { parse } from '@std/jsonc'
import type { GithubSettings } from '../types.ts'

export class ParseError extends Error {}
export async function parseDenoConfig(readFn: typeof Deno.readTextFile = Deno.readTextFile): Promise<Record<string, unknown>> {
  try {
    const text = await readFn('deno.jsonc')
        .catch(() => readFn('deno.json'))
    return parse(text) as Record<string, unknown>
  } catch {
    throw new ParseError('Failed to read deno.json(c).')
  }
}

export async function parseGithubSettings(readFn: typeof Deno.readTextFile = Deno.readTextFile): Promise<GithubSettings|null>
{
  try {
    const config = await parseDenoConfig(readFn)
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