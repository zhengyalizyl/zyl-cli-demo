import { Command } from 'commander'
import pc from 'picocolors'
import prompts from 'prompts'

import { templateChoices } from '../../constants/templates'
import { Framework, Template } from '../../types/template'
import { loadTemplate } from '../../utils/loadTemplates'
import { logger } from '../../utils/logger'
import { validateGivenFramework } from '../../utils/validateGivenFramework'
import { validateGivenTemplate } from '../../utils/validateGivenTemplate'

type CreateCommandOptions = {
    framework: Framework
    template: Template
    remote?: boolean
}

/**
 * 创建一个新的项目命令
 * @param program - Command 实例，用于添加新的命令
 * @returns 返回配置好的 create 命令
 */
export const create = (program: Command) =>
    program
        // 创建名为 'create' 的子命令
        .createCommand('create')
        // 添加项目名称作为必需参数
        .arguments('<project-name>')
        // 添加框架选项，允许用户指定使用的框架
        .option('-f, --framework <framework>', 'framework')
        // 添加模板选项，允许用户指定使用的模板
        .option('-t, --template <template>', 'template')
        // 添加远程模板选项，用于加载远程模板
        .option('-r, --remote', 'remote template')
        // 设置命令描述
        .description('create project')
        // 添加帮助选项
        .helpOption('-h, --help', 'display help for command')
        // 设置命令执行时的回调函数
        .action(async (projectName: string, options: CreateCommandOptions) => {
            /**
             * validate project name
             */
            let { framework, template } = options
            const { remote } = options

            if (remote) {
                await loadTemplate({ projectName, remote, template })
                return
            }

            // If the framework is not specified, prompt the user to select a framework
            if (!framework || !validateGivenFramework(framework)) {
                const response = await prompts({
                    type: 'select',
                    choices: [
                        { title: 'Vue', value: 'vue' },
                        { title: 'React', value: 'react' },
                        { title: 'Vanilla', value: 'vanilla' }
                    ],
                    name: 'framework',
                    message: 'What is your framework?'
                })

                framework = response.framework
            }

            // If the template is not specified, prompt the user to select a template
            if (!template || !validateGivenTemplate(framework, template)) {
                const choices = templateChoices[framework]
                const response = await prompts({
                    type: 'select',
                    choices,
                    name: 'template',
                    message: 'What is your template?'
                })

                template = response.template
            }

            if (!framework || !template) {
                logger.error(pc.red('Invalid framework or template'))
                process.exit(1)
            }

            logger.info(pc.green(`Create project ${projectName} with ${framework} and ${template}`))

            await loadTemplate({ projectName, template, remote })
        })
