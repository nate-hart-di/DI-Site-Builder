# Product Requirement Prompt – DI Site Builder (Project)

## Goal

Create an autonomous CLI-driven feedback loop (the **DI Site Builder**) that converts Figma designs into production-ready Dealer Inspire WordPress theme code, achieving ≥ 99.5 % visual accuracy while strictly enforcing all DI coding and design standards.

## Why

- **Increase Development Velocity** – Reduce component build time by 70 %.
- **Improve Code Quality & Accuracy** – Deliver pixel-perfect output that conforms to DI standards.
- **Enhance Developer Experience** – Eliminate manual "pixel-pushing," freeing developers for high-value tasks.
- **Consistency & Compliance** – Guarantee uniform code quality across projects and complete adherence to DI requirements.

## What

The DI Site Builder will:

1. Accept a Figma node URL and target theme name via CLI.
2. Map the design to an existing DI Building Block variant.
3. Generate initial PHP partials, SCSS, and ACF JSON files.
4. Spin up (or reuse) a Docker WordPress stack, deploy generated code, and compile assets.
5. Visually compare the localhost output to the Figma reference using a two-stage diff (pixel + AI vision).
6. Auto-refine code in iterative loops until convergence or a max iteration limit is reached.
7. Provide clear, structured logs and a final convergence report.

### Key Components

- **DI Site Builder CLI** – `di-site-builder` or `disb` commands: `generate`, `config`, `doctor`.
- **Figma Integration Module** – Authenticates and fetches node JSON + reference images.
- **AI Scaffolding Engine** – Determines Building Block, scaffolds initial code.
- **Local Environment Orchestrator** – Docker orchestration, Gulp build, Playwright screenshot.
- **Visual Comparison Engine** – Pixelmatch + AI vision analysis for diff generation.
- **AI Refinement Engine** – Applies code corrections based on diff JSON.
- **Reporting Layer** – Progress logs, final accuracy score, troubleshooting hints.

## Endpoints/APIs to Implement

| Name                               | Interface                                                                                                                                                     | Purpose                                            |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| **CLI – di-site-builder generate** | `di-site-builder generate --url <figmaNodeUrl> --theme <themeName> [--max-iter 5]`<br>`disb generate --url <figmaNodeUrl> --theme <themeName> [--max-iter 5]` | Kick-off full feedback loop                        |
| **CLI – di-site-builder config**   | `di-site-builder config --set <key>=<value>`<br>`disb config --set <key>=<value>`                                                                             | Store & validate config (Figma token, paths, etc.) |
| **CLI – di-site-builder doctor**   | `di-site-builder doctor`<br>`disb doctor`                                                                                                                     | Environment health check                           |
| **Figma API – Node Fetch**         | GET `/v1/files/{fileKey}/nodes?id={nodeId}`                                                                                                                   | Retrieve design JSON                               |
| **Figma API – Image Export**       | GET `/v1/images/{fileKey}?ids={nodeId}&scale=2`                                                                                                               | Obtain PNG reference                               |
| **Local Build Hook**               | Shell `docker-compose exec theme gulp build`                                                                                                                  | Compile theme assets                               |
| **Visual Diff Service**            | Local fn `compareImages(localPng, figmaPng)` → JSON                                                                                                           | Produce diff & accuracy score                      |

_Note: All CLI commands can be invoked as either `di-site-builder` or the shorthand `disb`._

_Internal module interfaces will be defined in TypeScript (`src/types`)._

## Current Directory Structure (relevant)

```text
DI-Site-Builder/
├── initial-documentation/
│   ├── PRD.md
│   ├── PRP-Prompt.md
│   └── *.md (standards, research, etc.)
└── .cursor/rules/
```

## Proposed Directory Structure

