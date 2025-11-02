# raz-ui Component Registry

This directory contains the component registry for raz-ui.

## Structure

-   `index.json` - Master list of all components
-   `components/` - Individual component definitions

## Adding a New Component

1. Create a new JSON file in `components/` directory
2. Add the component entry to `index.json`
3. Commit and push to GitHub

## Component JSON Format

```json
{
    "name": "component-name",
    "type": "components:ui",
    "dependencies": ["npm-package"],
    "registryDependencies": ["other-component"],
    "files": [
        {
            "path": "ui/component-name.component.ts",
            "type": "components:ui",
            "content": "// Component code here"
        }
    ]
}
```

## Testing Components

Components are fetched from:

```
https://raw.githubusercontent.com/muadz-askarul/raz-ui/main/registry/
```
