import {GitError} from "./errors.ts";
import type {CommandConstructor} from "./types.ts";

/** @internal */
export type CheckGitInstalledInjects = {
  commandClass?: CommandConstructor
}

/** Checks if git is installed and available in the PATH */
export async function checkGitInstalled(
    { commandClass = Deno.Command }: CheckGitInstalledInjects = {},
): Promise<true> {
  try {
    const command = new commandClass('git', {args: ['--version']})
    await command.output()
    return true
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      throw new GitError('Git is not installed or not available in your PATH. Please install Git before proceeding.')
    }
    throw err
  }
}