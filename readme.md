# JS daily calendar component

## FB challenge question

## Author Dan Newcome 2015

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

Instantiate `CalendarDay` with either the ID of the desired container or a reference to the DOM node

```
var calendarDay = new CalendarDay('container');
```

Render events on the timeline using the `layOutDay` method:

```
calendarDay.layOutDay(events);
```
