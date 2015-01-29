var assert = require('chai').assert;
var CalendarDay = require('./calendar');
var jsdom = require("jsdom");

describe('calendar browser test suite', function() {
    it('should render nominal case', function(done) {
        this.timeout = 5000;
        var events = [{
            start: 30,
            end: 150
        }, {
            start: 540,
            end: 600
        }, {
            start: 560,
            end: 620
        }, {
            start: 610,
            end: 670
        }],
        expected = [{
            start: 30,
            end: 150,
            col: 0,
            width: 600,
            left: 0
        }, {
            start: 540,
            end: 600,
            col: 0,
            clear: true,
            width: 300,
            left: 0
        }, {
            start: 560,
            end: 620,
            col: 1,
            width: 300,
            left: 300
        }, {
            start: 610,
            end: 670,
            col: 0,
            width: 300,
            left: 0
        }];

        jsdom.env({
            file: 'index.html',
            scripts: ["calendar.js", "index.js"],
            src: ['new CalendarDay("container").layOutDay(testCaseNominal());'],
            done: function (errors, window) {
                var document = window.document;
                var renderedEvents = document.querySelectorAll('#container section');
                assert.equal(renderedEvents[0].style.top, '30px');
                assert.equal(renderedEvents[1].style.top, '540px');
                assert.equal(renderedEvents[2].style.top, '560px');
                assert.equal(renderedEvents[3].style.top, '610px');
                done();
            }}
        );
    }); 
}); 

describe('calendar unit test suite', function() {
    it('should pack nominal case', function() {
        this.timeout = 5000;
        var events = [{
            start: 30,
            end: 150
        }, {
            start: 540,
            end: 600
        }, {
            start: 560,
            end: 620
        }, {
            start: 610,
            end: 670
        }],
        expected = [{
            start: 30,
            end: 150,
            col: 0,
            width: 600,
            left: 0
        }, {
            start: 540,
            end: 600,
            col: 0,
            width: 300,
            left: 0
        }, {
            start: 560,
            end: 620,
            col: 1,
            width: 300,
            left: 300
        }, {
            start: 610,
            end: 670,
            col: 0,
            width: 300,
            left: 0
        }],

        dummyDom = {nodeName: 'div', offsetWidth: 600, classList:{add:function(){}}},
        calendarDay = new CalendarDay(dummyDom),
        actual = calendarDay.packEvents(events);

        assert.deepEqual(actual, expected);
    }); 
}); 
