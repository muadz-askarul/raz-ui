# raz-ui

## Project Overview

`raz-ui` is a collection of re-usable Angular components built with Tailwind CSS. It provides a command-line interface (CLI) to initialize and add components to an Angular project. The project is a monorepo managed with pnpm workspaces.

The main parts of the project are:

*   **`packages/cli`**: The CLI tool for initializing and adding components.
*   **`registry`**: Contains the component definitions, including their source code and dependencies.
*   **`docs`**: The documentation site.
*   **`examples`**: Example projects using `raz-ui`.

## Building and Running

The project uses `pnpm` for package management.

*   **Install dependencies:**
    ```bash
    pnpm install
    ```

*   **Build the CLI:**
    ```bash
    pnpm build:cli
    ```

*   **Run the CLI in development:**
    ```bash
    pnpm dev:cli
    ```

*   **Run the documentation site locally:**
    ```bash
    pnpm dev:docs
    ```

## Development Conventions

*   **Monorepo:** The project is a monorepo using pnpm workspaces.
*   **TypeScript:** The entire codebase is written in TypeScript.
*   **CLI:** The CLI is built with `commander` and `prompts`.
*   **Components:** Components are defined in JSON files in the `registry/components` directory. Each JSON file contains the component's name, type, dependencies, and the actual file content.
*   **Styling:** Components are styled using Tailwind CSS. The CLI provides options for configuring Tailwind CSS and PostCSS.
