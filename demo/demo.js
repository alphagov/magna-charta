$(function() {
  var tables = {};
  $("table").each(function(i, item) {
    var opts = {};
    if($(item).hasClass("mc-stacked")) {
      opts.barPadding = 4;
    }
    tables[item.id] = $.magnaCharta($(item), opts);
  });
});
