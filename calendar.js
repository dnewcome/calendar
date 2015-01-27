var renderWidth = 600;
var renderHeight = 720;
var containerPadding = 10;
var eventWidths = [];

function startTimeCompare(a, b) {
	return a.start - b.start;
};

function lengthCompare(a, b) {
	return (a.end-a.start) - (b.end-b.start);
};

function overlaps(a, b) {
	return b.start >= a.start && b.start < a.end ||
		b.end > a.start && b.end < a.end;
};

function depth(events) {
	var mark;
	for (i = 0; i < events.length; i++) {
		events[i].depth = events[i].col;
		mark = events[i];
		for (j = 0; j < events.length; j++) {
			if(mark.col < events[j].col && events[j].start >= mark.start && overlaps(mark, events[j])) {
			//if(mark.col < events[j].col && overlaps(mark, events[j])) {
				events[i].depth++;	
				mark = events[j];
			}		
		}		
	}
}

function layOutDay(events) {
	packEventsHoriz(events);
}

function packEventsHoriz(events) {
	var i, j, el, cols = [], found, highwater = 0, maxcol = 0;

	for(i = 0; i < events.length; i++) {
		found = false;

		// iterate over columns looking for a place to put the event
		for(j=0; j<cols.length; j++) {
			// if (cols[j].length === 0 || events[i].start >= cols[j][cols[j].length-1].end) {
			if (events[i].start >= cols[j][cols[j].length-1].end) {
				cols[j].push(events[i]);
				events[i].col = j;
				found = true;

				// this is when we 'clear' totally and start a new context
				if(events[i].start >= highwater) {
					console.log(events[i].index);
					eventWidths.push(maxcol);
					console.log(eventWidths);
					maxcol = 0;
					events[i].clear = true;
				}
				highwater = Math.max(highwater, events[i].end)
				//console.log(highwater);
				break;
			}
		}
		// case where we add another col
		if(!found) {
			cols.push([events[i]]);
			events[i].col = j;
		}
		highwater = Math.max(highwater, events[i].end)
		maxcol = Math.max(maxcol, j)
		// console.log(maxcol);
	}
	eventWidths.push(maxcol);
	return cols;
}

function render(events, useDepth) {
	var container = document.getElementById('container');
	var itemWidth = eventWidths.shift();
	for(var i=0; i<events.length; i++) {
		if(events[i].clear) {
			itemWidth = eventWidths.shift();
		}
		el = document.createElement('div');

		bluebar = document.createElement('div');
		bluebar.className = 'bluebar';
		bluebar.style.top = events[i].start + 'px';
		bluebar.style.height = (events[i].end - events[i].start) + 'px';

		el.className = 'event';
		el.style.top = events[i].start + 'px';

		el.innerHTML = '<h2 class="title blue sans">Sample Item ' + events[i].index + '</h2>' +
			'<h3 class="location sans">Sample Location</h3>';

		if(useDepth) {
			el.style.width = renderWidth/(itemWidth+1) + 'px';
			el.style.left = (renderWidth/(itemWidth+1))*events[i].col + containerPadding + 'px';
			bluebar.style.left = (renderWidth/(itemWidth+1))*events[i].col + containerPadding + 'px';

			events[i].width = renderWidth/(itemWidth+1);
			events[i].left = (renderWidth/(itemWidth+1))*events[i].col;
		}

		else {
			el.style.width = '50px';
			el.style.left = events[i].col * 50 + 'px';
			bluebar.style.left = events[i].col * 50 + 'px';
		}
		el.style.height = (events[i].end - events[i].start) + 'px';
		container.appendChild(el);			
		container.appendChild(bluebar);			
	}	
	return events;
}

//var events = [ {start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670} ];

// this is the nominal given case 
function testCase0() {
	return [ 
		{start: 30, end: 150},
		{start: 540, end: 600},
		{start: 560, end: 620},
		{start: 610, end: 670}
	];
}

// failing case -- we need to find the max depth
// might have to do tree traversal to do this
function testCase1() {
	return [ 
		{start: 30, end: 150, index: 0},
		{start: 540, end: 600, index: 1},
		{start: 560, end: 620, index: 2},
		{start: 610, end: 670, index: 3},
		{start: 630, end: 670, index: 4},
		{start: 630, end: 670, index: 5},
		{start: 630, end: 670, index: 6},
		{start: 630, end: 670, index: 7},
		{start: 670, end: 685, index: 8}
	];
}

function testCase2() {
	return [ 
		{start: 540, end: 600, index: 0},
		{start: 560, end: 620, index: 1},
		{start: 610, end: 670, index: 2},
		{start: 630, end: 670, index: 3},
		{start: 630, end: 670, index: 4}
	];
}

function testCase3() {
	return [ 
		{start: 540, end: 600, index: 0},
		{start: 560, end: 620, index: 1},
		{start: 610, end: 670, index: 2},
		{start: 680, end: 690, index: 3},
		{start: 680, end: 690, index: 4},
		{start: 681, end: 690, index: 5}
	];
}

function testCase4() {
	return [ 
		{start: 540, end: 600, index: 0},
		{start: 560, end: 620, index: 1},
		{start: 560, end: 640, index: 5},
		{start: 610, end: 670, index: 2},
		{start: 630, end: 670, index: 3},
		{start: 650, end: 670, index: 4},
		{start: 650, end: 870, index: 6}
	];
}
function testCaseNominal() {
	return [ {start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670} ];	
}

function generateRandom() {
	var events = [];
	for(var i = 0; i<50; i++) {
		var start, end;	
		start = Math.round(Math.random()*renderHeight);
		end = Math.round(Math.random()*renderHeight);
		while(!(start < end)) {
			start = Math.round(Math.random()*renderHeight);
			end = Math.round(Math.random()*renderHeight);
		}
		events.push({start: start, end: end, index: i});	
	}
	return events;
}

function generateFixedLength() {
	var events = [];
	for(var i = 0; i<20; i++) {
		var start, end;	
		// start = Math.round(Math.random()*renderHeight);
		start = window.crypto.getRandomValues(new Uint32Array(1))[0]/10000000;
		end = start + 20;
		events.push({start: start, end: end, index: i});	
	}
	return events;
}

// var events = generateFixedLength();
// var events = generateRandom();
var events = testCaseNominal();

// events.sort(lengthCompare).reverse();
events.sort(startTimeCompare);
function doCalendar(events) {
	layOutDay(events);
	depth(events);
	return render(events,true);
	//render(events);
}

if(typeof process != 'undefined') {
	// running under node.js
	module.exports = doCalendar;
}
