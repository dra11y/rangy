import * as rangy from '@dra11y/rangy-core';
import * as selectionsaverestore from '@dra11y/rangy-selectionsaverestore';
import '@dra11y/rangy-test-util';

QUnit.module('Selection save/restore module tests');
QUnit.test(
  'Issue 140 (saveSelection reverses backward selection)',
  function (t) {
    var testEl = document.getElementById('qunit-fixture');
    testEl.innerHTML = 'test';
    var range = rangy.createRange();
    range.setStartAndEnd(testEl.firstChild, 1, 3);
    var sel = rangy.getSelection();
    sel.addRange(range, 'backward');

    t.ok(sel.isBackward());
    t.equal(sel.rangeCount, 1);
    t.ok(sel.getRangeAt(0).equals(range));

    selectionsaverestore.saveSelection();

    t.ok(sel.isBackward());
    t.equal(sel.rangeCount, 1);
  }
);
