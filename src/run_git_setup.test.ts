// deno-lint-ignore-file require-await
import {parseRunGitSetupOptions, runGitSetup} from './run_git_setup.ts'
import { spy, assertSpyCallAsync } from "@std/testing/mock";
import {assertEquals} from "@std/assert";


Deno.test('runGitSetup dry-run integrates all helpers', async () => {
  const injects = {
    checkGitInstalled: async (): Promise<true> => {return true},
    initRepoIfNeeded: async () => {},
    setRemoteOrigin: async () => {},
    printGitHubUrl: async () => {return 'https://github.com/new?owner=test&name=repo'},
    parseGithubSettings: async () => {return {path: 'test/repo',owner: 'test', repo: 'repo'}},
  }
  const spies = {
    checkGitInstalled: spy(injects, 'checkGitInstalled'),
    initRepoIfNeeded: spy(injects, 'initRepoIfNeeded'),
    setRemoteOrigin: spy(injects, 'setRemoteOrigin'),
    printGitHubUrl: spy(injects, 'printGitHubUrl'),
    parseGithubSettings: spy(injects, 'parseGithubSettings'),
  }

  await runGitSetup({dryRun: true}, injects)
  assertSpyCallAsync(spies.checkGitInstalled, 0)
  assertSpyCallAsync(spies.parseGithubSettings, 0)
  assertSpyCallAsync(spies.initRepoIfNeeded, 0)
  assertSpyCallAsync(spies.setRemoteOrigin, 0,{
    args: ['test/repo', true],
  })
  assertSpyCallAsync(spies.printGitHubUrl, 0, {
    args: [{owner:'test','path':'test/repo','repo':'repo'}, {dryRun: true, open: true}],
  })

})

Deno.test('parseRunGitSetupOptions returns defaults when no args are passed', () => {
  const result = parseRunGitSetupOptions([])
  assertEquals(result, {
    branchName: 'main',
    dryRun: false,
    noCommit: false,
    open: false,
  })
})

Deno.test('parseRunGitSetupOptions parses all flags correctly', () => {
  const result = parseRunGitSetupOptions([
    '--branch=dev',
    '--dry-run',
    '--no-commit',
    '--open'
  ])

  assertEquals(result, {
    branchName: 'dev',
    dryRun: true,
    noCommit: true,
    open: true,
  })
})
