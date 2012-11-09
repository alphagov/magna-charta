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

- `.mc-row` is added to any `tr` that is affected by the plugin.
- `.mc-bar-cell` is added to any `td` that is turned into a bar.

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

You don't need to do any extra configuration either:

```javascript
var multiple = $.magnaCharta($("#multiple"));
```

![](http://cl.ly/image/2h061H2V3n35/Screen%20Shot%202012-11-09%20at%2012.26.03.png)






## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_
