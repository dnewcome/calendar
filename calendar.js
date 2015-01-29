/**
 * Calendar layout implementation
 *
 * @exports CalendarDay - constructor 
 */

var CalendarDay = (function() {
'use strict';

/**
 * Create calendar layout functionality on DOM node
 *
 * @constructor
 * @param container - id or DOM node
 * @param debug - true for debug log messages
 */
function CalendarDay(container, debug) {
    this.container = checkContainer(container);

    // set container class here for less fidgety markup
    // from the compoenent consumer's POV
    // jsdom doesn't implement classList
    // TODO: use phantomjs for tests and remove this
    if(this.container.classList) {
        this.container.classList.add('calendarday');
    }
    else {
        this.container.className += ' calendarday';
    }

    this.renderWidth = this.container.offsetWidth;
    this.debug = debug;
}

/**
 * Get DOM node for container id if we don't 
 * alredy have the DOM node for API convenence
 * 
 * @param container - DOM node or ID string 
 */
function checkContainer(container) {
    if (!container.nodeName) {
        container = document.getElementById(container);
    }
    return container;
}

/**
 * Comparator for sorting by start time
 * 
 * @param a, b - events as {start, end} 
 */
function startTimeCompare(a, b) {
    return a.start - b.start;
}

/**
 * Logging utility
 *
 * @param msg - log/trace message
 */
function log(msg) {
    if(typeof debug !== 'undefined' && debug === true) {
        console.log(msg);
    }
}

/**
 * Pack conflicting events into as few columns as reasonably possible
 * using a "leftmost free slot" heuristic. Events that fully clear
 * the current set of conflicts reset the width calculation. 
 *
 * @param events - array of events as {start, end}
 */
CalendarDay.prototype.packEvents = function (events) {
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

        // iterate over columns looking for a slot to put the event
        for (j = 0; j < cols.length; j++) {
            if (evt.start >= cols[j]) {
                cols[j] = evt.end;
                evt.col = j;
                region.push(evt);
                found = true;
                break;
            }
        }

        // add additional column if no existing slot 
        if (!found) {
            cols.push([evt.end]);
            region.push(evt);
            events[i].col = j;
        }
        maxcol = Math.max(maxcol, j);

        // look ahead and start a new context if event clears all prev events 
        if (events[i+1] === undefined ||
            events[i+1].start >= Math.max.apply(null, cols)
        ) {
            for (k = 0; k < region.length; k++) {
                region[k].width = this.renderWidth / (maxcol+1); 
                region[k].left = this.renderWidth / (maxcol+1) * region[k].col;
            }
            log(region);
            maxcol = 0;
            region = [];
        }
    }
    return events;
};

/**
 * Render packed events to the DOM.
 *
 * @param events - array of processed events incl. {left, width}
 */
CalendarDay.prototype.render = function(events) {
    var evt,
        evtDom,
        bluebar;

    if(!events) return;
    this.clearEvents();

    for (var i = 0; i < events.length; i++) {
        evt = events[i];
        evtDom = document.createElement('section');
        evtDom.style.cssText = [
            'position:', 'absolute;',
            'top:', evt.start, 'px;',
            'height:', evt.end - evt.start, 'px;',
            'width:', evt.width, 'px;',
            'left:', evt.left, 'px;'
        ].join('');
        evtDom.innerHTML = 
            '<div class="bluebar"></div>' +
            '<div class="event"><h2>Sample Item</h2>' +
            '<h3>Sample Location</h3></div>';
        this.container.appendChild(evtDom);         
    }   
    return events;
};

/**
 * Clear UI container of all rendered events
 */
CalendarDay.prototype.clearEvents = function() {
    this.container.innerHTML = '';
};

/**
 * Toplevel driver function to lay out and render events
 *
 * @param events - array of events as {start, end}
 */
CalendarDay.prototype.layOutDay = function (events) {
    this.render(this.packEvents(events));
};

/**
 * Make isomorphic - we run this under nodejs
 * for the tests, and maybe later for server-side
 * rendering of the event layout
 */
if (typeof process != 'undefined') {
    // running under node.js
    module.exports = CalendarDay;
}

return CalendarDay;
}());
