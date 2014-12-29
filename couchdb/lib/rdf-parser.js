"use strict";

const
	fs = require('fs'),
	cheerio = require('cheerio');

module.exports = function(filename, cb){
	fs.readFile(filename, function(err, data){
		if(err) { return cb(err); };
		let 
			$ = cheerio.load(data.toString()),
			collect = function(idx, elem){
				return $(elem).text();
			};
		cb(null,{
			_id: $('pgterms\\:ebook').attr('rdf:about').replace('ebooks/', ''),
			title: $('dcterms\\:title').text(),
			authors: $('pgterms\\:agent pgterms\\:name').map(collect).get(),
			subjects: $('[rdf\\:resource$="/LCSH"] - rdf\\:value').map(collect).get()
		});
	});
}
