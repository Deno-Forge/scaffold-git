import { GitError } from '../errors.ts'
import type { CommandConstructor } from '../types.ts'
import { createGitIgnore } from './create-gitignore.ts'
import { exists } from '@std/fs/exists'

export interface GitInitOptions {
  branchName: string
  dryRun?: boolean
  noCommit?: boolean
}

export interface Injects {
  commandClass: CommandConstructor
  createGitIgnore: typeof createGitIgnore
  existsFn: typeof exists
  consoleLog: typeof console.log
}
export class GitAlreadyInitializedError extends Error {}
export async function initGitRepo(
    options: GitInitOptions,
    injects: Injects = {
      commandClass: Deno.Command,
      createGitIgnore: createGitIgnore,
      existsFn: exists,
      consoleLog: console.log,
    }
): Promise<void> {
  const { branchName, dryRun, noCommit } = options
  const { commandClass, createGitIgnore, consoleLog, existsFn } = injects

  function shellEscape(arg: string): string {
    return arg.includes(' ') ? `"${arg}"` : arg
  }

  async function run(cmd: string[], desc?: string) {
    if (dryRun) {
      consoleLog(`🟡 [dry-run] ${cmd.map(shellEscape).join(' ')}`)
      return
    }
    const command = new commandClass(cmd[0], { args: cmd.slice(1) })
    const { success } = await command.output()
    if (!success) {
      throw new GitError(`Command failed: ${cmd.join(' ')}`)
    }
    if (desc) {
      consoleLog(`✅ ${desc}`)
    }
  }

  // 1. Init if .git doesn't exist
  if (await existsFn('.git')) {
    throw new GitAlreadyInitializedError('Git already initialized. .git directory exists')
  }
  await run(['git', 'init'], 'Initialized Git repository')

  // 2. Set the initial branch
  await run(['git', 'branch', '-M', branchName], `Set default branch to ${branchName}`)

  // 3. Write .gitignore
  await createGitIgnore(dryRun)

  // 4. Stage and optionally commit
  await run(['git', 'add', '.'], 'Staged all files')
  if (!noCommit) {
    await run(['git', 'commit', '-m', 'Initial commit via deno-forge'], 'Committed initial files')
  }
}