// deno-lint-ignore-file require-await
import { assertRejects, assertEquals } from '@std/assert'
import { checkGitInstalled } from './check_git_installed.ts'
import { GitError } from './errors.ts'

Deno.test('checkGit throws helpful error if git is not installed, and calls makeGitCommand correctly', async () => {
  let calledCmd: string | null = null
  let calledOptions: { args: string[] } = {args:[]}

  class MockCommand {
    constructor(public cmd: string, public options: { args: string[] }) {
      calledCmd = cmd
      calledOptions = options
    }
    async output(): Promise<Deno.CommandOutput> {
      throw new Deno.errors.NotFound('git not found')
    }
  }

  await assertRejects(
      () => checkGitInstalled({ commandClass: MockCommand }),
      GitError,
      'Git is not installed or not available in your PATH. Please install Git before proceeding.',
  )

  assertEquals(calledCmd, 'git')
  assertEquals(calledOptions, {args:['--version']})
})

Deno.test('checkGit throws when unexpected error encountered', async () => {
  class MockCommand {
    constructor(public cmd: string, public options: { args: string[] }) {
    }
    async output(): Promise<Deno.CommandOutput> {
      throw new Error('unexpected error')
    }
  }

  await assertRejects(
      () => checkGitInstalled({ commandClass: MockCommand }),
      Error,
      'unexpected error',
  )
})

Deno.test('checkGit returns true if git is installed', async () => {
  let called = false

  class MockCommand {
    constructor(public cmd: string, public options: { args: string[] }) {}
    async output() {
      called = true
      return {
        code: 0,
        success: true,
      }
    }
  }

  const result = await checkGitInstalled({ commandClass: MockCommand })
  assertEquals(result, true)
  assertEquals(called, true)
})
