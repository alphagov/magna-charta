/*! Magna Charta - v0.1.0 - 2012-11-13
* https://github.com/alphagov/magna-charta
 */

(function($) {

  var MagnaCharta = function() {
    this.init = function(table, options) {
      var defaults = {
        outOf: 65,
        applyOnInit: true,
        stacked: false
      };
      this.options = $.extend({}, defaults, options);
      this.$table = table;


      // set the stacked option based on giving the table a class of mc-stacked
      this.options.stacked = this.$table.hasClass("mc-stacked");
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
      }
    };


    this.addClasses = function() {
      this.$table.addClass("mc-table");
    };

    this.calculateMaxWidth = function() {
      var that = this;
      var resp = {
        max: 0,
        single: 0
      };
      var values = [];
      this.$bodyRows.each(function(i, item) {
        var $this = $(item);
        var $bodyCells = $this.find("td:not(:first)");
        if(that.options.stacked) {
          // if it's stacked, the last column is a totals, so we don't want that in our calculations
          var $stackedTotal = $bodyCells.last().addClass("mc-stacked-total");
          $bodyCells = $bodyCells.filter(":not(:last)");
        }
        var $headCells = $this.find("th:not(:first, .total)").addClass("mc-key-cell");
        $this.find("td:first").addClass("mc-key-cell");
        var cellsTotalValue = 0;
        $bodyCells.each(function(j, cell) {
          var $cell = $(cell).addClass("mc-bar-cell");
          var cellVal = that.utils.stripValue($cell.text());
          if(that.utils.isFloat(cellVal)) {
            var parsedVal = parseFloat(cellVal, 10);
            if(!that.options.stacked) {
              cellsTotalValue = parsedVal;
              values.push(parsedVal);
            } else {
              cellsTotalValue += parsedVal;
            }
          }
        });

        if(that.options.stacked) { values.push(cellsTotalValue); }
        resp.max = parseFloat(that.utils.returnMax(values), 10);
      });
      resp.single = parseFloat(this.options.outOf/resp.max, 10);
      return resp;
    };

    this.applyWidths = function() {
      this.dimensions = this.calculateMaxWidth();
      var that = this;
      this.$bodyRows.each(function(i, row) {
        var $this = $(row);
        $this.find(".mc-bar-cell").each(function(j, cell) {
          var val = parseFloat(that.utils.stripValue($(cell).text()), 10) * that.dimensions.single;
          $(cell).css({
            "width": val + "%"
          });
        });
      });
    };


  };

  $.magnaCharta = function(table, options) {
    return new MagnaCharta().init(table, options);
  };


}(jQuery));
