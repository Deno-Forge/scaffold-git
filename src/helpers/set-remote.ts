import { GitError } from '../errors.ts'
import type {CommandConstructor} from "../types.ts";

type Injects = {
  commandClass: CommandConstructor
  consoleLog: typeof console.log
}

export async function setRemoteOrigin(
    githubPath: string,
    dryRun = false,
    injects: Injects = {
      commandClass: Deno.Command,
      consoleLog: console.log,
    }
): Promise<void> {
  if (!githubPath) {
    throw new GitError('Missing githubPath. Cannot set remote origin.')
  }

  const remoteUrl = `git@github.com:${githubPath}.git`
  const args = ['remote', 'add', 'origin', remoteUrl]

  if (dryRun) {
    injects.consoleLog(`[dry-run] git ${args.join(' ')}`)
    return
  }

  const command = new injects.commandClass('git', { args })
  const { success, code } = await command.output()

  if (!success) {
    throw new GitError(`Failed to set remote origin (exit code ${code})`)
  }
}
