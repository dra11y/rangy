# Rangy2

A cross-browser JavaScript range and selection library.

## Compare to [rangy](https://github.com/timdown/rangy) 1.x

- migrated to typescript
  - so, the definition types is always updated
- use typescript's module (import / export) instead of the complex `rangy.createModule` logic
- remove ~~TextRange &~~ [inactive](https://github.com/timdown/rangy/tree/master/src/modules/inactive) modules
  - if you use those modules, please migrate to rangy2 & create a pull request.
- use [rollup](https://rollupjs.org) instead of the
  [old complex manually with text-replacing building logic](https://github.com/timdown/rangy/blob/master/builder/build.js)
- don't support too-outdated browser: IE < 9
  - removed many outdated feature testing logic (for too-outdated browser)
- migrated testing code to [QUnit](https://qunitjs.com/)
  - dont use [jest](https://jestjs.io/) because we need test in android/ ios
- remove `rangy.init` (& `rangy.addInitListener`)
  - rangy is "initialized" even before DOM ready!
  - So, many bugs like [326](https://github.com/timdown/rangy/issues/326),
    [321](https://github.com/timdown/rangy/issues/321) is auto-fixed!

## Compare to [rangy](https://github.com/ohze/rangy) 2.x

- added TextRange module back
- unified some TypeScript to make better use of references

## Guide to migrate from rangy 1.x to `@dra11y/rangy` and/or `rangy2`

- removed:
  - `util.extend`. Pls use [Object.assign](http://kangax.github.io/compat-table/es6/#test-Object_static_methods_Object.assign)
  - `util.toArray`. Pls use [Array.slice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)
  - `util.`[forEach](http://kangax.github.io/compat-table/es5/#test-Array.prototype.forEach)
  - `dom.arrayContains`. Pls use [Array.includes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)
  - `initialized, init, addInitListener`. rangy is now always initialized right when import
  - `addShimListener`
  - `createModule, createCoreModule`
  - `warn, fail, supported`
  - `RangePrototype, rangePrototype, selectionPrototype`
  - `WrappedTextRange`
- note: to support IE, we bundled the following [core-js](https://www.npmjs.com/package/core-js) modules
  into `dist/*/bundles/index.umd.js` (not bundle into `index.esm.js` & other module types)

```javascript
import 'core-js/features/array/includes';
import 'core-js/features/object/assign';
```

## Install

```bash
yarn add @dra11y/rangy
```

## Documentation

Documentation is in [the GitHub wiki](https://github.com/timdown/rangy/wiki).

## Dev guide

```bash
yarn install
yarn bootstrap # compile the typescript `scripts/` dir
yarn build     # typescript -> js
yarn package   # js -> umd/es/etc
```

- test by opening `packages/*/test/*.html` in a desktop or mobile browser
