// deno-lint-ignore-file require-await
import { assertEquals, assertRejects } from '@std/assert'
import {initGitRepo, type GitInitOptions} from './init_git_repo.ts'
import {GitAlreadyInitializedError, GitError} from './errors.ts'
import { mockConsoleLog, mockDenoCommand, mockExists } from "./test_helpers.ts";
import type {createGitIgnore} from "./create_gitignore.ts";

function mockCreateGitIgnore() {
  const gitIgnoreCalls: boolean[] = [];
  const mockCreateIgnore: typeof createGitIgnore = async (dryRun?: boolean) => {
    gitIgnoreCalls.push(dryRun ?? false)
  }
 return {mockCreateIgnore, gitIgnoreCalls}
}

Deno.test('initGitRepo throws GitError when a .git directory exists', async () => {
  const { consoleLog } = mockConsoleLog()
  const { MockCommand, calls } = mockDenoCommand({ success: false, code: 128 })
  const { mockCreateIgnore, gitIgnoreCalls } = mockCreateGitIgnore()

  await assertRejects(
      () =>
          initGitRepo(
              { branchName: 'main' },
              {
                commandClass: MockCommand,
                createGitIgnore: mockCreateIgnore,
                existsFn: mockExists(true),
                consoleLog
              }
          ),
      GitAlreadyInitializedError,
      'Git already initialized. .git directory exists'
  )
  assertEquals(calls, [])
  assertEquals(gitIgnoreCalls.length, 0)
})

Deno.test('initGitRepo runs expected git commands and calls createGitIgnore', async () => {
  const { MockCommand, calls } = mockDenoCommand()
  const { consoleLog, messages } = mockConsoleLog()
  const { mockCreateIgnore, gitIgnoreCalls } = mockCreateGitIgnore()

  const opts: GitInitOptions = {
    branchName: 'main',
  }

  await initGitRepo(opts, {
    commandClass: MockCommand,
    createGitIgnore: mockCreateIgnore,
    existsFn: mockExists(false),
    consoleLog: consoleLog
  })

  assertEquals(calls, [
    ['git', 'init'],
    ['git', 'branch', '-M', 'main'],
    ['git', 'add', '.'],
    ['git', 'commit', '-m', 'Initial commit via deno-forge'],
  ])
  assertEquals(gitIgnoreCalls, [false])
  assertEquals(messages, [
    '✅ Initialized Git repository',
    '✅ Set default branch to main',
    '✅ Staged all files',
    '✅ Committed initial files',
  ])
})

Deno.test('initGitRepo respects dryRun option', async () => {
  const { MockCommand, calls } = mockDenoCommand()
  const { consoleLog, messages } = mockConsoleLog()
  const { mockCreateIgnore, gitIgnoreCalls } = mockCreateGitIgnore()

  const opts: GitInitOptions = {
    branchName: 'main',
    dryRun: true,
    noCommit: false,
  }

  await initGitRepo(opts, {
    commandClass: MockCommand,
    createGitIgnore: mockCreateIgnore,
    existsFn: mockExists(false),
    consoleLog
  })

  assertEquals(calls, [])
  assertEquals(gitIgnoreCalls, [true])
  assertEquals(messages, [
    '🟡 [dry-run] git init',
    '🟡 [dry-run] git branch -M main',
    '🟡 [dry-run] git add .',
    '🟡 [dry-run] git commit -m "Initial commit via deno-forge"',
  ])
})

Deno.test('initGitRepo respects noCommit option', async () => {
  const { MockCommand, calls } = mockDenoCommand()
  const { consoleLog, messages } = mockConsoleLog()
  const { mockCreateIgnore, gitIgnoreCalls } = mockCreateGitIgnore()

  await initGitRepo({
    branchName: 'main',
    dryRun: false,
    noCommit: true,
  }, {
    commandClass: MockCommand,
    createGitIgnore: mockCreateIgnore,
    existsFn: mockExists(false),
    consoleLog
  })

  assertEquals(calls, [
    ['git', 'init'],
    ['git', 'branch', '-M', 'main'],
    ['git', 'add', '.'],
  ])
  assertEquals(gitIgnoreCalls, [false])
  assertEquals(messages, [
    '✅ Initialized Git repository',
    '✅ Set default branch to main',
    '✅ Staged all files',
  ])
})

Deno.test('initGitRepo throws on command failure', async () => {
  const {MockCommand, calls} = mockDenoCommand({success:false, code:128})
  const { consoleLog } = mockConsoleLog()
  const { mockCreateIgnore, gitIgnoreCalls } = mockCreateGitIgnore()

  await assertRejects(
      () =>
          initGitRepo(
              { branchName: 'main' },
              {
                commandClass: MockCommand,
                createGitIgnore: mockCreateIgnore,
                existsFn: mockExists(false),
                consoleLog
              }
          ),
      GitError,
      'Command failed: git init'
  )
  assertEquals(calls, [['git', 'init']])
  assertEquals(gitIgnoreCalls, [])
})

