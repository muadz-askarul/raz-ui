import fs from 'fs-extra';
import path from 'path';

export async function detectAngularProject(): Promise<boolean> {
    const angularJsonPath = path.join(process.cwd(), 'angular.json');
    return fs.pathExists(angularJsonPath);
}

export async function getAngularVersion(): Promise<number> {
    try {
        const packageJsonPath = path.join(process.cwd(), 'package.json');
        const packageJson = await fs.readJSON(packageJsonPath);

        const angularCore =
            packageJson.dependencies?.['@angular/core'] || packageJson.devDependencies?.['@angular/core'];

        if (!angularCore) return 0;

        // Extract major version from strings like "^19.0.0" or "~19.0.0"
        const versionMatch = angularCore.match(/[\^~]?(\d+)/);
        return versionMatch ? parseInt(versionMatch[1], 10) : 0;
    } catch (error) {
        return 0;
    }
}

export async function getProjectInfo() {
    try {
        const angularJsonPath = path.join(process.cwd(), 'angular.json');
        const angularJson = await fs.readJSON(angularJsonPath);

        // Get default project
        const defaultProject = angularJson.defaultProject || Object.keys(angularJson.projects)[0];
        const project = angularJson.projects[defaultProject];

        return {
            name: defaultProject,
            root: project.root || '',
            sourceRoot: project.sourceRoot || 'src',
        };
    } catch (error) {
        return null;
    }
}
