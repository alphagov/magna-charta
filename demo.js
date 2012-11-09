$(function() {
  var tables = {};
  $("table").each(function(i, item) {
    var opts = {};
    if(i == 2) { opts.applyOnInit = false; }
    tables[item.id] = $.magnaCharta($(item), opts);
  });

  $("span").on("click", function() {
    var table = $(this).nextAll("table").first();
    var tableMC = tables[table[0].id];
    (tableMC.$table.hasClass("mc-table") ? tableMC.revert() : tableMC.apply());
  });
});
