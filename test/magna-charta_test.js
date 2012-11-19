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

  module('jQuery.magnaCharta SINGLE', {
    setup: function() {
      this.$singleTable = $("#qunit-fixture").children("#single");
      this.singleMC = $.magnaCharta(this.$singleTable);
    }
  });


  //widths are 65/max * val (65 by default)
  var cW = function(max, val) {
    return (65/max)*val+"%";
  };

  test('creates a new div containing the chart', function() {
    equal(this.singleMC.$graph.length, 1);
  });
  test('the new chart div has a class mc-chart', function() {
    ok(this.singleMC.$graph.hasClass("mc-chart"));
  });

  test('the new chart copies over any other classes', function() {
    ok(this.singleMC.$graph.hasClass("no-key"));
  });

  test('new chart div contains all table bits as divs', function() {
    ok(this.singleMC.$graph.find(".mc-thead").length);
    equal(this.singleMC.$graph.find(".mc-tr").length, 4);
    equal(this.singleMC.$graph.find(".mc-th").length, 2);
    equal(this.singleMC.$graph.find(".mc-td").length, 6);
  });

  test('new chart divs contain the right values', function() {
    var cells = this.singleMC.$graph.find(".mc-td");
    equal(cells.eq(0).text(), "Testing One");
    equal(cells.eq(1).text(), 5);
    equal(this.singleMC.$graph.find(".mc-th").eq(0).text(), "Some Data");
  });

  test('figures out the maximum graph value', function() {
    deepEqual(this.singleMC.calculateMaxWidth(), {
      max: parseFloat(5, 10),
      single: parseFloat(65/5, 10)
    });
  });

  test('divs that are bars or keys are given correct classes', function() {
    equal(this.singleMC.$graph.find(".mc-key-cell").length, 3);
    equal(this.singleMC.$graph.find(".mc-bar-cell").length, 3);
  });

  test('bars are given the correct width', function() {
    var bars = this.singleMC.$graph.find(".mc-bar-cell");
    equal(bars.get(0).style.width, cW(5,5));
    equal(bars.get(1).style.width, cW(5, 4));
    equal(bars.get(2).style.width, cW(5, 3));
  });

  test('new chart is inserted into DOM after table', function() {
    ok(this.singleMC.$table.next().hasClass("mc-chart"));
  });


  // test('adds a class to all table cells that become bars', function() {
  //   equal(this.$singleTable.find(".mc-bar-cell").length, 3, 'single table should have three bars');
  //   equal(this.$multiTable.find(".mc-bar-cell").length, 6, 'stacked should have 6 bars');
  //   equal(this.$negTable.find(".mc-bar-cell").length, 4, 'negative should have 4 bars');
  // });

  // test('adds a class to all cells that become keys (including headers)', function() {
  //   equal(this.$singleTable.find(".mc-key-cell").length, 4);
  // });

  // test('you can set options by applying classes', function() {
  //   ok(this.negMC.options.negative);
  //   ok(this.multiMC.options.stacked);
  //   ok(!this.singleMC.options.negative);
  //   ok(!this.multiMC.options.negative);
  // });


  // test('calulateMaxWidth returns object with right max value in', function() {

  //   deepEqual(this.multiMC.calculateMaxWidth(), {
  //     max: parseFloat(12, 10),
  //     single: parseFloat(65/12, 10)
  //   });

  //   // need to restore the text to use negative values
  //   this.negMC.restoreText();
  //   deepEqual(this.negMC.calculateMaxWidth(), {
  //     max: parseFloat(10, 10),
  //     single: parseFloat(65/10, 10),
  //     marginLeft: parseFloat(10, 10) * parseFloat(65/10, 10),
  //     maxNegative: parseFloat(10, 10)
  //   }, "Gives back extra info for the negative charts");
  // });

  // test('applying the calculated widths correctly', function() {
  //   equal(this.$singleTable.find("tbody td").get(1).style.width, cW(5, 5));
  //   equal(this.$singleTable.find("tbody td").get(3).style.width, cW(5, 4));
  //   equal(this.$singleTable.find("tbody td").get(5).style.width, cW(5, 3));

  //   equal(this.$multiTable.find("tbody td").get(1).style.width, cW(12, 5));
  //   equal(this.$multiTable.find("tbody td").get(2).style.width, cW(12, 6));
  //   equal(this.$multiTable.find("tbody td").get(5).style.width, cW(12, 6));
  //   equal(this.$multiTable.find("tbody td").get(6).style.width, cW(12, 2));
  //   equal(this.$multiTable.find("tbody td").get(9).style.width, cW(12, 3));
  //   equal(this.$multiTable.find("tbody td").get(10).style.width, cW(12, 9));
  // });

  // test('it can revert back to a regular table', function() {
  //   this.singleMC.revert();
  //   equal(this.$singleTable.find(".mc-key-cell").length, 0);
  //   equal(this.$singleTable.find(".mc-bar-cell").length, 0);
  //   equal(this.$singleTable.find(".mc-row").length, 0);
  //   equal(this.$singleTable.find("tbody td").get(1).style.width, "");
  // });

  // test('it can revert back to a regular table and then back to chart', function() {
  //   this.singleMC.revert();
  //   equal(this.$singleTable.find(".mc-key-cell").length, 0);
  //   equal(this.$singleTable.find(".mc-bar-cell").length, 0);
  //   equal(this.$singleTable.find(".mc-row").length, 0);
  //   equal(this.$singleTable.find("tbody td").get(1).style.width, "");
  //   this.singleMC.apply();
  //   equal(this.$singleTable.find("tbody td").get(1).style.width, (65/5)*5 + "%");
  //   equal(this.$singleTable.find(".mc-bar-cell").length, 3);
  // });

  // test('for negative charts, it adds extra classes', function() {
  //   equal(this.$negTable.find(".mc-bar-positive").length, 2);
  //   equal(this.$negTable.find(".mc-bar-negative").length, 2);
  // });

  // test('for negative charts, it adds margins to the positive bars equal to the width of the negative bar', function() {
  //   equal(this.$negTable.find(".mc-bar-positive")[0].style.marginLeft, cW(10, 10));
  //   equal(this.$negTable.find(".mc-bar-positive")[1].style.marginLeft, cW(10, 10));
  // });

  // test('for negative charts, it applies the right widths', function() {
  //   equal(this.$negTable.find(".mc-bar-positive")[0].style.width, cW(10, 10));
  //   equal(this.$negTable.find(".mc-bar-positive")[1].style.width, cW(10, 5));
  //   equal(this.$negTable.find(".mc-bar-negative")[0].style.width, cW(10, 5));
  //   equal(this.$negTable.find(".mc-bar-negative")[1].style.width, cW(10, 10));
  // });

  test('utils.isFloat', function() {
    ok(this.singleMC.utils.isFloat(4.56), "4.56 is a float");
    ok(this.singleMC.utils.isFloat(7), "7 is a float");
    ok(!this.singleMC.utils.isFloat("hello"), "hello is not a float");
    ok(!this.singleMC.utils.isFloat("hello1344"), "hello1344 is not a float");
    ok(this.singleMC.utils.isFloat("-4"), "-4 is a float");
    ok(this.singleMC.utils.isFloat("-4.56m"), "-4.56 is a float");
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

  test('utils.isNegative', function() {
    ok(!this.singleMC.utils.isNegative(4));
    ok(this.singleMC.utils.isNegative(-4));
  });


}(jQuery));
