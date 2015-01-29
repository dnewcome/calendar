/**
 * Calendar layout implementation
 *
 * module exports layOutDay function used
 *  to render a set of events to the calendar
 */

var layOutDay = (function() {
'use strict';

var renderWidth = 600,
	containerPadding = 10,
	debug = false;

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
 * Pack conflicting events into as few columns as reasonably possible 
 * using a "leftmost free slot" heuristic. Events that 
 * fully clear the current set of conflicts reset the 
 * width calculation. 
 */
function packEvents(events) {
	var i,
		j,
		k,
		el,
		evt,
		found,
		cols = [],
		region = [],
		maxcol = 0;

	events.sort(startTimeCompare);

	for (i = 0; i < events.length; i++) {
		found = false;
		evt = events[i];

		// iterate over columns looking for a place to put the event
		for (j = 0; j < cols.length; j++) {
			if (evt.start >= cols[j]) {
				// 'clear' and start a new context
				if (evt.start >= Math.max.apply(null, cols)) {
					for (k = 0; k < region.length; k++) {
						region[k].width = renderWidth/(maxcol+1); 
						region[k].left = (renderWidth/(maxcol+1))*region[k].col + containerPadding;
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
	log(region);
	for (k = 0; k < region.length; k++) {
		region[k].width = renderWidth/(maxcol+1); 
		region[k].left = (renderWidth/(maxcol+1))*region[k].col + containerPadding;
	}
	return events;
}

/**
 * render packed events to the DOM.
 */
function render(events) {
	var container = document.getElementById('container'),
		evt,
		evtDom,
		bluebar;

	container.innerHTML = '';

	for (var i = 0; i < events.length; i++) {
		evt = events[i];
		evtDom = document.createElement('section');
		evtDom.className = 'event';
		evtDom.style.top = evt.start + 'px';
		evtDom.style.height = (evt.end - evt.start) + 'px';
		evtDom.style.width = evt.width + 'px';
		evtDom.style.left = evt.left + 'px';
		evtDom.innerHTML = 
			'<h2>Sample Item</h2>' +
			'<h3>Sample Location</h3>';
		container.appendChild(evtDom);			

		bluebar = document.createElement('div');
		bluebar.className = 'bluebar';
		bluebar.style.top = evt.start + 'px';
		bluebar.style.height = (evt.end - evt.start) + 'px';
		bluebar.style.left = evt.left + 'px';
		container.appendChild(bluebar);			
	}	
	return events;
}

function layOutDay(events) {
	render(packEvents(events));
}

if (typeof process != 'undefined') {
	// running under node.js
	module.exports = packEvents;
}

return layOutDay;
}());
