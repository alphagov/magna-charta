/*! Magna Charta - v3.0.0-rc1 - 2012-12-03
* https://github.com/alphagov/magna-charta
 */

(function($) {


  var MagnaCharta = function() {
    this.init = function(table, options) {
      var defaults = {
        outOf: 65,
        applyOnInit: true,
        toggleText: "Toggle between chart and table",
        barPadding: 0,
        autoOutdent: false,
        outdentAll: false
      };

      this.options = $.extend({}, defaults, options);

      /* detecting IE version
       * original from James Padolsey: https://gist.github.com/527683
       * and then rewritten by Jack Franklin to pass JSHint
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


      // set the stacked option based on
      // giving the table a class of mc-stacked
      this.options.stacked = this.$table.hasClass("mc-stacked");

      // set the negative option based on
      // giving the table a class of mc-negative
      this.options.negative = this.$table.hasClass("mc-negative");

      // true if it's a 'multiple' table
      // this means multiple bars per rows, but not stacked.
      this.options.multiple = !this.options.stacked && (
        this.$table.hasClass("mc-multiple") ||
        this.$table.find("tbody tr").first().find("td").length > 2);

      // set the outdent options
      // which can be set via classes or overriden by setting the value to true
      // in the initial options object that's passed in
      this.options.autoOutdent = this.options.autoOutdent ||
                                 this.$table.hasClass("mc-auto-outdent");

      this.options.outdentAll = this.options.outdentAll ||
                                this.$table.hasClass("mc-outdented");

      // add a mc-multiple class if it is
      if(this.options.multiple) { this.$graph.addClass("mc-multiple"); }

      this.options.hasCaption = !!this.$table.find("caption").length;

      if(this.ENABLED) {
        this.apply();
        // if applyOnInit is false, toggle immediately
        // showing the table, hiding the graph
        if(!this.options.applyOnInit) {
          this.toggle();
        }
      }

      return this;
    };

    // methods for constructing the chart
    this.construct = {};

    //constructs the header
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
        var caption = $("<div />").addClass("mc-caption").html(cap.html());
        return caption;
      }
    };

    // construct a link to allow the user to toggle between chart and table
    this.construct.toggleLink = function() {
      var that = this;
      return $("<a />", {
        "href" : "#",
        "class" : "mc-toggle-link",
        "text" : this.options.toggleText
      }).on("click", function(e) {
        that.toggle(e);
      });
    };



    this.constructChart = function() {
      // turn every element in the table into divs with appropriate classes
      // call them and define this as scope so it's easier to
      // get at options and properties
      var thead = this.construct.thead.call(this);
      var tbody = this.construct.tbody.call(this);

      var toggleLink = this.construct.toggleLink.call(this);


      if(this.options.hasCaption) {
        var caption = this.construct.caption.call(this);
        this.$graph.append(caption);
      }

      this.$table.before(toggleLink);

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
        this.applyOutdent();
      }
    };

    // toggles between showing the table and showing the chart
    this.toggle = function(e) {
      this.$graph.toggle();
      this.$table.toggleClass("visually-hidden");
      if(e) { e.preventDefault(); }
    };

    // some handy utility methods
    this.utils = {
      isFloat: function(val) {
        return !isNaN(parseFloat(val));
      },
      stripValue: function(val) {
        return val.replace('%', '').replace("£", '').replace("m", "").replace(",","");
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
      headerCells = headerCells.filter(":not(:first)");
      if(that.options.stacked) {
        headerCells.last().addClass("mc-header-total");
        headerCells = headerCells.filter(":not(:last)");
      }
      headerCells.addClass("mc-key-header");
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


      // var to store the maximum negative value
      // (used only for negative charts)
      var maxNegativeValue = 0;

      // loop through every tr in the table
      this.$graph.find(".mc-tr").each(function(i, item) {
        var $this = $(item);

        // the first td is going to be the key, so ignore it
        var $bodyCells = $this.find(".mc-td:not(:first)");

        // if it's stacked, the last column is a totals
        // so we don't want that in our calculations
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
            if(parsedVal === 0) {
              $cell.addClass("mc-bar-zero");
            }

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

        // if stacked, we need to push the total value of the row
        // to the values array
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

        // bar count is all the .mc-bar-cell that are not 0 values
        // as 0 value cells are hidden - meaning they dont affect the
        // calculations
        var barCount = $this.find(".mc-bar-cell:not(.mc-bar-zero)").length;

        $this.find(".mc-bar-cell").each(function(j, cell) {

          var $cell = $(cell);

          var parsedCellVal = parseFloat(that.utils.stripValue($cell.text()), 10);


          var parsedVal = parsedCellVal * that.dimensions.single;

          var absParsedCellVal = Math.abs(parsedCellVal);
          var absParsedVal = Math.abs(parsedVal);

          // apply the left margin to the positive bars
          if(that.options.negative) {

            if($cell.hasClass("mc-bar-positive")) {

              $cell.css("margin-left", that.dimensions.marginLeft + "%");

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

          // wrap the cell value in a span tag
          $cell.wrapInner("<span />");
          $cell.css("width", absParsedVal + "%");

        });
      });
    };

    this.insert = function() {
      this.$table.after(this.$graph);
    };

    this.applyOutdent = function() {
      /*
       * this figures out if a cell needs an outdent and applies it
       * it needs an outdent if the width of the text is greater than the width of the bar
       * if this is the case, wrap the value in a span, and use absolute positioning
       * to push it out (the bar is styled to be relative)
       * unfortunately this has to be done once the chart has been inserted
       */
      var that = this;
      var cells = this.$graph.find(".mc-bar-cell");
      this.$graph.find(".mc-bar-cell").each(function(i, cell) {
        var $cell = $(cell);
        var cellVal = parseFloat(that.utils.stripValue($cell.text()), 10);
        var $cellSpan = $cell.children("span");
        var spanWidth = $cellSpan.width() + 10; //+10 just for extra padding
        var cellWidth = $cell.width();
        var cellPercentWidth = parseFloat($cell[0].style.width, 10);
        var cellHeight = $cell.height();

        if(!that.options.stacked) {
          // if it's 0, it is effectively outdented
          if(cellVal === 0) {
            $cell.addClass("mc-bar-outdented");
          }

          if( (that.options.autoOutdent && spanWidth > cellWidth) || that.options.outdentAll) {
            $cell.addClass("mc-bar-outdented");
            $cellSpan.css({
              "margin-left": "100%",
              "display": "inline-block"
            });
          } else {
            $cell.addClass("mc-bar-indented");
          }
        } else {
          if(spanWidth > cellWidth && cellVal > 0) {
            $cell.addClass("mc-value-overflow");
          }
        }
      });

    };


  };


  $.magnaCharta = function(table, options) {
    return new MagnaCharta().init(table, options);
  };


}(jQuery));

