export { runGitSetup, parseRunGitSetupOptions, type RunGitSetupOptions } from './src/run_git_setup.ts'

if (import.meta.main) {
  const { runGitSetup, parseRunGitSetupOptions } = await import('./src/run_git_setup.ts')
  const options = parseRunGitSetupOptions()

  try {
    await runGitSetup(options)
    console.log('%c✅ Git Setup complete.', 'color:limegreen')
    Deno.exit(0)
  } catch (err) {
    console.error('%c❌ %s', 'color:indianred', err instanceof Error ? err.message : String(err))
    Deno.exit(1)
  }
}