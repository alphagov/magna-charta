/*
 * magna-charta
 * https://github.com/alphagov/magna-charta
 *
 * Copyright (c) 2012 Jack Franklin
 * Licensed under the MIT license.
 */

(function($) {

  var MagnaCharta = function() {
    this.init = function(table, options) {
      var defaults = {
        outOf: 65,
        applyOnInit: true
      };
      this.options = $.extend({}, defaults, options);
      this.$table = table;


      // set the stacked option based on giving the table a class of mc-stacked
      this.options.stacked = this.$table.hasClass("mc-stacked");

      // set the negative option based on giving the table a class of mc-negative
      this.options.negative = this.$table.hasClass("mc-negative");
      this.$bodyRows = this.$table.find("tr");

      if(this.options.applyOnInit) {
        this.apply();
      }

      return this;
    };

    this.apply = function() {
      this.addClasses();
      this.applyWidths();
    };

    this.revert = function() {
      this.removeWidths();
      this.removeClasses();
    };

    this.removeClasses = function() {
      this.$table.removeClass("mc-table").find(".mc-key-cell, .mc-row, .mc-bar-cell").removeClass("mc-key-cell mc-row mc-bar-cell");
    };

    this.removeWidths = function() {
      this.$table.find(".mc-bar-cell").css("width", "");
    };

    this.utils = {
      isFloat: function(val) {
        return !isNaN(parseFloat(val));
      },
      stripValue: function(val) {
        return val.replace('%', '').replace("£", '').replace("m", "");
      },
      returnMax: function(values) {
        var max = 0;
        for(var i = 0; i < values.length; i++) {
          if(values[i] > max) { max = values[i]; }
        }
        return max;
      },
      isNegative: function(value) {
        return (value < 0);
      }
    };


    this.addClasses = function() {
      this.$table.addClass("mc-table");
    };

    this.calculateMaxWidth = function() {
      // JS scoping sucks
      var that = this;

      // store the cell values in here so later
      // so we can figure out the maximum value later
      var values = [];


      // var to store the maximum negative value, (used only for negative charts)
      var maxNegativeValue = 0;

      // loop through every tr in the table
      this.$bodyRows.each(function(i, item) {
        var $this = $(item);

        // the first td is going to be the key, so ignore it
        var $bodyCells = $this.find("td:not(:first)");

        // if it's stacked, the last column is a totals, so we don't want that in our calculations
        if(that.options.stacked) {
          var $stackedTotal = $bodyCells.last().addClass("mc-stacked-total");
          $bodyCells = $bodyCells.filter(":not(:last)");
        }

        // find all the header ccells and give them the right classes
        var $headCells = $this.find("th:not(:first, .total)").addClass("mc-key-cell");
        // do the same with the first td in each row
        $this.find("td:first").addClass("mc-key-cell");

        // store the total value of the bar cells in a row
        // for anything but stacked, this is just the value of one <td>
        var cellsTotalValue = 0;

        $bodyCells.each(function(j, cell) {

          var $cell = $(cell).addClass("mc-bar-cell");

          var cellVal = that.utils.stripValue($cell.text());

          if(that.utils.isFloat(cellVal)) {

            var parsedVal = parseFloat(cellVal, 10);
            var absParsedVal = Math.abs(parsedVal);

            if(that.options.negative) {

              if(that.utils.isNegative(parsedVal)) {
                $cell.addClass("mc-bar-negative");
                if(absParsedVal > maxNegativeValue) {
                  maxNegativeValue = absParsedVal;
                }
              } else {
                $cell.addClass("mc-bar-positive");
              }
            }
            // now we are done with our negative calculations
            // set parsedVal to absParsedVal
            parsedVal = absParsedVal;

            if(!that.options.stacked) {
              cellsTotalValue = parsedVal;
              values.push(parsedVal);
            } else {
              cellsTotalValue += parsedVal;
            }
          }
        });

        // if stacked, we need to push the total value of the row to the values array
        if(that.options.stacked) { values.push(cellsTotalValue); }

      });

      var resp = {};
      resp.max = parseFloat(that.utils.returnMax(values), 10);
      resp.single = parseFloat(this.options.outOf/resp.max, 10);
      if(this.options.negative) {
        resp.marginLeft = parseFloat(maxNegativeValue, 10) * resp.single;
      }

      return resp;
    };

    this.applyWidths = function() {

      this.dimensions = this.calculateMaxWidth();

      var that = this;

      this.$bodyRows.each(function(i, row) {

        var $this = $(row);

        $this.find(".mc-bar-cell").each(function(j, cell) {

          var $cell = $(cell);

          var parsedVal = parseFloat(that.utils.stripValue($cell.text()), 10) * that.dimensions.single;

          var absParsedVal = Math.abs(parsedVal);

          // apply the left margin to the positive bars
          if(that.options.negative) {
            if($cell.hasClass("mc-bar-positive")) {
              $(cell).css("margin-left", that.dimensions.marginLeft + "%");
            }
          }



          $(cell).css("width", absParsedVal + "%");
        });
      });
    };


  };

  $.magnaCharta = function(table, options) {
    return new MagnaCharta().init(table, options);
  };


}(jQuery));
