/**
 * Selection save and restore module for Rangy.
 * Saves and restores user selections using marker invisible elements in the DOM.
 *
 * Part of Rangy, a cross-browser JavaScript range and selection library
 * https://github.com/timdown/rangy
 *
 * Depends on Rangy core.
 *
 * Copyright %%build:year%%, Tim Down
 * Licensed under the MIT license.
 * Version: %%build:version%%
 * Build date: %%build:date%%
 */

import * as api from '../core'
import { Module, dom, features } from '../core'

const removeNode = dom.removeNode

const module = new Module('SaveRestore', ['WrappedSelection'])

var isDirectionBackward = api.Selection.isDirectionBackward
var markerTextChar = '\ufeff'

function gEBI(id, doc) {
  return (doc || document).getElementById(id)
}

function insertRangeBoundaryMarker(range, atStart) {
  var markerId =
    'selectionBoundary_' + +new Date() + '_' + ('' + Math.random()).slice(2)
  var markerEl
  var doc = dom.getDocument(range.startContainer)

  // Clone the Range and collapse to the appropriate boundary point
  var boundaryRange = range.cloneRange()
  boundaryRange.collapse(atStart)

  // Create the marker element containing a single invisible character using DOM methods and insert it
  markerEl = doc.createElement('span')
  markerEl.id = markerId
  markerEl.style.lineHeight = '0'
  markerEl.style.display = 'none'
  markerEl.className = 'rangySelectionBoundary'
  markerEl.appendChild(doc.createTextNode(markerTextChar))

  boundaryRange.insertNode(markerEl)
  return markerEl
}

function setRangeBoundary(doc, range, markerId, atStart) {
  var markerEl = gEBI(markerId, doc)
  if (markerEl) {
    range[atStart ? 'setStartBefore' : 'setEndBefore'](markerEl)
    removeNode(markerEl)
  } else {
    module.warn('Marker element has been removed. Cannot restore selection.')
  }
}

function compareRanges(r1, r2) {
  return r2.compareBoundaryPoints(r1.START_TO_START, r1)
}

export function saveRange(range, direction) {
  var startEl,
    endEl,
    doc = api.DomRange.getRangeDocument(range),
    text = range.toString()
  var backward = isDirectionBackward(direction)

  if (range.collapsed) {
    endEl = insertRangeBoundaryMarker(range, false)
    return {
      document: doc,
      markerId: endEl.id,
      collapsed: true,
    }
  } else {
    endEl = insertRangeBoundaryMarker(range, false)
    startEl = insertRangeBoundaryMarker(range, true)

    return {
      document: doc,
      startMarkerId: startEl.id,
      endMarkerId: endEl.id,
      collapsed: false,
      backward: backward,
      toString: function () {
        return (
          "original text: '" + text + "', new text: '" + range.toString() + "'"
        )
      },
    }
  }
}

export function restoreRange(rangeInfo, normalize) {
  var doc = rangeInfo.document
  if (typeof normalize == 'undefined') {
    normalize = true
  }
  var range = api.createRange(doc)
  if (rangeInfo.collapsed) {
    var markerEl = gEBI(rangeInfo.markerId, doc)
    if (markerEl) {
      markerEl.style.display = 'inline'
      var previousNode = markerEl.previousSibling

      // Workaround for issue 17
      if (previousNode && previousNode.nodeType == 3) {
        removeNode(markerEl)
        range.collapseToPoint(previousNode, previousNode.length)
      } else {
        range.collapseBefore(markerEl)
        removeNode(markerEl)
      }
    } else {
      module.warn('Marker element has been removed. Cannot restore selection.')
    }
  } else {
    setRangeBoundary(doc, range, rangeInfo.startMarkerId, true)
    setRangeBoundary(doc, range, rangeInfo.endMarkerId, false)
  }

  if (normalize) {
    range.normalizeBoundaries()
  }

  return range
}

export function saveRanges(ranges, direction) {
  var rangeInfos = [],
    range,
    doc
  var backward = isDirectionBackward(direction)

  // Order the ranges by position within the DOM, latest first, cloning the array to leave the original untouched
  ranges = ranges.slice(0)
  ranges.sort(compareRanges)

  for (var i = 0, len = ranges.length; i < len; ++i) {
    rangeInfos[i] = saveRange(ranges[i], backward)
  }

  // Now that all the markers are in place and DOM manipulation over, adjust each range's boundaries to lie
  // between its markers
  for (i = len - 1; i >= 0; --i) {
    range = ranges[i]
    doc = api.DomRange.getRangeDocument(range)
    if (range.collapsed) {
      range.collapseAfter(gEBI(rangeInfos[i].markerId, doc))
    } else {
      range.setEndBefore(gEBI(rangeInfos[i].endMarkerId, doc))
      range.setStartAfter(gEBI(rangeInfos[i].startMarkerId, doc))
    }
  }

  return rangeInfos
}

export function saveSelection(win?) {
  var sel = api.getSelection(win)
  var ranges = sel.getAllRanges()
  var backward = ranges.length == 1 && sel.isBackward()

  var rangeInfos = saveRanges(ranges, backward)

  // Ensure current selection is unaffected
  if (backward) {
    sel.setSingleRange(ranges[0], backward)
  } else {
    sel.setRanges(ranges)
  }

  return {
    win: win,
    rangeInfos: rangeInfos,
    restored: false,
  }
}

export function restoreRanges(rangeInfos) {
  var ranges = []

  // Ranges are in reverse order of appearance in the DOM. We want to restore earliest first to avoid
  // normalization affecting previously restored ranges.
  var rangeCount = rangeInfos.length

  for (var i = rangeCount - 1; i >= 0; i--) {
    ranges[i] = restoreRange(rangeInfos[i], true)
  }

  return ranges
}

export function restoreSelection(savedSelection, preserveDirection) {
  if (!savedSelection.restored) {
    var rangeInfos = savedSelection.rangeInfos
    var sel = api.getSelection(savedSelection.win)
    var ranges = restoreRanges(rangeInfos),
      rangeCount = rangeInfos.length

    if (
      rangeCount == 1 &&
      preserveDirection &&
      features.selectionHasExtend &&
      rangeInfos[0].backward
    ) {
      sel.removeAllRanges()
      sel.addRange(ranges[0], true)
    } else {
      sel.setRanges(ranges)
    }

    savedSelection.restored = true
  }
}

export function removeMarkerElement(doc, markerId) {
  var markerEl = gEBI(markerId, doc)
  if (markerEl) {
    removeNode(markerEl)
  }
}

export function removeMarkers(savedSelection) {
  var rangeInfos = savedSelection.rangeInfos
  for (var i = 0, len = rangeInfos.length, rangeInfo; i < len; ++i) {
    rangeInfo = rangeInfos[i]
    if (rangeInfo.collapsed) {
      removeMarkerElement(savedSelection.doc, rangeInfo.markerId)
    } else {
      removeMarkerElement(savedSelection.doc, rangeInfo.startMarkerId)
      removeMarkerElement(savedSelection.doc, rangeInfo.endMarkerId)
    }
  }
}
