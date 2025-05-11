import { assertEquals } from '@std/assert'
import {getPlatformOpenCommand, printGitHubUrl} from '../../src/helpers/print-github-url.ts'
import { mockConsoleLog, mockDenoCommand } from "../test-helpers.ts";


const defaultSettings = {
  path: 'init-git/deno-forge',
  owner: 'deno-forge',
  repo: 'init-git',
}



Deno.test('prints URL but does not open in dry-run', async () => {
  const { consoleLog, messages } = mockConsoleLog()
  const { MockCommand, calls } = mockDenoCommand()

  const url = await printGitHubUrl(defaultSettings, { open: true, dryRun: true }, {commandClass: MockCommand, log: consoleLog})

  const expectedUrl = 'https://github.com/new?owner=deno-forge&name=init-git&description=Deno%20for%20the%20masses!&visibility=public'
  assertEquals(messages[0], `🔗 Create your repo on GitHub: ${expectedUrl}`)
  assertEquals(messages[1], `[dry-run] open ${expectedUrl}`)
  assertEquals(url, expectedUrl)
  assertEquals(calls, [])
})

Deno.test('prints URL and calls injected command to open browser', async () => {
  const { consoleLog, messages } = mockConsoleLog()
  const { MockCommand, calls } = mockDenoCommand()

  const url = await printGitHubUrl(
      defaultSettings,
      { open: true },
      { log: consoleLog, commandClass: MockCommand }
  )

  const expectedUrl = 'https://github.com/new?owner=deno-forge&name=init-git&description=Deno%20for%20the%20masses!&visibility=public'
  assertEquals(messages[0], `🔗 Create your repo on GitHub: ${expectedUrl}`)
  assertEquals(calls.length, 1)
  assertEquals(calls[0].length, 2) // [openCmd, url]
  assertEquals(calls[0][1], expectedUrl)
  assertEquals(url, expectedUrl)
})

Deno.test('getPlatformOpenCommand returns correct command for each platform', () => {
  assertEquals(getPlatformOpenCommand('darwin'), 'open')
  assertEquals(getPlatformOpenCommand('windows'), 'start')
  assertEquals(getPlatformOpenCommand('linux'), 'xdg-open')
  assertEquals(getPlatformOpenCommand('sunos'), 'xdg-open') // fallback
})
