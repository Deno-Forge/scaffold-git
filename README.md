# deno-forge/scaffold-git

[![jsr](https://img.shields.io/badge/jsr--%40deno-forge%2Fscaffold-git-blue?logo=deno)](https://jsr.io/@deno-forge/scaffold-git)
[![GitHub](https://img.shields.io/badge/GitHub-Deno-Forge/scaffold-git-blue?logo=github)](https://github.com/Deno-Forge/scaffold-git)

Initializes a local Git repository for a Deno module and assists the user in configuring it for GitHub

## Usage

```bash
deno run jsr:@deno-forge/scaffold-git
```

## Advanced Usage

```typescript
import { YourModule } from "jsr:@deno-forge/scaffold-git";

new YourModule.engage();
```