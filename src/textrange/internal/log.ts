const noop = (...args) => { }

// #if IS_DEVELOPMENT
import * as log4javascript from 'log4javascript'
// #endif

const log = log4javascript.getLogger('rangy.textrange')

export default log
