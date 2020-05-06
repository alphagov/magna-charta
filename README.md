# Magna Charta - ARCHIVED

A jQuery plugin for producing bar charts from tables.

## Downloading

- If you want to download the latest version, just grab the [latest minified within dist][min]. 

- Else, we tag specific versions as [Tags on Github](https://github.com/alphagov/magna-charta/tags), which lets you download the entire repository at a specific version (from V2).

- Or, from V3 onwards, we put the downloads on the [Github downloads page](https://github.com/alphagov/magna-charta/downloads).

## Documentation

### How it works
It works by duplicating the table into a `div`, containing more `div`s, which are given various classes to be styled. We provide a sample stylesheet, but none of the styles are applied through the JS. The styling is entirely up to you. The JavaScript is used to give each "bar" within the chart a width, relative to the value within it.

When first beginning, we recommend you start off with our example CSS (written in SASS), or at least use it for reference when writing your chart CSS. It's a nice starting point.

### How to Use it

Grab a copy of jQuery and the Magna Charta source (use the minified version) and then it's as easy as calling `$.magnaCharta()` on some tables.

```javascript
var chart = $.magnaCharta($("#table1"));
```

Once you instantiate a chart, the instance of Magna Charta is returned to you.

#### Passing in Options

Magna Charta has some options that are passed in through the JavaScript, and some that can be defined on a per-table basis using CSS classes. We'll cover those shortly, but here's what you can configure through JS _(values shown are defaults)_:

```js
{
  outOf: 65, // number to calculate the bar % out of
  applyOnInit: true, // apply the chart immediately
  toggleText: "Toggle between chart and table", // if you want toggle links to be added
  autoOutdent: false, // will automatically place values too big for a bar outside it
  outdentAll: false // will place all bar values just outside the bar rather than sitting in the bar
};
```

There's also some options you can set through classes on the table:

- `.mc-stacked`: this tells MC that the chart is stacked - that there are multiple bars per line (for example, [like this](http://cl.ly/image/2j1h2J2M2g0Z/Screen%20Shot%202012-11-23%20at%2011.32.28.png).
- `.mc-negative`: tells MC that some of the bars in the chart will be negative.

Whilst you can sert the outdenting options in the JavaScript, you can also set them in the CSS if you'd prefer:

- `.mc-auto-outdent`: will automatically outdent values too big for the bars to contain them
- `.mc-outdented`: will outdent every value so it sits just outside the bar rather than within

#### Classes we add

To help with styling, and cross-browser support, there's a tonne of CSS classes we add to charts. For consistency, they are all prefixed with `mc-`. Of course, you can also style based on the classes youd efine to set options (see above). If you're confused, the best way to check it out is to look at the code on our demo page. Inspect the generated charts, and view the HTML classes on there.

- `.mc-chart`: added to the `div` containing the chart
- `.mc-thead`: added to the `div` containing the table head. Similar classes exist for other divs representing table elements: `.mc-thead, .mc-tbody, .mc-th, .mc-td, .mc-tr`.
- `.mc-bar-cell`: added to any `div` turned into a bar
- `.mc-bar-{i}`: any row that contains multiple bars has its bars given a class based on their index within the row. So the first bar in the row gets a class `.mc-bar-1`, the second `.mc-bar-2`, and so on. This is a nice way to colour different bars different colours.
- `.mc-key-{i}`: similarly to above, when there's multiple columns in a chart, one per value, the cells with the header that denote what bars are what are given corresponding classes based on their index. This is an easy way to give the cell in the header the same colour as the corresponding bar in the table.
- `.mc-bar-indented`: given to a bar that has its text value indented (within the bar).
- `.mc-bar-outdented`: given to a bar that has its text value outdented.
- `.mc-bar-negative`: given to a bar with a negative value within.
- `.mc-bar-positive`: given to a bar with a positive value within (but only if this chart is a negative chart).
- `.mc-key-cell`: given to the cell in the table row that contains the key, not a value.

As said above, we recommend you start with our CSS, or at least refer to it as a starting point.



## Live Examples
We use Github Pages, which means we can show you live graphs, rather than screenshots. [Go check out the Magna Charta](http://alphagov.github.com/magna-charta/).

You can also see the JavaScript and CSS used to make the charts.

## Browser Support

Using our CSS, working in:

- Safari 5
- Safari 6
- Chrome
- Firefox
- IE9
- IE8
- Opera
- iPhone, iPad
- Chrome, Android 4.2

We disable the plugin and revert to standard tables for IE < 8. You can change this though on [this line](https://github.com/alphagov/magna-charta/blob/master/src/magna-charta.js#L43).

## Contributing

You're going to need Node (V0.8+), npm and Grunt (`npm install -g grunt`) to work on Magna Charta.

- Fork and clone the repository
- Run `grunt test` to make sure the tests are still passing (which they should be).
- Write tests for your new feature and watch them fail.
- Write your feature.
- Get all tests passing.
- Run `grunt` to generate a new Grunt build.
- Push up to your fork, and then make a pull request.

## Release History / Changelist

_We use [Semantic Versioning](http://semver.org/) for our version numbers._


__3.0.1__

- Change `visually-hidden` class to follow convention on other `alphagov` repos
- Introduce `aria-hidden` for the toggle link

__3.0.0__

- Version 3 released!
- a lot of refactoring, rewriting and adding more tests to cover more of the functionality.
- be aware that the `barPadding` option has been removed. (see 3.0.0-rc1 notes for more).

__3.0.0-rc2__

- rewritten to add new methods to `MagnaCharta.prototype`. General tidying and adding of comments to tidy up code.

__3.0.0-rc1__

- Calculating the bar padding just was not reliable - there were too many factors. That feature has been removed, and we have enhanced the toggle functionality. Toggle links are added automatically. You can define if the table view or chart view is the default by setting `applyOnInit` (default `true`). If you want to stick to the old functionality, we advise you to stick with V2.02 [Download here](https://github.com/alphagov/magna-charta/archive/v2.0.2.zip).

__2.0.2__

- fixed the way MC applies padding across stacked bars. It now distributes the padding evenly across all the bars

__2.0.1__

- add class to the last cell in a header when the bar is stacked - this is the total

__2.0.0__

A lot of rewriting went on here, to hugely improve the way we outdet numbers in bars in particular. It's not backwards compat however, hence the leap to V2. However, the code has improved hugely and as such it's suggested you make the leap.

- support for automatically outdenting numbers if they are too big for the bar
- outdent negative bar values to the right, so they wont overlap the labels
- wrapped a `span` around each bar's value, meaning we can control the positioning of the text much better, and be more robust
- charts that have multiple values per row but are not stacked are now given a class of `mc-multiple`.


__1.2.4__
- fix alignment when using extra bar padding on negative bars

__1.2.3__
- copy the caption over as a div, not as a caption, as that's invalid

__1.2.2__
- added option to add padding to cells with small values, to make sure it's always wide enough for the value to be visible

__1.2.1__
- fixed bug that meant it would break with tables that didn't have a `caption` tag

__1.2.0__
- "toggle" link is now automatically added to both the table and the graph. Has class of `mc-toggle-link`.
- new option, `toggleText`, defining what text the toggle link should contain.
- new method, `magnaCharta#toggle`, that shows/hides the graph and toggles the class `visually-hidden` on the table, which is styled to hide the table in a more accessible way.

__1.1.3__
- fixed bug that meant screen-reader users did not have access to the tables and instead had to try to understand the div chart

__1.1.2__
- fixed bug that broke negative bar charts when using outdented text, extra margins are now applied to deal with this. Some CSS styling also required ( see the sample stylesheet within `demo`).
- removed functionality that removes negative sign from negative values within chart. Decided it was misleading and not entirely clear (hat-tip @rooreynolds).

__1.1.1__
- change to make the outdented text option to be set through a class on the table, by adding `mc-outdented`, as an alternative to setting it as an option through the JS. Both work, adding a class is preferred.


__1.1.0__
- added options to allow the text to be outdented, so it sits outside the bar, just to the right.
- To do this, set `outdentText` option to `true`. The default amount to allow is the bar width + 3%, but you can set the value `outdentTextLevel` to something new.

__1.0.0__
- we completely rewrote Magna Charta, and are "re-releasing" as V1.0.0. From now on we'll use proper semantic versioning to manage releases.
- instead of applying CSS and styling to a table, we duplicate the table as a large amount of `div`s, that are styled. Doing this instead of styling a table means we end up not fighting browser's interpretations of table styling.



[min]: https://raw.github.com/alphagov/magna-charta/master/dist/magna-charta.min.js
[max]: https://raw.github.com/alphagov/magna-charta/master/dist/magna-charta.js
