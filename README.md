# raz-ui

A collection of re-usable Angular components built with Tailwind CSS.

> **Note**: This project is in early development.

## Features

-   🚀 Angular 19+ with Signals
-   🎨 Tailwind CSS styling
-   📦 Copy & paste components (no npm install)
-   🎯 Fully typed with TypeScript
-   🌙 Dark mode support
-   ♿ Accessible components

## Installation

```bash
npx @raz-ui/cli init
```

## Usage

```bash
npx @raz-ui/cli add button
```

## Development

This is a monorepo managed with pnpm workspaces.

```bash
# Install dependencies
pnpm install

# Build CLI
pnpm build:cli

# Run docs locally
pnpm dev:docs
```

## Project Structure

```
raz-ui/
├── packages/
│   └── cli/          # CLI tool
├── registry/         # Component registry
├── docs/             # Documentation site
└── examples/         # Example projects
```

## License

MIT © muadz-askarul
