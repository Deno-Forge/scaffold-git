# deno-forge/scaffold-git

[![jsr](https://img.shields.io/badge/jsr--%40deno-forge%2Fscaffold-git-blue?logo=deno)](https://jsr.io/@deno-forge/scaffold-git)
[![GitHub](https://img.shields.io/badge/GitHub-Deno-Forge/scaffold-git-blue?logo=github)](https://github.com/Deno-Forge/scaffold-git)

Initializes a local Git repository for a Deno module and assists the user in configuring it for GitHub

This utility is part of the [Deno Forge](https://github.com/deno-forge) toolchain and works seamlessly with `deno.json(c)` files created by other Forge modules.

## Usage

```bash
deno run --allow-read --allow-write --allow-run jsr:@deno-forge/scaffold-git
```

### Options

- `--dry-run` – print commands instead of executing them
- `--no-commit` – skip initial commit
- `--open` – open the GitHub repository creation page (default: true)
- `--branch=<name>` – specify a branch name (default: main)

### Permissions
- `--allow-read` - required for parsing the deno.json(c) file
- `--allow-write` - required for writing the .gitignore file
- `--allow-run` - required for running `git` commands via shell


## Advanced Usage

```ts
import { runGitSetup } from "jsr:@deno-forge/scaffold-git"

await runGitSetup({
  dryRun: true,
  branchName: "main",
  noCommit: false,
  open: true,
})
```

## 📁 Requirements

- Git must be installed and available in the system path.
- Your project must include a `deno.json` or `deno.jsonc` with a valid `githubPath` like `"owner/repo"`.
- Optionally include a `description` to prefill the GitHub repo description field.

## 📦 Part of Deno Forge

This module is maintained by the Deno Forge project — a set of tools designed to make publishing high-quality Deno modules fast and frictionless.