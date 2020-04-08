let SolrNode = require('solr-node');

// Create a client
let client = new SolrNode({
    host: '127.0.0.1',
    port: '8983',
    core: 'tweets',
    protocol: 'http'
});

module.exports = client;