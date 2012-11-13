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

  module('jQuery.magnaCharta', {
    setup: function() {
      // get a plugin instance
      this.$singleTable = $("#qunit-fixture").children("#single");
      this.singleMC = $.magnaCharta(this.$singleTable);

      // now do the same for a table with more rows of data
      this.$multiTable = $("#qunit-fixture").children("#multiple");
      this.multiMC = $.magnaCharta(this.$multiTable, {
        stacked: true
      });
    }
  });


  test('adds a class to all table cells that become bars', function() {
    equal(this.$singleTable.find(".mc-bar-cell").length, 3, 'single table should have three bars');
    equal(this.$multiTable.find(".mc-bar-cell").length, 6, 'stacked should have 6 bars');
  });

  test('adds a class to all cells that become keys (including headers)', function() {
    equal(this.$singleTable.find(".mc-key-cell").length, 4);
  });


  test('add classes to all cells that are given a width', function() {
    equal(this.$singleTable.find(".mc-bar-cell").length, 3);
    equal(this.$multiTable.find(".mc-bar-cell").length, 6);
  });

  test('calulateMaxWidth returns object with right max value in', function() {
    deepEqual(this.singleMC.calculateMaxWidth(), {
      max: parseFloat(5, 10),
      single: parseFloat(65/5, 10)
    });

    deepEqual(this.multiMC.calculateMaxWidth(), {
      max: parseFloat(12, 10),
      single: parseFloat(65/12, 10)
    });
  });

  test('applying the calculated widths correctly', function() {
    //widths are 65/max * val (65 by default)
    var cW = function(max, val) {
      return (65/max)*val+"%";
    };
    equal(this.$singleTable.find("tbody td").get(1).style.width, cW(5, 5));
    equal(this.$singleTable.find("tbody td").get(3).style.width, cW(5, 4));
    equal(this.$singleTable.find("tbody td").get(5).style.width, cW(5, 3));

    equal(this.$multiTable.find("tbody td").get(1).style.width, cW(12, 5));
    equal(this.$multiTable.find("tbody td").get(2).style.width, cW(12, 6));
    equal(this.$multiTable.find("tbody td").get(5).style.width, cW(12, 6));
    equal(this.$multiTable.find("tbody td").get(6).style.width, cW(12, 2));
    equal(this.$multiTable.find("tbody td").get(9).style.width, cW(12, 3));
    equal(this.$multiTable.find("tbody td").get(10).style.width, cW(12, 9));
  });

  test('it can revert back to a regular table', function() {
    this.singleMC.revert();
    equal(this.$singleTable.find(".mc-key-cell").length, 0);
    equal(this.$singleTable.find(".mc-bar-cell").length, 0);
    equal(this.$singleTable.find(".mc-row").length, 0);
    equal(this.$singleTable.find("tbody td").get(1).style.width, "");
  });
  
  test('it can revert back to a regular table and then back to chart', function() {
    this.singleMC.revert();
    equal(this.$singleTable.find(".mc-key-cell").length, 0);
    equal(this.$singleTable.find(".mc-bar-cell").length, 0);
    equal(this.$singleTable.find(".mc-row").length, 0);
    equal(this.$singleTable.find("tbody td").get(1).style.width, "");
    this.singleMC.apply();
    equal(this.$singleTable.find("tbody td").get(1).style.width, (65/5)*5 + "%");
    equal(this.$singleTable.find(".mc-bar-cell").length, 3);
  });

  test('utils.isFloat', function() {
    ok(this.singleMC.utils.isFloat(4.56), "4.56 is a float");
    ok(this.singleMC.utils.isFloat(7), "7 is a float");
    ok(!this.singleMC.utils.isFloat("hello"), "hello is not a float");
    ok(!this.singleMC.utils.isFloat("hello1344"), "hello1344 is not a float");
  });

  test('utils.returnMax', function() {
    equal(this.singleMC.utils.returnMax([5,6,7,1]), 7);
    equal(this.singleMC.utils.returnMax([1,2,1,6]), 6);
    equal(this.singleMC.utils.returnMax([2,2,1,3]), 3);
    equal(this.singleMC.utils.returnMax([5,4,3]), 5);
  });

  test('utils.stripValue', function() {
    equal(this.singleMC.utils.stripValue("1.23m"), "1.23");
    equal(this.singleMC.utils.stripValue("£1.23m"), "1.23");
    equal(this.singleMC.utils.stripValue("0.56%"), "0.56");
  });


}(jQuery));
