import { GitError } from '../errors.ts'
import type {CommandConstructor, GithubSettings} from '../types.ts'

export function getPlatformOpenCommand(platform: string = Deno.build.os): string {
  switch (platform) {
    case 'darwin':
      return 'open'
    case 'windows':
      return 'start'
    default:
      return 'xdg-open'
  }
}

type Injects = {
  commandClass: CommandConstructor,
  log: typeof console.log
}
type PrintGitHubUrlOptions = {
  open?: boolean,
  dryRun?: boolean,
}
export async function printGitHubUrl(
    githubSettings: GithubSettings,
    { open = false, dryRun = false }: PrintGitHubUrlOptions = {},
    injects: Injects = { commandClass: Deno.Command, log: console.log }
): Promise<string> {
  const {commandClass, log} = injects
  const {
    owner,
    repo,
    description = "Deno for the masses!"
  } = githubSettings

  const url = `https://github.com/new?owner=${owner}&name=${repo}&description=${encodeURIComponent(description)}&visibility=public`

  log(`🔗 Create your repo on GitHub: ${url}`)

  if (open) {
    if (dryRun) {
      log(`[dry-run] open ${url}`)
    } else {
      const cmd = getPlatformOpenCommand()
      const proc = new commandClass(cmd, { args: [url] })
      await proc.output()
    }
  }

  return url
}
