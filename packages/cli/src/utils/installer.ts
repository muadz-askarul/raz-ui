import fs from 'fs-extra';
import path from 'path';
import { execa } from 'execa';
import type { RazConfig } from './config.js';
import { fetchComponent } from './registry.js';

interface ComponentFile {
    path: string;
    content: string;
    type: string;
}

export interface Component {
    name: string;
    type: string;
    dependencies?: string[];
    registryDependencies?: string[];
    files: ComponentFile[];
}

export async function installComponent(component: Component, config: RazConfig) {
    // Install npm dependencies
    if (component.dependencies && component.dependencies.length > 0) {
        await execa('npm', ['install', ...component.dependencies, '--save']);
    }

    // Install registry dependencies (other components)
    if (component.registryDependencies && component.registryDependencies.length > 0) {
        for (const dep of component.registryDependencies) {
            const depComponent = await fetchComponent(dep);
            await installComponent(depComponent, config);
        }
    }

    // Write component files
    for (const file of component.files) {
        const targetPath = path.join(process.cwd(), config.componentsPath, file.path);

        await fs.ensureDir(path.dirname(targetPath));

        // Transform imports
        let content = file.content;

        // Replace @/lib/utils with configured path
        const utilsImportPath = config.utilsPath.replace(/^src\//, '');
        content = content.replace(/@\/lib\/utils/g, `@/${utilsImportPath}/utils`);

        // Replace @/components with configured path
        const componentsImportPath = config.componentsPath.replace(/^src\//, '');
        content = content.replace(/@\/components/g, `@/${componentsImportPath}`);

        await fs.writeFile(targetPath, content);
    }
}
