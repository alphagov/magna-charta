$(function() {
  var tables = {};
  $("table").each(function(i, item) {
    var opts = {};
    if($(item).hasClass("mc-stacked")) {
      opts.barPadding = 3;
    }
    if(item.id == "bigneg") {
      opts.barPadding = 5;
      opts.outOf = 30;
    }
    tables[item.id] = $.magnaCharta($(item), opts);
  });
});
