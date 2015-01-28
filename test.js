var assert = require('chai').assert;
var doCalendar = require('./calendar');

var jsdom = require("jsdom");

describe('test suite', function() {
	it('should work', function(done) {
		this.timeout = 5000;
		var events = [{start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670}];
		var expected = [{"start":30,"end":150,"col":0,"width":600,"left":0},{"start":540,"end":600,"col":0,"clear":true,"width":300,"left":0},{"start":560,"end":620,"col":1,"width":300,"left":300},{"start":610,"end":670,"col":0,"width":300,"left":0}];

		jsdom.env({
			file: "index.html",
			scripts: ["calendar.js"],
			done: function (errors, window) {
				var actual = window.layOutDay(events);
				assert.deepEqual(actual, expected);
				done();
			}}
		);
	}); 
}); 
