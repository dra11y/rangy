import * as log4javascript from 'log4javascript'
log4javascript.getRootLogger().setLevel(log4javascript.Level.OFF)

// const loggers = [
//     "rangy.classapplier",
//     "rangy.dom",
//     "rangy.WrappedRange",
//     "rangy.WrappedSelection",
//     "DomRangeBase",
//     "rangy.DomRange",
//     "rangy.textrange",
//     "rangy.aryehcommands",
// ]

// loggers.forEach(logger => log4javascript.getLogger(logger).setLevel(log4javascript.Level.OFF))

export { WrappedRange } from "./textrange"
export { createClassApplier } from "./classapplier"
export { createHighlighter } from "./highlighter"
export { getSelection, createRange } from "./core"
