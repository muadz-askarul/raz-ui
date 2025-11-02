import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { addCommand } from './commands/add.js';

const program = new Command();

program.name('raz-ui').description('Add raz-ui components to your Angular project').version('0.0.1');

program.command('init').description('Initialize raz-ui in your Angular project').action(initCommand);

program
    .command('add')
    .description('Add a component to your project')
    .argument('[components...]', 'components to add')
    .action(addCommand);

program.parse();
