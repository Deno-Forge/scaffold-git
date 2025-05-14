
import { assertRejects, assertEquals } from '@std/assert'
import { setRemoteOrigin } from './set_remote_origin.ts'
import { GitError } from './errors.ts'
import { mockConsoleLog, mockDenoCommand } from "./test_helpers.ts";


Deno.test('setRemoteOrigin throws if githubPath is missing', async () => {
  const { consoleLog, messages } = mockConsoleLog()
  const { MockCommand, calls } = mockDenoCommand()
  await assertRejects(
      () => setRemoteOrigin('', false,{
        commandClass: MockCommand,
        consoleLog: consoleLog
      }),
      GitError,
      'Missing githubPath'
  )
  assertEquals(messages, [])
  assertEquals(calls, [])
})

Deno.test('setRemoteOrigin prints dry-run message', async () => {
  const { consoleLog, messages } = mockConsoleLog()
  const { MockCommand, calls } = mockDenoCommand()
  await setRemoteOrigin('example/repo', true, {
    commandClass: MockCommand,
    consoleLog: consoleLog,
  })

  assertEquals(messages, ['[dry-run] git remote add origin git@github.com:example/repo.git'])
  assertEquals(calls, [])
})

Deno.test('setRemoteOrigin executes command with injected command class', async () => {
  const { consoleLog, messages } = mockConsoleLog()
  const { MockCommand, calls } = mockDenoCommand()

  await setRemoteOrigin('example/repo', false, { commandClass: MockCommand, consoleLog })

  assertEquals(calls, [['git', 'remote', 'add', 'origin', 'git@github.com:example/repo.git']])
  assertEquals(messages,[])
})

Deno.test('setRemoteOrigin throws if git command fails', async () => {
  const { consoleLog, messages } = mockConsoleLog()
  const { MockCommand, calls } = mockDenoCommand({ success: false, code: 128 })

  await assertRejects(
      () => setRemoteOrigin('example/repo', false, { commandClass: MockCommand, consoleLog: consoleLog }),
      GitError,
      'Failed to set remote origin (exit code 128)'
  )
  assertEquals(calls, [['git', 'remote', 'add', 'origin', 'git@github.com:example/repo.git']])
  assertEquals(messages,[])
})