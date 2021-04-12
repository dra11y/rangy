/**
 * Rangy, a cross-browser JavaScript range and selection library
 * https://github.com/timdown/rangy
 *
 * Copyright %%build:year%%, Tim Down
 * Licensed under the MIT license.
 * Version: %%build:version%%
 * Build date: %%build:date%%
 */
import "core-js/features/array/includes";
import "core-js/features/object/assign";

export * from "./api";

import * as util from "./util";
export { util };

export * from "./module";
export * from "./DOMException";

import * as dom from "./dom";
export { dom };

export * from "./internal";
import { shimCreateRange, shimGetSelection } from "./internal";

// manually exporting classes to allow augmentation
// see: https://github.com/microsoft/TypeScript/issues/18877
import { WrappedRange, WrappedSelection } from "./internal";
export { WrappedRange, WrappedSelection };

export function shim(win?: Window) {
  win = win || window;
  shimCreateRange(win);
  shimGetSelection(win);
}
