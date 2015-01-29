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
	eventWidths = [],
	debug = true;

function startTimeCompare(a, b) {
	return a.start - b.start;
}

function overlaps(a, b) {
	return b.start >= a.start && b.start < a.end ||
		b.end > a.start && b.end < a.end;
}

function log(msg) {
	if(debug) {
		console.log(msg);
	}
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
						region[k].left = (renderWidth/(maxcol+1))*region[k].col;
					}
					maxcol = 0;
					evt.clear = true;
					log(region);
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
	log(region);
	for (k = 0; k < region.length; k++) {
		region[k].width = renderWidth/(maxcol+1); 
		region[k].left = (renderWidth/(maxcol+1))*region[k].col;
	}
	return events;
}

/**
 * render packed events to the DOM.
 */
function render(events) {
	var container = document.getElementById('container'),
		el,
		bluebar;

	container.innerHTML = '';

	for (var i = 0; i < events.length; i++) {
		el = document.createElement('section');
		el.className = 'event';
		el.style.top = events[i].start + 'px';
		el.style.height = (events[i].end - events[i].start) + 'px';
		el.style.width = events[i].width + 'px';
		// todo: where does container padding belong?
		el.style.left = events[i].left + containerPadding + 'px';
		el.innerHTML = 
			'<h2>Sample Item</h2>' +
			'<h3>Sample Location</h3>';
		container.appendChild(el);			

		bluebar = document.createElement('div');
		bluebar.className = 'bluebar';
		bluebar.style.top = events[i].start + 'px';
		bluebar.style.height = (events[i].end - events[i].start) + 'px';
		bluebar.style.left = events[i].left + containerPadding + 'px';
		container.appendChild(bluebar);			
	}	
	return events;
}

function layOutDay(events) {
	return render(packEvents(events));
}

if (typeof process != 'undefined') {
	// running under node.js
	module.exports = packEvents;
}

return layOutDay;
}());
