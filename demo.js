$(function() {
  var tables = {};
  $("table").each(function(i, item) {
    var opts = {};
    if(i == 2) { opts.stacked = true; opts.outOf = 60 }
    tables[item.id] = $.magnaCharta($(item), opts);

    $(this).find('caption').append('<a href="" class="toggle">Toggle chart / table</a>');
  });

  $(".toggle").on("click", function(e) {
    var table = $(this).parents("table");
    var tableMC = tables[table[0].id];
    (tableMC.$table.hasClass("mc-table") ? tableMC.revert() : tableMC.apply());
    e.preventDefault();
  });
});
