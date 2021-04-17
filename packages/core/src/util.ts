// Trio of functions taken from Peter Michaux's article:
// http://peter.michaux.ca/articles/feature-detection-state-of-the-art-browser-scripting
export function isHostMethod(o, p) {
  var t = typeof o[p];
  return (
    t == 'function' || !!(t == 'object' && o[p]) || (t as any) == 'unknown'
  );
}

export function isHostObject(o, p) {
  return !!(typeof o[p] == 'object' && o[p]);
}

export function isHostProperty(o, p) {
  return typeof o[p] != 'undefined';
}

// Creates a convenience function to save verbose repeated calls to tests functions
function createMultiplePropertyTest(testFunc) {
  return function (o, props) {
    var i = props.length;
    while (i--) {
      if (!testFunc(o, props[i])) {
        return false;
      }
    }
    return true;
  };
}

// Next trio of functions are a convenience to save verbose repeated calls to previous two functions
export const areHostMethods = createMultiplePropertyTest(isHostMethod);
export const areHostObjects = createMultiplePropertyTest(isHostObject);
export const areHostProperties = createMultiplePropertyTest(isHostProperty);

export function getBody(doc) {
  return isHostObject(doc, 'body')
    ? doc.body
    : doc.getElementsByTagName('body')[0];
}

// https://mariusschulz.com/blog/typescript-2-2-mixin-classes
export type Constructor<T = {}> = new (...args: any[]) => T;
