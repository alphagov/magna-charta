
$(function() {
  var chart = $.magnaCharta($(".chart"));
  var chart2 = $.magnaCharta($(".chart2"));
  var table = $.magnaCharta($(".table"), { applyOnInit: false });

  $("span").on("click", function() {
    (chart.$table.hasClass("mc-table") ? chart.revert() : chart.apply());
    (chart2.$table.hasClass("mc-table") ? chart2.revert() : chart2.apply());
    (table.$table.hasClass("mc-table") ? devs.revert() : devs.apply());
  });
});
