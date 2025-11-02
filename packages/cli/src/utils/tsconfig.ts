import fs from 'fs-extra';
import path from 'path';

export async function configureTsConfig(componentsPath: string, utilsPath: string) {
    const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
    const tsconfigAppPath = path.join(process.cwd(), 'tsconfig.app.json');

    // Normalize paths (remove trailing slashes, ensure they start with src/)
    const normalizePathForAlias = (p: string) => {
        // Remove trailing slash
        p = p.replace(/\/$/, '');
        // Ensure it starts with src/
        if (!p.startsWith('src/')) {
            p = 'src/' + p;
        }
        return p;
    };

    const normalizedComponents = normalizePathForAlias(componentsPath);
    const normalizedUtils = normalizePathForAlias(utilsPath);

    // Create path aliases
    const paths: Record<string, string[]> = {
        '@/*': ['src/*'],
        '@/components/*': [normalizedComponents + '/*'],
        '@/lib/*': [normalizedUtils + '/*'],
    };

    // Update tsconfig.json
    if (await fs.pathExists(tsconfigPath)) {
        const tsconfig = await fs.readJSON(tsconfigPath);

        if (!tsconfig.compilerOptions) {
            tsconfig.compilerOptions = {};
        }

        tsconfig.compilerOptions.baseUrl = './';
        tsconfig.compilerOptions.paths = paths;

        await fs.writeJSON(tsconfigPath, tsconfig, { spaces: 2 });
    }

    // Update tsconfig.app.json
    if (await fs.pathExists(tsconfigAppPath)) {
        const tsconfigApp = await fs.readJSON(tsconfigAppPath);

        if (!tsconfigApp.compilerOptions) {
            tsconfigApp.compilerOptions = {};
        }

        tsconfigApp.compilerOptions.paths = paths;

        await fs.writeJSON(tsconfigAppPath, tsconfigApp, { spaces: 2 });
    }
}
