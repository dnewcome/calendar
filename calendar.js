var layOutDay = (function() {
'use strict';

// todo: pass in as params
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

function packEvents(events) {
	var i,
		j,
		el,
		found,
		cols = [],
		highwater = 0,
		maxcol = 0;

	for(i = 0; i < events.length; i++) {
		found = false;

		// iterate over columns looking for a place to put the event
		for (j = 0; j < cols.length; j++) {
			if (events[i].start >= cols[j][cols[j].length-1].end) {
				cols[j].push(events[i]);
				events[i].col = j;
				found = true;

				// this is when we 'clear' totally and start a new context
				if (events[i].start >= highwater) {
					eventWidths.push(maxcol);
					maxcol = 0;
					events[i].clear = true;
				}
				highwater = Math.max(highwater, events[i].end);
				break;
			}
		}
		// case where we add another col
		if (!found) {
			cols.push([events[i]]);
			events[i].col = j;
		}
		highwater = Math.max(highwater, events[i].end);
		maxcol = Math.max(maxcol, j);
	}
	eventWidths.push(maxcol);
	return cols;
}

function render(events) {
	var container = document.getElementById('container'),
		itemWidth = eventWidths.shift(),
		el,
		bluebar;

	for (var i = 0; i < events.length; i++) {
		if (events[i].clear) {
			itemWidth = eventWidths.shift();
		}
		el = document.createElement('div');
		el.className = 'event';
		el.style.top = events[i].start + 'px';

		bluebar = document.createElement('div');
		bluebar.className = 'bluebar';
		bluebar.style.top = events[i].start + 'px';
		bluebar.style.height = (events[i].end - events[i].start) + 'px';


		el.innerHTML = 
			'<div style="margin:5px"><h2 class="title blue sans">Sample Item</h2>' +
			'<h3 class="location sans">Sample Location</h3></div>';

		el.style.width = renderWidth/(itemWidth+1) + 'px';
		el.style.left = (renderWidth/(itemWidth+1))*events[i].col + containerPadding + 'px';
		bluebar.style.left = (renderWidth/(itemWidth+1))*events[i].col + containerPadding + 'px';

		events[i].width = renderWidth/(itemWidth+1);
		events[i].left = (renderWidth/(itemWidth+1))*events[i].col;

		el.style.height = (events[i].end - events[i].start) + 'px';
		container.appendChild(el);			
		container.appendChild(bluebar);			
	}	
	return events;
}

function layOutDay(events) {
	document.getElementById('container').innerHTML = '';
	events.sort(startTimeCompare);
	packEvents(events);
	return render(events);
}

if(typeof process != 'undefined') {
	// running under node.js
	module.exports = layOutDay;
}
return layOutDay;
}());