```text
DI-Site-Builder/
├── src/
│   ├── cli/                    # DI Site Builder CLI entrypoints
│   │   └── index.ts
│   ├── modules/
│   │   ├── figma/
│   │   ├── scaffolding/
│   │   ├── local-orchestrator/
│   │   ├── visual-compare/
│   │   └── refinement/
│   └── types/
├── tests/
│   ├── e2e/
│   └── unit/
├── docker/
│   └── docker-compose.yml
├── tsconfig.json
└── package.json
```

## Files to Reference

- `initial-documentation/DI_BUILDING_BLOCKS_CATALOG.md` (read_only) – Mapping of components to Building Blocks.
- `initial-documentation/DI_STANDARDS_REFERENCE.md` (read_only) – DI coding, naming, accessibility standards.
- `initial-documentation/DI_LOCAL_DEV_ENVIRONMENT.md` (read_only) – Docker setup & local build workflow.
- Example partials and SCSS within existing dealer themes (read_only) where applicable.

## Files to Implement (concept)

### CLI

1. `src/cli/index.ts` – Argument parsing & command routing.
2. `src/cli/config.ts` – Read/write validated config JSON in user home.

### Modules

1. `src/modules/figma/figma.service.ts` – REST wrapper for Figma API.
2. `src/modules/scaffolding/generator.ts` – Building-block mapping + code generation.
3. `src/modules/local-orchestrator/env.service.ts` – Docker orchestration, Gulp build, Playwright screenshot.
4. `src/modules/visual-compare/comparer.ts` – Pixelmatch + AI vision diffing.
5. `src/modules/refinement/refiner.ts` – LLM-driven code correction & loop control.
6. `src/types/index.d.ts` – Shared interfaces (DiffReport, BuildStatus, etc.).

## Implementation Notes

### CLI & Orchestration

- Implemented in TypeScript; executed via `ts-node` for development.
- Use `execa` to spawn Docker/Gulp commands with real-time log streaming.
- Store per-user config in `$HOME/.di-site-builder/config.json` (API tokens, platform path, etc.).
- All CLI commands are available as both `di-site-builder` and `disb` for convenience.

### Figma Integration

- Respect rate limits (60 req/min default).
- Support token refresh for long-running processes.

### Visual Comparison

1. **Stage 1** – `pixelmatch` diff for quick similarity score.
2. **Stage 2** – If score < threshold, invoke multimodal LLM (e.g., Gemini Vision) to produce structured diff JSON.

### Refinement Engine

- Prompt chain includes: current code snippet, DI standards excerpt, diff JSON.
- Enforce max-iteration guard with exponential back-off.

### Code Standards

- SCSS must follow BEM and use variables from `_variables.scss`.
- PHP partials must call `get_scoped_template_part()` for template inclusion.
- Never modify `DealerInspireCommonTheme` directly.

## Validation Gates

1. **Visual Accuracy** – Similarity ≥ 99.5 %.
2. **Standards Compliance** – Pass DI SCSS lint and PHP CodeSniffer checks.
3. **Performance** – Single feedback loop ≤ 90 s on reference hardware.
4. **Accessibility** – Axe-core scan reports zero critical issues.
5. **Testing** – All Jest & Playwright suites green.
6. **Security** – No sensitive tokens committed to repo.

## Implementation Checkpoints/Testing

### 1. CLI Skeleton Ready

- Deliver `di-site-builder --help` and `disb --help` output.
- Test: `npm run test:unit cli`.

### 2. Figma Module Integrated

- Mock Figma API responses.
- Test: `npm run test:unit figma`.

### 3. Local Orchestrator MVP

- Auto-build sample theme, capture screenshot.
- Playwright smoke test passes.

### 4. Visual Comparison Baseline

- Pixelmatch diff returns numeric score; threshold configurable.

### 5. Full Loop on Sample Hero Block

- Converges within ≤ 3 iterations.
- Report generated in `/reports/`.

## Other Considerations

- **Scalability** – Future parallel component builds.
- **Extensibility** – Abstract comparison & refinement engines for other platforms.
- **Risks** – Figma API rate limits; implement request queueing.
- **Future Enhancements** – JavaScript generation, CI/CD integration, real-time Figma sync.
