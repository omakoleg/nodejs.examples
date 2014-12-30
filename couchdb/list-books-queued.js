'use strict';
const
  file = require('file'),
  async = require('async'),
  rdfParser = require('./lib/rdf-parser.js'),
  work = async.queue(function(path, done){
    rdfParser(path, function(err, doc){
      // ignore err
      console.log(doc);
      done();
    })
  }, 1000);

console.log("Starting");

file.walk(__dirname + '/cache/epub', function(err, dirPath, dirs, files){
  files.forEach(function(path){
    work.push(path);
  });
});
