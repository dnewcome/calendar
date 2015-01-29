/**
 * Test datasets and random data generators
 */

/* global calendarDay */
'use strict';

// this is the nominal given case 
function testCaseNominal() {
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

function generateRandom(n, length) {
    var i,
        start,
        end,
        events = [],
        renderHeight = 720;

    for (i = 0; i < n; i++) {
        start = Math.round(Math.random()*renderHeight);
        if (length) {
            end = start + length;
        }
        else {
            end = Math.round(Math.random()*renderHeight);
        }
        while (start > end) {
            end = Math.round(Math.random()*renderHeight);
        }
        events.push({start: start, end: end, index: i});    
    }
    return events;
}

/* run fuzz test, generate random events */
function layOutRandom() {
    calendarDay.layOutDay(generateRandom(50));
}
function layOutRandomFixedLength() {
    calendarDay.layOutDay(generateRandom(50, 20));
}
