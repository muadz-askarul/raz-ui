import ora from 'ora';
import chalk from 'chalk';
import prompts from 'prompts';
import { getConfig } from '../utils/config.js';
import { fetchComponent, fetchRegistry } from '../utils/registry.js';
import { installComponent } from '../utils/installer.js';

export async function addCommand(components: string[]) {
    const spinner = ora('Loading...').start();

    // Check for config
    const config = await getConfig();
    if (!config) {
        spinner.fail(chalk.red('No raz-ui.json found!'));
        console.log(chalk.yellow('\nPlease run: npx raz-ui init\n'));
        process.exit(1);
    }

    spinner.succeed();

    // If no components specified, show selection
    if (components.length === 0) {
        spinner.start('Fetching available components...');

        try {
            const registry = await fetchRegistry();
            spinner.succeed();

            const { selected } = await prompts({
                type: 'multiselect',
                name: 'selected',
                message: 'Select components to add:',
                choices: registry.components.map((c: any) => ({
                    title: c.name,
                    value: c.name,
                    description: c.type,
                })),
                min: 1,
            });

            if (!selected || selected.length === 0) {
                console.log(chalk.yellow('No components selected.'));
                process.exit(0);
            }

            components = selected;
        } catch (error) {
            spinner.fail(chalk.red('Failed to fetch registry'));
            console.error(error);
            process.exit(1);
        }
    }

    // Install each component
    for (const componentName of components) {
        spinner.start(`Installing ${componentName}...`);

        try {
            const component = await fetchComponent(componentName);
            await installComponent(component, config);
            spinner.succeed(chalk.green(`Installed ${componentName}!`));
        } catch (error) {
            spinner.fail(chalk.red(`Failed to install ${componentName}`));
            if (error instanceof Error) {
                console.error(chalk.dim(error.message));
            }
        }
    }

    console.log(chalk.bold.green('\n✨ Done!\n'));
}
