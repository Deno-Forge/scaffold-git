import { parseArgs } from '@std/cli/parse-args'
import { parseGithubSettings } from "./parse_github_settings.ts";
import { checkGitInstalled } from './check_git_installed.ts'
import { initGitRepo } from './init_git_repo.ts'
import { setRemoteOrigin } from './set_remote_origin.ts'
import { printGitHubUrl } from './print_github_url.ts'

type Injects = {
  parseGithubSettings: typeof parseGithubSettings
  checkGitInstalled: typeof checkGitInstalled
  initRepoIfNeeded: typeof initGitRepo
  setRemoteOrigin: typeof setRemoteOrigin
  printGitHubUrl: typeof printGitHubUrl
}

const defaultInjects: Injects = {
  parseGithubSettings: parseGithubSettings,
  checkGitInstalled: checkGitInstalled,
  initRepoIfNeeded: initGitRepo,
  setRemoteOrigin: setRemoteOrigin,
  printGitHubUrl: printGitHubUrl,
}

export type RunGitSetupOptions = {
  branchName?: string,
  dryRun?: boolean,
  noCommit?: boolean,
  open?: boolean,
}

export async function runGitSetup(
    {branchName = 'main', dryRun = false, noCommit = false, open = true}: RunGitSetupOptions = {},
    injects: Injects = defaultInjects
): Promise<void> {
  const {
    parseGithubSettings,
    checkGitInstalled,
    initRepoIfNeeded,
    setRemoteOrigin,
    printGitHubUrl,
  } = injects

  // Step 1: Ensure Git is installed
  await checkGitInstalled()

  // Step 2: Parse Git settings from deno.json(c)
  const config = await parseGithubSettings()

  // Step 3: Init repo if needed (creates .gitignore)
  await initRepoIfNeeded({branchName, dryRun, noCommit})

  // Step 4: Set remote origin and print URL
  if (config) {
    await setRemoteOrigin(config.path, dryRun)
    await printGitHubUrl(config, { open, dryRun })
  }
}

export function parseRunGitSetupOptions(
    denoArgs: typeof Deno.args = Deno.args,
): RunGitSetupOptions {
  const args = parseArgs(denoArgs, {
    boolean: ['dry-run', 'no-commit', 'open'],
    string: ['branch'],
    default: {
      branch: 'main',
      dryRun: false,
      noCommit: false,
      open: false,
    }
  })

  return {
    branchName: args['branch'],
    dryRun: args['dry-run'],
    noCommit: args['no-commit'],
    open: args['open'],
  }
}