import { Command } from 'commander'
import pc from 'picocolors'
import prompts from 'prompts'

import { logger } from '../../utils/logger'

export const preview = (program: Command) =>
    program
        .createCommand('preview')
        .description('Preview project')
        .action(async () => {
            const response = await prompts({
                type: 'text',
                name: 'name',
                message: 'What is your name?'
            })
            logger.log(pc.green(`Hello, ${response.name}!`))
        })
