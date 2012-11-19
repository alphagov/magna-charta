$(function() {
  var tables = {};
  $("table").each(function(i, item) {
    var opts = {};
    //tables[item.id] = $.magnaCharta($(item), {applyOnInit: false});
    tables[item.id] = $.magnaCharta($(item));
    $(this).find('caption').append('<a href="" class="toggle">Toggle chart / table</a>');
  });

  $(".toggle").on("click", function(e) {
    var table = $(this).parents("table");
    var tableMC = tables[table[0].id];
    (tableMC.$table.hasClass("mc-table") ? tableMC.revert() : tableMC.apply());
    e.preventDefault();
  });


});
