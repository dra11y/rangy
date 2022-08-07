import * as rangy from '@dra11y/rangy-core';
import * as classapplier from '@dra11y/rangy-classapplier';
import * as highlighter from '@dra11y/rangy-highlighter';
import { createRangeInHtml } from '@dra11y/rangy-test-util';

QUnit.module('Highlighter module tests');

QUnit.test('highlightSelection test', function (t) {
  var applier = classapplier.createClassApplier('c1');
  var highlighted = highlighter.createHighlighter();
  highlighted.addClassApplier(applier);

  var testEl = document.getElementById('test');
  var range = createRangeInHtml(testEl, 'one [two] three four');
  range.select();

  var highlights = highlighted.highlightSelection('c1');

  t.equal(highlights.length, 1);

  //t.assertEquals(highlights.length, 1);
});

QUnit.test('Options test (issue 249)', function (t) {
  var applier = classapplier.createClassApplier('c1');
  var highlighted = highlighter.createHighlighter();
  highlighted.addClassApplier(applier);

  highlighted.highlightSelection('c1', { selection: rangy.getSelection() });
});