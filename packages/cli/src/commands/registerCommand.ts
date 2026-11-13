import { Command, program } from "commander"

type Fn=(p:Command)=>Command
export const registerCommand = (fn:Fn) => {
    program.addCommand(fn(program))

}
