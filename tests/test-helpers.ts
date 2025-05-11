// deno-lint-ignore-file require-await
import type {CommandOutput} from "../src/types.ts";
import type { exists } from '@std/fs/exists'

export function mockConsoleLog() {
  const messages: string[] = []

  const consoleLog: typeof console.log = (message: string) => {
    messages.push(message)
  };

  return { consoleLog, messages }
}
export function mockDenoCommand(output: CommandOutput = { success: true, code: 0 }) {
  const calls: string[][] = []

  class MockCommand {
    #cmd: string[]
    constructor(cmd: string, opts: { args: string[] }) {
      this.#cmd = [cmd, ...opts.args]
    }
    async output() {
      calls.push(this.#cmd)
      return output
    }
  }

  return { MockCommand, calls }
}

export function mockExists(returnValue: boolean): typeof exists {
  return async (_path: string | URL): Promise<boolean> => {
    return returnValue
  }
}