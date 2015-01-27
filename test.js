var assert = require('chai').assert;

describe('test suite', function() {
	it('should work', function() {
		console.log('works');	
		var expected = [{"start":30,"end":150,"col":0,"depth":0,"width":600,"left":0},{"start":540,"end":600,"col":0,"clear":true,"depth":1,"width":300,"left":0},{"start":560,"end":620,"col":1,"depth":1,"width":300,"left":300},{"start":610,"end":670,"col":0,"depth":0,"width":300,"left":0}]
		assert.equal(1, 2);
	}); 
}); 
