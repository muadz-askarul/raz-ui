import fs from 'fs-extra';
import path from 'path';
export interface RazConfig {
    componentsPath: string;
    utilsPath: string;
    baseColor: string;
    useCssVariables: boolean;
    tailwindVersion: number; // Add this
}

export async function createConfig(config: RazConfig) {
    const configPath = path.join(process.cwd(), 'raz-ui.json');

    const configContent = {
        $schema: 'https://raz-ui.vercel.app/schema.json',
        style: 'default',
        tailwind: {
            version: config.tailwindVersion, // Add this
            config: config.tailwindVersion === 3 ? 'tailwind.config.js' : null,
            css: 'src/styles.css',
            baseColor: config.baseColor,
            cssVariables: config.useCssVariables,
        },
        aliases: {
            components: config.componentsPath,
            utils: config.utilsPath,
        },
    };

    await fs.writeJSON(configPath, configContent, { spaces: 2 });
}

export async function getConfig(): Promise<RazConfig | null> {
    const configPath = path.join(process.cwd(), 'raz-ui.json');

    if (!(await fs.pathExists(configPath))) {
        return null;
    }

    const config = await fs.readJSON(configPath);
    return {
        componentsPath: config.aliases.components,
        utilsPath: config.aliases.utils,
        baseColor: config.tailwind.baseColor,
        useCssVariables: config.tailwind.cssVariables,
        tailwindVersion: config.tailwind.version || 3, // Default to v3 for backward compat
    };
}
