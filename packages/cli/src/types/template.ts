import { frameworks, templates } from '../constants/templates'

/**
 * all available framework
 */
export type Framework = (typeof frameworks)[number]

/**
 * all available template
 */
export type Template = (typeof templates)[number]
