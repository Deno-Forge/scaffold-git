export interface CommandOutput {
  success: boolean
  code?: number
  stdout?: Uint8Array
  stderr?: Uint8Array
  signal?: string | null
}

export interface CommandConstructor {
  new (cmd: string, options: { args: string[] }): {
    output: () => Promise<CommandOutput>
  }
}

export interface GithubSettings {
  path: string,
  owner: string,
  repo: string,
  description?: string,
}