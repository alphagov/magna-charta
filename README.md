# Magna Charta

A jQuery plugin for producing bar charts from tables.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/alphagov/magna-charta/master/dist/magna-charta.min.js
[max]: https://raw.github.com/alphagov/magna-charta/master/dist/magna-charta.js

## Documentation

Given a simple HTML table:

```html
<p>Shows the niceness of types of Biscuits</p>
<table id="single">
  <thead>
    <tr><td>Testing Data</td><td>Value</td></tr>
  </thead>
  <tbody>
    <tr><td>Caramel Digestives</td><td>5</td></tr>
    <tr><td>Teacakes</td><td>4</td></tr>
    <tr><td>Hobnobs</td><td>3</td></tr>
  </tbody>
</table>
```

You can then apply Magna Charta:

```
var chart = $.magnaCharta($("#single"));
```

And see your table turned into a barchart. Magna Charta doesn't dictate your CSS, but simply attaches a number of useful classes to elements to help you style things.

![](http://cl.ly/image/3u460N2b382i/Screen%20Shot%202012-11-09%20at%2012.03.15.png)

MC adds the following classes:

- `.mc-table` on the `table` element of any table affected by the plugin.
- `.mc-row` is added to any `tr` that is affected by the plugin.
- `.mc-bar-cell` is added to any `td` that is turned into a bar.
- `.mc-key-cell` on any `td`s that are not turned into bars (usually the first `td` in any row).

Once you instantiate the chart, the Magna Charta object is returned to you. This means you can programatically update the table cell values and then redo the bar charts, if you need to:

```javascript
// code here that updates the table cell values
chart.applyWidths();
// chart is now updated with new values
```

We don't just stop at single-bar bar charts, either. Stacked ones are supported:

```html
<p>Cookies from Sainsburys, rated by taste and size.</p>
<table id="multiple">
  <thead>
    <tr><td>Cookie</td><td>Size Rating/5</td><td>Taste Rating/5</td></tr>
  </thead>
  <tbody>
    <tr><td>White Choc and Raspberry</td><td>3</td><td>4</td></tr>
    <tr><td>Triple Choc Chip</td><td>5</td><td>5</td></tr>
    <tr><td>Oatmeal and Raisin</td><td>4</td><td>5</td></tr>
  </tbody>
</table>
```

You don't need to do any extra configuration:

```javascript
var multiple = $.magnaCharta($("#multiple"));
```

![](http://cl.ly/image/2h061H2V3n35/Screen%20Shot%202012-11-09%20at%2012.26.03.png)

It's also possible to easily add a button to revert the chart to a table, and vice-versa. There are two methods that do this:

- `chart.revert()` - completely reverts the effects of Magna Charta. Removes widths, classes, and so on.
- `chart.apply()` - recreates the chart, re-adds all the classes and applies the widths again.

It's easy enough to write a line of code that will toggle them:

```javascript
(chart.$table.hasClass("mc-table") ? chart.revert() : chart.apply());
```

Sometimes you might want to be able to set up a table but not actually apply the widths, so the default state is a plain table, with a button to switch to a chart. There is an option you can pass in to do this.

### Options

As we've already seen, a table is turned into a chart simply with:

```javascript
var chart = $.magnaCharta($("table"));
```

You can also pass in a second argument, an object of options

```javascript
var chart = $.magnaCharta($("table"), {
  outOf: 95,
  applyOnInit: true
});
```

The above values are the default.

- `outOf` means what total % to divide by to calculate the percentages. 95 means that the biggest bar will take up 95% of the width of the table. This is useful as it leaves you room to add some margins, or perhaps some text that hangs off the edge of the chart.
- `applyOnInit` turns the tables into charts as soon as they are initialised. If you set this to false, you'll need to manually apply the charts: `chart.apply();`. There's an example of this in `demo/demo.js`.

### Multiple Tables

If you have multiple tables you'd like to turn into charts, you should loop through each of them and set up an individual instance of the Magna Charta for each table. For example, this:

```javascript
var tables = [];
$("table").each(function(i, item) {
  tables.push($.magnaCharta($(item)));
});
```

Instead of:

```javascript
var tables = $.magnaCharta($("table"));
```

## Contributing

You're going to need Node, npm and Grunt (`npm install -g grunt`) to work on Magna Charta.

- Fork and clone the repository
- Run `grunt test` to make sure the tests are still passing (which they should be).
- Write tests for your new feature and watch them fail.
- Write your feature.
- Get all tests passing.
- Push up to your fork, and then make a pull request.

## Release History

__V0.1.0__
- initial release!
