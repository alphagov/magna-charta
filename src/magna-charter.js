/*
 * magna-charter
 * https://github.com/alphagov/magna-charter
 *
 * Copyright (c) 2012 Jack Franklin
 * Licensed under the MIT license.
 */

(function($) {

  var magnaCharter = {
    init: function(table) {
      this.$table = table;
      this.$bodyRows = this.$table.find("tbody tr");
      this.addClasses();
      return this;
    },
    utils: {
    },
    addClasses: function() {
      this.$bodyRows.addClass("mc-row");
    }
  };


  $.fn.magnaCharter = function() {
    return this.each(function() {
      var mC = magnaCharter.init($(this));
    });
  };

}(jQuery));
