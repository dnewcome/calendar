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
            src: ['new CalendarDay("container", 600, 10).layOutDay(testCaseNominal());'],
            done: function (errors, window) {
                var document = window.document;
                var renderedEvents = document.querySelectorAll('#container section');
                assert.equal(renderedEvents[0].style.left, '10px');
                assert.equal(renderedEvents[1].style.left, '10px');
                assert.equal(renderedEvents[2].style.left, '310px');
                assert.equal(renderedEvents[3].style.left, '10px');
                assert.equal(renderedEvents[0].style.width, '600px');
                assert.equal(renderedEvents[1].style.width, '300px');
                assert.equal(renderedEvents[2].style.width, '300px');
                assert.equal(renderedEvents[3].style.width, '300px');
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
            left: 10
        }, {
            start: 540,
            end: 600,
            col: 0,
            clear: true,
            width: 300,
            left: 10
        }, {
            start: 560,
            end: 620,
            col: 1,
            width: 300,
            left: 310
        }, {
            start: 610,
            end: 670,
            col: 0,
            width: 300,
            left: 10
        }],

        dummyDom = {nodeName: 'div'},
        calendarDay = new CalendarDay(dummyDom, 600, 10),
        actual = calendarDay.packEvents(events);

        assert.deepEqual(actual, expected);
    }); 
}); 
