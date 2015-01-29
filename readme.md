# Daily Calendar Component

## About

This is a FB challenge solution.
Authored by Dan Newcome, Jan 2015

## Usage

include the stylesheet and script file:

```
<link href="calendar.css" rel="stylesheet"></link>
<script src="calendar.js"></script>
```

Create a container for events to be rendered to. The width of the component will be determined by the
`offsetWidth` of the its container.

```
<div id="container"></div>
```

Instantiate `CalendarDay` with either the ID of the desired container or a reference to the DOM node:

```
var calendarDay = new CalendarDay('container');
```

Render events on the timeline using the `layOutDay` method.
Events are given in minutes relative to the top of the container. Generally, one pixel equals one minute. 
Other time scales could be used but it is left to the user to translate the start/end times accordingly.

To render a single event with a half hour duration starting 30 minutes after the start of the timeline:

```
var events = [{start: 30, end: 60}];
calendarDay.layOutDay(events);
```

## Browser support

The component has been tested on recent versions of Chrome and Firefox on OSX and Windows and on IE11.

## Running the tests

Tests are run using mocha under nodejs. Basic smoke testing is done using jsdom to check that the events 
actually rendered. The layout/packing algorithm is completely separate from the rendering function, so 
it can be tested in isolation.  Run:

```
$ npm install
$ npm test
```

## Future work

The current implementation does not support custom time scales and does not provide any conveninece 
facilities for generating the time graduations to the side of the rendered events. 
