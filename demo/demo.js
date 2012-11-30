$(function() {
  var tables = {};
  $("table").each(function(i, item) {
    tables[item.id] = $.magnaCharta($(item));
  });
});
