/*
 * magna-charter
 * https://github.com/alphagov/magna-charter
 *
 * Copyright (c) 2012 Jack Franklin
 * Licensed under the MIT license.
 */

(function($) {

  $.magnaCharter = {
    init: function(table) {
      this.$table = table;
      this.$bodyRows = this.$table.find("tbody tr");
      this.addClasses();
      this.dimensions = this.calculateMaxWidth();
      return this;
    },
    utils: {
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
    },
    addClasses: function() {
      this.$bodyRows.addClass("mc-row");
    },
    calculateMaxWidth: function() {
      var that = this;
      var resp = {
        max: 0,
        single: 0
      };
      var values = [];
      this.$bodyRows.each(function(i, item) {
        var $this = $(item);
        var $bodyCells = $this.find("td:not(:first)");
        $bodyCells.each(function(j, cell) {
          var $cell = $(cell);
          var cellVal = that.utils.stripValue($cell.text());
          if(that.utils.isFloat(cellVal)) {
            values.push(parseFloat(cellVal, 10));
          }
        });
        resp.max = parseFloat(that.utils.returnMax(values), 10);
      });
      resp.single = parseFloat(100/resp.max, 10);
      return resp;
    },
    applyWidths: function() {
      var that = this;
      this.$bodyRows.each(function(i, row) {
        var $this = $(row);
        $this.find("td:not(:first)").each(function(j, cell) {
          var val = parseFloat(that.utils.stripValue($(cell).text()), 10) * that.dimensions.single;
          $(cell).css({
            "width": val + "%"
          });
        });
      });
    }

  };


  $.fn.magnaCharter = function() {
    return this.each(function() {
      var mC = $.magnaCharter.init($(this));
    });
  };

}(jQuery));
