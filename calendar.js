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
		k,
		el,
		found,
		evt,
		cols = [],
		region = [],
		maxcol = 0;

	events.sort(startTimeCompare);

	for(i = 0; i < events.length; i++) {
		found = false;
		evt = events[i];

		// iterate over columns looking for a place to put the event
		for (j = 0; j < cols.length; j++) {
			if (evt.start >= cols[j]) {
				// 'clear' and start a new context
				if (evt.start >= Math.max.apply(null, cols)) {
					eventWidths.push(maxcol);
					for (k = 0; k < region.length; k++) {
						region[k].width = renderWidth/(maxcol+1); 
					}
					maxcol = 0;
					evt.clear = true;

					console.log(region);
					region = [];
				}

				cols[j] = evt.end;
				evt.col = j;
				region.push(evt);
				found = true;
				break;
			}
		}

		// add additional column
		if (!found) {
			cols.push([evt.end]);
			region.push(evt);
			events[i].col = j;
		}
		maxcol = Math.max(maxcol, j);
	}
	// push the last width
	eventWidths.push(maxcol);
	console.log(region);
	for (k = 0; k < region.length; k++) {
		region[k].width = renderWidth/(maxcol+1); 
	}
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
		// el.style.width = renderWidth/(itemWidth+1) + 'px';
		el.style.width = events[i].width + 'px';
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
