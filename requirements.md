# @deno-forge/init-git – Requirements Document

## Overview

This module initializes a local Git repository for a Deno module and assists the user in configuring it for GitHub. It replaces GitHub CLI integration with a web-based repository creation link, using the `githubPath` field from `deno.json(c)`. No GitHub CLI is required.

## Features

### 🧱 Local Git Setup

- [x] Verify that Git is installed and available in the system path (at runtime)
  - If not found, print a helpful error message and exit
  - Example message: `❌ Git is not installed or not available in your PATH. Please install Git before proceeding.`
- [x] Initialize a Git repository if `.git` is not present
  - `git init`
- [x] Configure the initial branch name
  - Default: `main`
  - Configurable via flag or prompt
- [x] Create a `.gitignore` file
  - Templates:
    - `deno` (default)
    - `minimal`
    - `custom` (optional user path)
- [x] Stage and commit all project files
  - `git add .`
  - `git commit -m "Initial commit via deno-forge"`
- [x] Set the remote origin
  - Always performed if `githubPath` is available
  - Uses SSH format: `git remote add origin git@github.com:<githubPath>.git`

### 🌐 GitHub Integration (via Web)

- [x] Use the `githubPath` property from `deno.json(c)` to generate a "Create Repository" URL that opens the GitHub "Create a new repository" page with fields prefilled
  - Example: `https://github.com/new?name=deno-awesome&owner=jaredhall`
  - If `githubPath` is missing, print a warning and skip this step
- [x] Print this URL to the console after initializing the local Git repo
- [x] Optional flag `--open` to automatically open the URL in the user’s browser

### ⚙️ Optional CLI Flags

- `--dry-run`: Print all commands instead of executing them
- `--no-commit`: Skip the initial commit
- `--push`: Push to remote origin after creation (assumes the GitHub repo already exists)
- `--open`: Open the "Create GitHub repository" URL in a browser
- `--ignore-template`: Specify `.gitignore` template to use (e.g., `deno`, `minimal`)

## Future Features (Not Yet Implemented)

- [ ] Add `.gitattributes` configuration for cross-platform consistency (e.g. text normalization)
- [ ] Support non-GitHub providers (e.g., GitLab)

## Assumptions

- Git is required and will be verified at runtime
- User will create a GitHub repository manually using the provided link
- `deno.json(c)` has been created by `@deno-forge/init-config` and includes a valid `githubPath`. If missing, GitHub-related features are skipped with a warning.

## Dependencies

- Requires:
  - Git (CLI) – must be present in the user path; verified at runtime
- Optional:
  - Browser for opening the repo creation link
  - `deno.json` with `githubPath` set
