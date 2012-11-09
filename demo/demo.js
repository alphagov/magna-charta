
$(function() {
  var chart = $.magnaCharta($("#single"));
  var multiple = $.magnaCharta($("#multiple"));
  var devs = $.magnaCharta($("#single2"), { applyOnInit: false });

  $("span").on("click", function() {
    (chart.$table.hasClass("mc-table") ? chart.revert() : chart.apply());
    (multiple.$table.hasClass("mc-table") ? multiple.revert() : multiple.apply());
    (devs.$table.hasClass("mc-table") ? devs.revert() : devs.apply());
  });
});
