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
      // get a plugin instance
      this.$table = $("#qunit-fixture").children("table");
      this.$mC = this.$table.magnaCharter();
      // and get an instance to the object
      this.mC = $.magnaCharter.init(this.$table);
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
  test('add classes to all cells that are given a width', function() {
    equal(this.$table.find(".mc-bar-cell").length, 3);
  });

  test('calulateMaxWidth returns object with right max value in', function() {
    deepEqual(this.mC.calculateMaxWidth(), {
      max: parseFloat(5, 10),
      single: parseFloat(100/5)
    });
  });

  test('applying the calculated widths correctly', function() {
    this.mC.applyWidths();
    equal(this.$table.find("tbody td").get(1).style.width, "100%");
    equal(this.$table.find("tbody td").get(3).style.width, "80%");
    equal(this.$table.find("tbody td").get(5).style.width, "60%");
  });

  module("jQuery.magnaCharter");

  test('utils.isFloat', function() {
    ok($.magnaCharter.utils.isFloat(4.56), "4.56 is a float");
    ok($.magnaCharter.utils.isFloat(7), "7 is a float");
    ok(!$.magnaCharter.utils.isFloat("hello"), "hello is not a float");
    ok(!$.magnaCharter.utils.isFloat("hello1344"), "hello1344 is not a float");
  });

  test('utils.returnMax', function() {
    equal($.magnaCharter.utils.returnMax([5,6,7,1]), 7);
    equal($.magnaCharter.utils.returnMax([1,2,1,6]), 6);
    equal($.magnaCharter.utils.returnMax([2,2,1,3]), 3);
    equal($.magnaCharter.utils.returnMax([5,4,3]), 5);
  });

  test('utils.stripValue', function() {
    equal($.magnaCharter.utils.stripValue("1.23m"), "1.23");
    equal($.magnaCharter.utils.stripValue("£1.23m"), "1.23");
    equal($.magnaCharter.utils.stripValue("0.56%"), "0.56");
  });


}(jQuery));
