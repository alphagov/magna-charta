
$(function() {
  var charts = [];
  $(".chart").each(function(i, item) {
    charts.push($.magnaCharta($(item)));
  });
  var table = $.magnaCharta($(".table"), { applyOnInit: false });

  $(".toggle").on("click", function() {
    (table.$table.hasClass("mc-table") ? table.revert() : table.apply());
    return false;
  });
});
