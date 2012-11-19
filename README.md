# Magna Charta

A jQuery plugin for producing bar charts from tables.

## Quick Downloads
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/alphagov/magna-charta/master/dist/magna-charta.min.js
[max]: https://raw.github.com/alphagov/magna-charta/master/dist/magna-charta.js

## Documentation

Documentation is on Github Pages, which means we can show you live graphs, rather than screenshots. [Read the documentation and examples](http://alphagov.github.com/magna-charta/).

## Browser Support

Working in:

- Safari 6
- Chrome
- Firefox
- IE9
- IE8
- Opera
- iPad Safari ( toggle functionality doesn't work )
- Chrome, Android 4.2 ( toggle functionality doesn't work )

By default, we disable the plugin and revert to standard tables for IE<8.

## Contributing

You're going to need Node, npm and Grunt (`npm install -g grunt`) to work on Magna Charta.

- Fork and clone the repository
- Run `grunt test` to make sure the tests are still passing (which they should be).
- Write tests for your new feature and watch them fail.
- Write your feature.
- Get all tests passing.
- Push up to your fork, and then make a pull request.

## Release History

__V0.5.0__
- supports negative values in bar charts. See the [demo graphs](http://alphagov.github.com/magna-charta/).
- CSS rewritten by [Tim](http://github.com/timpaul), using SASS, to provide much nicer examples.
- We add many more useful classes to the chart to help you with CSS styling. Again, see the [documentation](http://alphagov.github.com/magna-charta).
- Added CSS that turns the table header into a legend / key, through purely CSS.

__V0.1.0__
- initial release!

