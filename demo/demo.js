
$(function() {
  var chart = $.magnaCharta($("#single"));
  var multiple = $.magnaCharta($("#multiple"));

  $("span").on("click", function() {
    (chart.$table.hasClass("mc-table") ? chart.revert() : chart.reapply());
    (multiple.$table.hasClass("mc-table") ? multiple.revert() : multiple.reapply());
  });
});
