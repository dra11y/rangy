import * as rangy from '@notjosh/rangy-serializer';
import '@notjosh/rangy-test-util';

QUnit.module('Class Applier module tests');

QUnit.test('canDeserializeRange test', function (t) {
  t.notOk(rangy.canDeserializeRange('0/9999:1,0/9999:20{a1b2c3d4}'));
});
