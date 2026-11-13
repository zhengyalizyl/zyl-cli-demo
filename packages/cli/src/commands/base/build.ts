import { Command } from 'commander'
import { spawn } from 'node:child_process'

import { hasPnpm } from '../../utils/env'

export const build = (program: Command) =>
    program
        .createCommand('build')
        .description('build project')
        .action(async () => {
            const _hasPnpm = hasPnpm()

            const command = _hasPnpm ? 'pnpm' : 'npm'
            const params = _hasPnpm ? ['build'] : ['run', 'build']

            const child = spawn(command, params, {
                stdio: 'inherit'
            })

            child.on('close', code => {
                process.exit(code)
            })
        })
