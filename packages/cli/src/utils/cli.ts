import { program} from 'commander';

import './commands'

export const defineConfig=()=>{


}

export const runCLI=()=>{
    program.parse(process.argv)
}
