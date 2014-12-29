'use strict';
const
	rdfParser = require('../lib/rdf-parser.js'),
	expectedValue = require('./pg11111.json');

exports.testRdfParser = function(test){
	rdfParser(__dirname + '/pg11111.rdf', function(err, book){
		test.expect(2);
		test.ifError(err);
		test.deepEqual(book, expectedValue, "should match expected");
		test.done();
	});
};
