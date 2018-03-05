'use strict';

/*
 * Note: this fixes only some known bad patterns which appear in the upsteam
 * uap-core lib.
 *
 * It doesn't make a generic regexp safe!
 *
 * All new regexps should be taken through Weideman's tool and analyzed
 * individually.
 *
 */

// Order is important!
var replaces = [
  /*
   * Pure representation changes (should not affect the result)
   */
  ['(\\d+)\\.?(\\d+)?.?(\\d+)?.?(\\d+)?', '(\\d+)(?:\\.(\\d+)?(?:[^\\d](\\d+)?(?:[^\\d](\\d+)?)?)?)?'],
  ['(\\d+)\\.?(\\d+)?\\.?(\\d+)?\\.?(\\d+)?', '(\\d+)(?:\\.(\\d+)?(?:\\.(\\d+)?(?:\\.(\\d+)?)?)?)?'],
  ['(\\d+)\\.(\\d+)\\.?(\\d+)?\\.?(\\d+)?', '(\\d+)\\.(\\d+)(?:\\.(\\d+)?(?:\\.(\\d+)?)?)?'],
  ['(\\d+)\\.(\\d+)\\.?(\\d+)?', '(\\d+)\\.(\\d+)(?:\\.(\\d+)?)?'],
  ['(\\d+)\\.?(\\d+)?', '(\\d+)(?:\\.(\\d+)?)?'],
  ['([^.\\s]+)\\.([^.\\s]+)?\\.?([^.\\s]+)?', '([^.\\s]+)\\.([^.\\s]+)?(?:\\.([^.\\s]+)?)?'],
  ['(\\d+).+', '(\\d+)[^\\d].*'],
  ['(\\d+)[\\d.]*', '(\\d+)(?:\\.[\\d.]*)?'],
  ['(\\d+).*', '(\\d+)(?:[^\\d].+)?'],

  /*
   * Don't change the result of the specific regexps
   * (possibly due to presense of other regexps with similar result)
   */
  ['(\\d+).(\\d+)\\.(\\d+)', '(\\d+)[^\\d](\\d+)\\.(\\d+)'],

  /*
   * Incomplete
   *
   * These kinda work (if uncommented) and lower the complexity, but not to O(n) yet
   * O(n^2) should be fine with out restrictions, though
   */
  ['(?:.*SW-Version/.*)*', '(?:.*SW-Version/.*)?'],
  ['(\\d+)\\.?([^.\\s]+)?\\.?([^.\\s]+)?', '(\\d+)\\.?([^.\\s]+)?(?:\\.([^.\\s]+)?)?'],
  //['(\\d+)\\.?([ab]?\\d+)?', '(\\d+)\\.?([ab]?\\d+)?'],
  // Prefix is not fixed for these two:
  [')? *([A-Za-z0-9 \\-_\\!\\[\\]:]*', ')? *((?:[A-Za-z0-9\\-_\\!\\[\\]:][A-Za-z0-9 \\-_\\!\\[\\]:]*)?'],
  [')? *([A-Za-z0-9 _\\!\\[\\]:]*', ')? *((?:[A-Za-z0-9_\\!\\[\\]:][A-Za-z0-9 _\\!\\[\\]:]*)?'],

  /*
   * Affect the result, but seem ok
   */
  // Changing . to \. will break 1-0-0 support, changing to [^\d] will break foo/10000 support
  // We don't want to parse foo/10000 as 1.0.0, let's parse it as 10000.0.0
  ['(\\d+).(\\d+).(\\d+).(\\d+)', '(\\d+)(?:[^\\d](\\d+)(?:[^\\d](\\d+)(?:[^\\d](\\d+))?)?)?'],
  ['(\\d+).(\\d+).(\\d+)', '(\\d+)(?:[^\\d](\\d+)(?:[^\\d](\\d+))?)?'],
  ['(\\d+).(\\d+)', '(\\d+)(?:[^\\d](\\d+))?'],
  // Trimming looks ok
  ['([^/;\\)]+) *', '([^/;\\) ]+) *'] // Trimming looks like a good change
];
// TODO, the fix is incomplete yet!

function fix(pattern) {
  for (var i in replaces) {
    var row = replaces[i];
    if (pattern.indexOf(row[0]) === -1) continue;
    pattern = pattern.replace(row[0], row[1]);
  }
  return pattern;
}

module.exports = { fix: fix };
