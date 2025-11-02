import prompts from 'prompts';
import ora from 'ora';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { execa } from 'execa';
import { detectAngularProject, getAngularVersion } from '../utils/angular.js';
import { createConfig } from '../utils/config.js';
import { createPostCSSConfig, updateTailwindConfig } from '../utils/tailwind.js';
import { updateGlobalStyles } from '../utils/styles.js';
import { configureTsConfig } from '../utils/tsconfig.js';

export async function initCommand() {
    console.log(chalk.bold.cyan('\n🚀 Welcome to raz-ui!\n'));

    // Step 1: Detect Angular project
    const spinner = ora('Detecting Angular project...').start();

    const isAngular = await detectAngularProject();
    if (!isAngular) {
        spinner.fail(chalk.red('No Angular project detected!'));
        console.log(chalk.yellow('\nPlease run this command in an Angular project directory.'));
        process.exit(1);
    }

    const angularVersion = await getAngularVersion();
    if (angularVersion < 19) {
        spinner.fail(chalk.red(`Angular version ${angularVersion} detected!`));
        console.log(chalk.yellow('\nraz-ui requires Angular 19 or higher.'));
        console.log(chalk.dim('Update Angular: ng update @angular/core @angular/cli'));
        process.exit(1);
    }

    spinner.succeed(chalk.green(`Angular ${angularVersion} detected!`));

    // Step 2: Check if already initialized
    const configExists = await fs.pathExists(path.join(process.cwd(), 'raz-ui.json'));
    if (configExists) {
        const { overwrite } = await prompts({
            type: 'confirm',
            name: 'overwrite',
            message: 'raz-ui is already initialized. Do you want to overwrite the configuration?',
            initial: false,
        });

        if (!overwrite) {
            console.log(chalk.yellow('\nSetup cancelled.'));
            process.exit(0);
        }
    }

    // Step 3: Prompt for configuration
    const answers = await prompts([
        {
            type: 'text',
            name: 'componentsPath',
            message: 'Where would you like to store your components?',
            initial: 'src/app/components',
        },
        {
            type: 'text',
            name: 'utilsPath',
            message: 'Where would you like to store utility functions?',
            initial: 'src/app/lib',
        },
        {
            type: 'select',
            name: 'baseColor',
            message: 'Choose a base color:',
            choices: [
                { title: 'Slate', value: 'slate' },
                { title: 'Gray', value: 'gray' },
                { title: 'Zinc', value: 'zinc' },
                { title: 'Neutral', value: 'neutral' },
                { title: 'Stone', value: 'stone' },
            ],
            initial: 0,
        },
        {
            type: 'confirm',
            name: 'useCssVariables',
            message: 'Would you like to use CSS variables for theming?',
            initial: true,
        },
    ]);

    if (!answers.componentsPath) {
        console.log(chalk.yellow('\nSetup cancelled.'));
        process.exit(0);
    }

    // Step 4: Create config file
    spinner.start('Creating configuration...');
    await createConfig({
        componentsPath: answers.componentsPath,
        utilsPath: answers.utilsPath,
        baseColor: answers.baseColor,
        useCssVariables: answers.useCssVariables,
        tailwindVersion: 3, // Always use v3
    });
    spinner.succeed('Configuration created!');

    // Step 5: Install dependencies
    spinner.start('Installing dependencies...');
    try {
        const deps = ['class-variance-authority', 'clsx', 'tailwind-merge'];
        const devDeps = ['tailwindcss@^3.4.0', 'postcss', 'autoprefixer'];

        await execa('npm', ['install', ...deps, '--save']);
        await execa('npm', ['install', ...devDeps, '--save-dev']);
        spinner.succeed('Dependencies installed!');
    } catch (error) {
        spinner.warn('Failed to install dependencies automatically');
        console.log(chalk.yellow('\nPlease install manually:'));
        console.log(chalk.cyan('  npm install class-variance-authority clsx tailwind-merge'));
        // if (answers.tailwindVersion === 4) {
        //     console.log(chalk.cyan('  npm install -D @tailwindcss/postcss@next'));
        // } else {
        //     console.log(chalk.cyan('  npm install -D tailwindcss@^3.4.0 postcss autoprefixer'));
        // }
        console.log(chalk.cyan('  npm install -D tailwindcss@^3.4.0 postcss autoprefixer'));
    }

    // Step 6: Create utility files
    spinner.start('Creating utility files...');
    const utilsDir = path.join(process.cwd(), answers.utilsPath);
    await fs.ensureDir(utilsDir);

    const utilsContent = `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

    await fs.writeFile(path.join(utilsDir, 'utils.ts'), utilsContent);
    spinner.succeed('Utility files created!');

    // After Step 6 (Create utility files), add this new step:

    // Step 6.5: Configure TypeScript path aliases
    spinner.start('Configuring TypeScript path aliases...');
    try {
        console.log(chalk.dim(`\nConfiguring paths:`));
        console.log(chalk.dim(`  Components: ${answers.componentsPath}`));
        console.log(chalk.dim(`  Utils: ${answers.utilsPath}`));

        await configureTsConfig(answers.componentsPath, answers.utilsPath);
        spinner.succeed('TypeScript path aliases configured!');
    } catch (error) {
        spinner.fail('Could not configure TypeScript paths automatically');
        console.error(error);
        console.log(chalk.yellow('\nPlease add the following to your tsconfig.json manually:'));
        console.log(
            chalk.cyan(`
            {
            "compilerOptions": {
                "baseUrl": "./",
                "paths": {
                "@/*": ["src/*"],
                "@/components/*": ["${answers.componentsPath}/*"],
                "@/lib/*": ["${answers.utilsPath}/*"]
                }
            }
            }`)
        );
    }

    // Step 7: Create PostCSS config
    spinner.start('Creating PostCSS configuration...');
    // await createPostCSSConfig(answers.tailwindVersion);
    await createPostCSSConfig(3);
    spinner.succeed('PostCSS configuration created!');

    // Step 8: Update Tailwind config (only for v3)
    // if (answers.tailwindVersion === 3) {
    //     spinner.start('Updating Tailwind configuration...');
    //     try {
    //         await updateTailwindConfig(answers.baseColor, answers.useCssVariables, answers.tailwindVersion);
    //         spinner.succeed('Tailwind configuration updated!');
    //     } catch (error) {
    //         spinner.warn('Could not update Tailwind config automatically');
    //     }
    // }

    spinner.start('Updating Tailwind configuration...');
    try {
        // await updateTailwindConfig(answers.baseColor, answers.useCssVariables, answers.tailwindVersion);
        await updateTailwindConfig(answers.baseColor, answers.useCssVariables);
        spinner.succeed('Tailwind configuration updated!');
    } catch (error) {
        spinner.warn('Could not update Tailwind config automatically');
    }

    // Step 9: Update global styles
    spinner.start('Updating global styles...');
    try {
        // await updateGlobalStyles(answers.baseColor, answers.useCssVariables, answers.tailwindVersion);
        await updateGlobalStyles(answers.baseColor, answers.useCssVariables);
        spinner.succeed('Global styles updated!');
    } catch (error) {
        spinner.warn('Could not update styles automatically');
    }

    // Success!
    console.log(chalk.bold.green('\n✨ Setup complete!\n'));
    console.log('You can now add components:');
    console.log(chalk.cyan('  npx raz-ui add button'));
    console.log(chalk.cyan('  npx raz-ui add card\n'));
    console.log(chalk.dim('Learn more: https://github.com/muadz-askarul/raz-ui\n'));
}
