import { assertEquals, assertRejects } from '@std/assert'
import {parseGithubSettings, ParseGithubSettingsInjects, parseDenoConfig, ParseError} from './parse_github_settings.ts'

function mockParseConfig(config: Record<string, unknown> = {}): ParseGithubSettingsInjects{
  return {
    parseConfig: async () => {return config}
  }
}

Deno.test('parseGithubSettings returns null if githubPath is missing', async () => {
  const result = await parseGithubSettings(mockParseConfig({"name": "my-module"}))

  assertEquals(result, null)
})

Deno.test('parseGithubSettings returns GithubSettings object if githubPath is present', async () => {
  const result = await parseGithubSettings(mockParseConfig({
    "githubPath": "deno-forge/init-git",
    "description": "My awesome module"
  }))

  assertEquals(result, {
    path: 'deno-forge/init-git',
    owner: 'deno-forge',
    repo: 'init-git',
    description: 'My awesome module',
  })
})

Deno.test('parseGithubSettings handles missing description', async () => {
  const result = await parseGithubSettings(mockParseConfig({
    "githubPath": "deno-forge/init-git"
  }))

  assertEquals(result, {
    path: 'deno-forge/init-git',
    owner: 'deno-forge',
    repo: 'init-git',
    description: '',
  })
})

Deno.test('parseGithubSettings returns null if config cannot be parsed', async () => {
  const result = await parseGithubSettings({parseConfig: async () => {
    throw new Error('bad json')
  }})

  assertEquals(result, null)
})

Deno.test("parseDenoConfig parses deno.jsonc if available", async () => {
  const mockReadFn = async (path: string|URL) => {
    if (path === "deno.jsonc") return '{ "githubPath": "deno-forge/scaffold-git" }';
    throw new Error("Should not reach deno.json");
  };

  const result = await parseDenoConfig({ readFn: mockReadFn });
  assertEquals(result.githubPath, "deno-forge/scaffold-git");
});

Deno.test("parseDenoConfig falls back to deno.json if deno.jsonc not found", async () => {
  const mockReadFn = async (path: string|URL): Promise<string> => {
    if (path === "deno.jsonc") throw new Error("File not found");
    if (path === "deno.json") return '{ "githubPath": "fallback/repo" }';
    throw new Error("Unexpected path");
  };

  const result = await parseDenoConfig({ readFn: mockReadFn });
  assertEquals(result.githubPath, "fallback/repo");
});

Deno.test("parseDenoConfig throws ParseError on invalid JSON", async () => {
  const mockReadFn = async (_path: string|URL): Promise<string> => "INVALID_JSON";

  await assertRejects(
      () => parseDenoConfig({ readFn: mockReadFn }),
      ParseError,
      "Failed to read deno.json(c).",
  );
});