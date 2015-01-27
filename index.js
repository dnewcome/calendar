// this is the nominal given case 
function testCase0() {
	return [ 
		{start: 30, end: 150},
		{start: 540, end: 600},
		{start: 560, end: 620},
		{start: 610, end: 670}
	];
}

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


var renderHeight = 720;

function generateRandom() {
	var events = [];
	for(var i = 0; i<50; i++) {
		var start, end;	
		start = Math.round(Math.random()*renderHeight);
		end = Math.round(Math.random()*renderHeight);
		while(start > end) {
			start = Math.round(Math.random()*renderHeight);
			end = Math.round(Math.random()*renderHeight);
		}
		events.push({start: start, end: end, index: i});	
	}
	return events;
}

function generateFixedLength(useCryptoRnd) {
	var events = [];
	for(var i = 0; i<20; i++) {
		var start, end;	
		if(useCryptoRnd) {
			start = window.crypto.getRandomValues(new Uint32Array(1))[0]/10000000;
		}
		else {
			start = Math.round(Math.random()*renderHeight);
		}
		end = start + 20;
		events.push({start: start, end: end, index: i});	
	}
	return events;
}

