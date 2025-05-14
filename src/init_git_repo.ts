import {GitAlreadyInitializedError, GitError} from './errors.ts'
import type { CommandConstructor } from './types.ts'
import { createGitIgnore as defaultCreateGitIgnore } from './create_gitignore.ts'
import { exists } from '@std/fs/exists'

/** Options for initGitRepo */
export interface GitInitOptions {
  /** The name of the branch to create. Defaults to 'main'. */
  branchName?: string
  /** Whether to run in dry-run mode. Defaults to false. */
  dryRun?: boolean
  /** Whether to skip committing files. Defaults to false. */
  noCommit?: boolean
}

/** @internal */
export type InitGitRepoInjects = {
  commandClass?: CommandConstructor
  createGitIgnore?: typeof defaultCreateGitIgnore
  existsFn?: typeof exists
  consoleLog?: typeof console.log
}
export async function initGitRepo(
    {branchName = 'main', dryRun = false, noCommit = false}: GitInitOptions = {},
    {commandClass = Deno.Command, createGitIgnore = defaultCreateGitIgnore, existsFn = exists, consoleLog = console.log}: InitGitRepoInjects = {},
): Promise<void> {

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