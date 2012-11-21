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
        applyOnInit: true,
        outdentTextLevel: 3
      };
      this.options = $.extend({}, defaults, options);

      /* detecting IE version
       * original from James Padolsey: https://gist.github.com/527683
       * and then rewritten to pass our JSHint
       */
      var ie = (function() {
        var undef,
            v = 3,
            div = document.createElement('div'),
            all = div.getElementsByTagName('i');
        do {
          div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->';
        } while(v < 10 && all[0]);

        return (v > 4) ? v : undef;
      })();

      // if it's IE7 or less, we just show the plain tables
      this.ENABLED = !(ie && ie < 8);

      this.$table = table;

      // lets make what will become the new graph
      this.$graph = $('<div/>').attr('aria-hidden', 'true');

      // copy over classes from the table, and add the extra one
      this.$graph.attr("class", this.$table.attr("class")).addClass("mc-chart");

      // set the stacked option based on giving the table a class of mc-stacked
      this.options.stacked = this.$table.hasClass("mc-stacked");

      this.options.outdentText = (this.options.outdentText === true ? true : this.$table.hasClass("mc-outdented"));

      // set the negative option based on giving the table a class of mc-negative
      this.options.negative = this.$table.hasClass("mc-negative");

      if(this.ENABLED && this.options.applyOnInit) {
        this.apply();
      }

      return this;
    };

    // methods for constructing the chart
    this.construct = {};
    this.construct.thead = function() {
      var thead = $("<div />", {
        "class" : "mc-thead"
      });

      var tr = $("<div />", { "class" : "mc-tr" });
      var output = "";
      this.$table.find("th").each(function(i, item) {
        output += '<div class="mc-th">';
        output += $(item).html();
        output += '</div>';
      });
      tr.append(output);
      thead.append(tr);

      return thead;
    };

    this.construct.tbody = function() {
      var tbody = $("<div />", {
        "class" : "mc-tbody"
      });

      var output = "";
      this.$table.find("tbody tr").each(function(i, item) {
        var tr = $("<div />", { "class" : "mc-tr" });
        var cellsOutput = "";
        $(item).find("td").each(function(j, cell) {
          cellsOutput += '<div class="mc-td">';
          cellsOutput += $(cell).html();
          cellsOutput += '</div>';
        });
        tr.append(cellsOutput);
        tbody.append(tr);
      });
      return tbody;
    };

    this.construct.caption = function() {
      var cap = this.$table.find("caption");
      if(cap.length) {
        var caption = $("<caption />").html(cap.html());
        return caption;
      }
    };



    this.constructChart = function() {
      // turn every element in the table into divs with appropriate classes
      var thead = this.construct.thead.call(this);
      var tbody = this.construct.tbody.call(this);
      var caption = this.construct.caption.call(this);
      this.$graph.append(caption);
      this.$graph.append(thead);
      this.$graph.append(tbody);
    };


    this.apply = function() {
      if(this.ENABLED) {
        this.constructChart();
        this.addClassesToHeader();
        this.calculateMaxWidth();
        this.applyWidths();
        this.insert();
        this.$table.addClass('visually-hidden');
      }
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

    this.addClassesToHeader = function() {
      var that = this;
      var headerCells = this.$graph.find(".mc-th");
      if(this.options.stacked) {
        headerCells.last().addClass("mc-stacked-header");
      }
      headerCells = headerCells.filter(":not(:first)").addClass("mc-key-header");
      headerCells.filter(":not(.mc-stacked-header)").each(function(i, item) {
        $(item).addClass("mc-key-" + (i+1));
      });
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
      this.$graph.find(".mc-tr").each(function(i, item) {
        var $this = $(item);

        // the first td is going to be the key, so ignore it
        var $bodyCells = $this.find(".mc-td:not(:first)");

        // if it's stacked, the last column is a totals, so we don't want that in our calculations
        if(that.options.stacked) {
          var $stackedTotal = $bodyCells.last().addClass("mc-stacked-total");
          $bodyCells = $bodyCells.filter(":not(:last)");
        }

        // first td in each row is key
        $this.find(".mc-td:first").addClass("mc-key-cell");

        // store the total value of the bar cells in a row
        // for anything but stacked, this is just the value of one <td>
        var cellsTotalValue = 0;

        $bodyCells.each(function(j, cell) {

          var $cell = $(cell).addClass("mc-bar-cell").addClass("mc-bar-" + (j+1));

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

    this.applyWidths = function() {
      this.dimensions = this.calculateMaxWidth();

      var that = this;

      this.$graph.find(".mc-tr").each(function(i, row) {

        var $this = $(row);

        $this.find(".mc-bar-cell").each(function(j, cell) {

          var $cell = $(cell);

          var parsedCellVal = parseFloat(that.utils.stripValue($cell.text()), 10);
          var parsedVal = parsedCellVal * that.dimensions.single;

          var absParsedCellVal = Math.abs(parsedCellVal);
          var absParsedVal = Math.abs(parsedVal);

          // apply the left margin to the positive bars
          if(that.options.negative) {
            // if we have to outdent the text, all bars need a small extra left margin

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

              // set the text indent to negative to pull values just out of the bar
              if(that.options.outdentText) {
                $cell.css("text-indent", -(that.options.outdentTextLevel) + "%");
              }
            }

            // there's text to the left of some of the bars
            // so what we do is push all the bars to the right slightly
            // to give room for the text to the left of the negative bars
            if(that.options.outdentText) {
              // for some unknown reason, $cell.css("margin-left") doesn't work here
              // hence the use of [0].style.marginLeft
              var curLeft = parseFloat($cell[0].style.marginLeft || 0, 10);
              $cell.css("margin-left", curLeft + that.options.outdentTextLevel + "%");
            }
          }

          $cell.css("width", absParsedVal + "%");

          if(that.options.outdentText && ($cell.hasClass("mc-bar-positive") || !that.options.negative)) {
            $cell.css("text-indent", (absParsedVal + that.options.outdentTextLevel) + "%");
          }
        });
      });
    };

    this.insert = function() {
      this.$table.after(this.$graph);
    };


  };


  $.magnaCharta = function(table, options) {
    return new MagnaCharta().init(table, options);
  };


}(jQuery));

