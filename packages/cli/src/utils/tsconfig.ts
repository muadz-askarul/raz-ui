import fs from 'fs-extra';
import path from 'path';
import { parse, modify, applyEdits } from 'jsonc-parser';

export async function configureTsConfig(componentsPath: string, utilsPath: string) {
    const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
    const tsconfigAppPath = path.join(process.cwd(), 'tsconfig.app.json');

    // Normalize paths - ensure they start with "src/"
    const normalizeForAlias = (p: string) => {
        // Remove leading/trailing slashes
        p = p.trim().replace(/^\/+|\/+$/g, '');
        // Ensure starts with src/
        if (!p.startsWith('src/')) {
            p = `src/${p}`;
        }
        return p;
    };

    const normalizedComponents = normalizeForAlias(componentsPath);
    const normalizedUtils = normalizeForAlias(utilsPath);

    // Build path aliases
    const paths: Record<string, string[]> = {
        '@/*': ['src/*'],
        '@/components/*': [`${normalizedComponents}/*`],
        '@/lib/*': [`${normalizedUtils}/*`],
    };

    // Update tsconfig.json (with comments support)
    if (await fs.pathExists(tsconfigPath)) {
        await updateTsConfigFile(tsconfigPath, paths);
    }

    // Update tsconfig.app.json (with comments support)
    if (await fs.pathExists(tsconfigAppPath)) {
        await updateTsConfigFile(tsconfigAppPath, paths);
    }
}

async function updateTsConfigFile(filePath: string, paths: Record<string, string[]>) {
    // Read file as text (preserves comments)
    const content = await fs.readFile(filePath, 'utf-8');

    // Parse JSONC (JSON with comments)
    const config = parse(content);

    // Ensure compilerOptions exists
    if (!config.compilerOptions) {
        config.compilerOptions = {};
    }

    // Set baseUrl if not in root tsconfig
    let edits = modify(content, ['compilerOptions', 'baseUrl'], './', {});
    let updatedContent = applyEdits(content, edits);

    // Set paths
    edits = modify(updatedContent, ['compilerOptions', 'paths'], paths, {});
    updatedContent = applyEdits(updatedContent, edits);

    // Write back (preserves formatting and comments)
    await fs.writeFile(filePath, updatedContent, 'utf-8');
}
