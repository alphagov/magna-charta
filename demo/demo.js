$(function() {
  var tables = {};
  $("table").each(function(i, item) {
    var opts = {}
    if(i === 5) {
      opts.applyOnInit = false;
    }
    tables[item.id] = $.magnaCharta($(item), opts);
  });
});
