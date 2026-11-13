import { copy, readJson, remove, writeJson } from 'fs-extra'
import { downloadTemplate } from 'giget'
import { join } from 'node:path'
import ora from 'ora'
import pc from 'picocolors'

import { Template } from '../types/template'

import { logger } from './logger'

export type LoadLocalTemplateOptions = {
    projectName: string
    template: Template
}

export type LoadRemoteTemplateOptions = {
    projectName: string
}

export type LoadTemplateOptions = {
    remote?: boolean
} & LoadLocalTemplateOptions &
    LoadRemoteTemplateOptions

const generatePackageJson = async (projectName: string) => {
    const projectPath = `${process.cwd()}/${projectName}`
    const originalPkg = await readJson(`${projectPath}/package.json`)
    await writeJson(
        `${projectPath}/package.json`,
        {
            ...originalPkg,
            name: projectName,
            version: '0.1.0'
        },
        {
            spaces: 4
        }
    )
}

const loadRemoteTemplate = async (options: LoadRemoteTemplateOptions) => {
    const { projectName } = options

    const spinner = ora({
        text: 'Download template loading...',
        color: 'green'
    }).start()

    try {
        // fetch remote template
        // 1. use github api
        // This solution has API request limits
        // const { source, dir } = await downloadTemplate('https://api.github.com/repos/mantinedev/vite-template/tarball')
        // 2. use github shorthand
        // const { source, dir } = await downloadTemplate('github:unjs/template')
        // 3. custom provider
        // https://github.com/unjs/giget/tree/main/templates
        // 4. use code load
        // github: https://github.com/design-sparx/antd-multipurpose-dashboard
        const { dir } = await downloadTemplate(
            'https://codeload.github.com/design-sparx/antd-multipurpose-dashboard/tar.gz/refs/heads/main',
            {
                dir: `${process.cwd()}/.temp`
            }
        )

        await copy(dir, `${process.cwd()}/${projectName}`)
        spinner.text = 'Copy template success'

        /**
         * write package.json
         */
        await generatePackageJson(projectName)

        spinner.spinner = 'moon'
        spinner.text = pc.green(`Project named ${pc.bold(projectName)} created successfully!`)

        spinner.succeed()

        /**
         * remove temp
         */
        await remove(dir)
    } catch (error) {
        if (error instanceof Error) {
            logger.error(pc.red(`Download template failed. ${error.message}`))
        }
        spinner.fail()
    }
}

const loadLocalTemplate = async (options: LoadLocalTemplateOptions) => {
    const { projectName, template } = options

    const spinner = ora({
        text: 'Copy template loading...',
        color: 'green'
    }).start()

    try {
        const templatePath = join(__dirname, `../templates/template-${template}`)
        /**
         * copy template
         */
        await copy(templatePath, `${process.cwd()}/${projectName}`)
        spinner.text = 'Copy template success'

        /**
         * write package.json
         */
        await generatePackageJson(projectName)

        spinner.spinner = 'moon'
        spinner.text = pc.green(`Project named ${pc.bold(projectName)} created successfully!`)

        spinner.succeed()

        /**
         * remove temp
         */
        await remove(`${process.cwd()}/.temp`)
    } catch (error) {
        if (error instanceof Error) {
            logger.error(pc.red(`Copy template failed. ${error.message}`))
        }
        spinner.fail()
    }
}

export const loadTemplate = async (options: LoadTemplateOptions) => {
    const { remote } = options

    if (remote) {
        await loadRemoteTemplate(options)
    } else {
        await loadLocalTemplate(options)
    }
}
