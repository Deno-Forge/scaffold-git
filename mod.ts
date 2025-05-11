export { runGitSetup, parseRunGitSetupOptions } from './src/run.ts'
export type { RunGitSetupOptions } from './src/run.ts'

if (import.meta.main) {
  const { runGitSetup, parseRunGitSetupOptions } = await import('./src/run.ts')
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