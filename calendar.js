/**
 * Calendar layout implementation
 *
 * module exports layOutDay function used
 *  to render a set of events to the calendar
 */

var layOutDay = (function() {
'use strict';

var renderWidth = 600,
	renderHeight = 720,
	containerPadding = 10,
	eventWidths = [];

function startTimeCompare(a, b) {
	return a.start - b.start;
}

function overlaps(a, b) {
	return b.start >= a.start && b.start < a.end ||
		b.end > a.start && b.end < a.end;
}

/**
 * Pack conflicting events into as few columns as possible
 * using a "leftmost free slot" heuristic. Events that 
 * fully "clear" the current set of conflicts reset the 
 * width calculation. 
 */
function packEvents(events) {
	var i,
		j,
		el,
		found,
		cols = [],
		highwater = 0,
		maxcol = 0;

	events.sort(startTimeCompare);

	for(i = 0; i < events.length; i++) {
		found = false;

		// iterate over columns looking for a place to put the event
		for (j = 0; j < cols.length; j++) {
			if (events[i].start >= cols[j]) {
				cols[j] = events[i].end;
				events[i].col = j;
				found = true;

				// 'clear' and start a new context
				if (events[i].start >= highwater) {
					eventWidths.push(maxcol);
					maxcol = 0;
					events[i].clear = true;
				}
				highwater = Math.max(highwater, events[i].end);
				break;
			}
		}

		// add additional column
		if (!found) {
			cols.push([events[i].end]);
			events[i].col = j;
		}
		highwater = Math.max(highwater, events[i].end);
		maxcol = Math.max(maxcol, j);
	}
	eventWidths.push(maxcol);
	// todo: we don't need cols at all
	//return cols;
}

/**
 * render packed events to the DOM.
 * we shift event widths from the event "clear"
 * stack to determine the width of the current
 * conflict set.
 */
function render(events) {
	var container = document.getElementById('container'),
		itemWidth = eventWidths.shift(),
		el,
		bluebar;

	container.innerHTML = '';

	for (var i = 0; i < events.length; i++) {
		if (events[i].clear) {
			itemWidth = eventWidths.shift();
		}

		el = document.createElement('div');
		el.className = 'event';
		el.style.top = events[i].start + 'px';
		el.style.height = (events[i].end - events[i].start) + 'px';

		// todo: get item width added to item
		el.style.width = renderWidth/(itemWidth+1) + 'px';
		el.style.left = (renderWidth/(itemWidth+1))*events[i].col + containerPadding + 'px';

		el.innerHTML = 
			'<div class="Mpx-5"><h2 class="C-blue Fw-500 sans">Sample Item</h2>' +
			'<h3 class="C-grey sans">Sample Location</h3></div>';

		bluebar = document.createElement('div');
		bluebar.className = 'bluebar';
		bluebar.style.top = events[i].start + 'px';
		bluebar.style.height = (events[i].end - events[i].start) + 'px';

		// todo: get item width added to item
		bluebar.style.left = (renderWidth/(itemWidth+1))*events[i].col + containerPadding + 'px';

		// todo: we want to do this in pack, fields are use in unit test 
		events[i].width = renderWidth/(itemWidth+1);
		events[i].left = (renderWidth/(itemWidth+1))*events[i].col;

		container.appendChild(el);			
		container.appendChild(bluebar);			
	}	
	return events;
}

function layOutDay(events) {
	packEvents(events);
	return render(events);
}

if (typeof process != 'undefined') {
	// running under node.js
	module.exports = layOutDay;
}

return layOutDay;
}());
