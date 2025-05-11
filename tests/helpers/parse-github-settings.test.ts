import { assertEquals } from '@std/assert'
import { parseGithubSettings } from '../../src/helpers/parse-github-settings.ts'

Deno.test('parseGithubSettings returns null if githubPath is missing', async () => {
  const result = await parseGithubSettings(async () => `{
    "name": "my-module"
  }`)

  assertEquals(result, null)
})

Deno.test('parseGithubSettings returns GithubSettings object if githubPath is present', async () => {
  const result = await parseGithubSettings(async () => `{
    "githubPath": "deno-forge/init-git",
    "description": "My awesome module"
  }`)

  assertEquals(result, {
    path: 'deno-forge/init-git',
    owner: 'deno-forge',
    repo: 'init-git',
    description: 'My awesome module',
  })
})

Deno.test('parseGithubSettings handles missing description', async () => {
  const result = await parseGithubSettings(async () => `{
    "githubPath": "deno-forge/init-git"
  }`)

  assertEquals(result, {
    path: 'deno-forge/init-git',
    owner: 'deno-forge',
    repo: 'init-git',
    description: '',
  })
})

Deno.test('parseGithubSettings returns null if config cannot be parsed', async () => {
  const result = await parseGithubSettings(async () => {
    throw new Error('bad json')
  })

  assertEquals(result, null)
})
