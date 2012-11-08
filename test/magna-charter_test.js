/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {

  /*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
      expect(numAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      raises(block, [expected], [message])
  */

  module('jQuery#magnaCharter', {
    setup: function() {
      this.$table = $("#qunit-fixture").children("table");
      this.$mC = this.$table.magnaCharter();
    }
  });

  test('is chainable', 1, function() {
    strictEqual(this.$mC, this.$table, 'should be chaninable');
  });

  test('adds a class to all rows it affects', 2, function() {
    // check the thead tr doesnt have the class
    ok(!this.$table.find("thead tr").hasClass("mc-row"), 'doesnt add class to thead rows');
    // check the tbody tr do 
    ok(this.$table.find("tbody tr").hasClass("mc-row"), "adds class to tbody table rows");
  });


}(jQuery));
