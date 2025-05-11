import {GitError} from "../errors.ts";
import type {CommandConstructor} from "../types.ts";


type Injects = {
  commandClass: CommandConstructor
}

/** Checks if git is installed and available in the PATH */
export async function checkGitInstalled(injects: Injects = {commandClass: Deno.Command}): Promise<true> {
  try {
    const command = new injects.commandClass('git', {args: ['--version']})
    await command.output()
    return true
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      throw new GitError('Git is not installed or not available in your PATH. Please install Git before proceeding.')
    }
    throw err
  }
}