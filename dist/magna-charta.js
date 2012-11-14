/*! Magna Charta - v0.1.0 - 2012-11-14
* https://github.com/alphagov/magna-charta
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
      this.restoreText();
      this.removeWidths();
      this.removeClasses();
    };

    this.removeClasses = function() {
      this.$table.removeClass("mc-table").find(".mc-key-cell, .mc-row, .mc-bar-cell, .mc-bar-negative, .mc-bar-positive").removeClass("mc-key-cell mc-row mc-bar-cell .mc-bar-negative .mc-bar-positive");
    };

    this.removeWidths = function() {
      this.$table.find(".mc-bar-cell").css("width", "").css("margin-left", "");
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
        resp.maxNegative = parseFloat(maxNegativeValue, 10);
      }


      return resp;
    };

    this.restoreText = function() {
      $(".mc-bar-cell").each(function(i, item) {
        var $cell = $(item);
        var oldText = $cell.data("oldText");
        if(oldText) {
          $cell.text(oldText);
        }
      });
    };

    this.applyWidths = function() {
      this.restoreText();
      this.dimensions = this.calculateMaxWidth();

      var that = this;

      this.$bodyRows.each(function(i, row) {

        var $this = $(row);

        $this.find(".mc-bar-cell").each(function(j, cell) {

          var $cell = $(cell);

          var parsedCellVal = parseFloat(that.utils.stripValue($cell.text()), 10);
          var parsedVal = parsedCellVal * that.dimensions.single;

          var absParsedCellVal = Math.abs(parsedCellVal);
          var absParsedVal = Math.abs(parsedVal);

          // apply the left margin to the positive bars
          if(that.options.negative) {
            if($cell.hasClass("mc-bar-positive")) {
              $(cell).css("margin-left", that.dimensions.marginLeft + "%");
            } else {
              // if its negative but not the maximum negative
              // we need to give it enough margin to push it further right to align
              if(absParsedCellVal < that.dimensions.maxNegative ) {
                // left margin needs to be
                // (largestNegVal - thisNegVal)*single
                var leftMarg = (that.dimensions.maxNegative - absParsedCellVal) * that.dimensions.single;
                $cell.css("margin-left", leftMarg + "%");
              }
            }

          }



          $cell.css("width", absParsedVal + "%");

          // set the text to be the absolute value
          // but first save the old value
          $cell.data("oldText", $cell.text());
          $cell.text(absParsedCellVal);
        });
      });
    };


  };

  $.magnaCharta = function(table, options) {
    return new MagnaCharta().init(table, options);
  };


}(jQuery));
