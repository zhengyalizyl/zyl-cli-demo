import { Command } from 'commander'
import { spawn } from 'node:child_process'

import { hasPnpm } from '../../utils/env'

export const serve = (program: Command) =>
    program
        .createCommand('serve')
        .description('serve project')
        .action(async () => {
            const _hasPnpm = hasPnpm()

            const command = _hasPnpm ? 'pnpm' : 'npm'
            const params = _hasPnpm ? ['dev'] : ['run', 'dev']

            const child = spawn(command, params, {
                stdio: 'inherit'
            })

            child.on('close', code => {
                process.exit(code)
            })
        })
