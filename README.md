# CZ4034 - Information Retrieval
> Course Assignment

An information retrieval system for sentiment analysis using [NodeJS](https://nodejs.org/en/ "Download") and [Apache Solr](https://www.apache.org/dyn/closer.lua/lucene/solr/8.5.1/solr-8.5.1.zip "Download"):
* Index tweets from multiple source.
* A search engine that can query over the indexed tweets.

There're around 10275 tweets already indexed in Solr, which can be searchable right after installation.

## Installation
After cloning the repo, run:
```
cd cz4034-IR
npm install
```

## Run Application
Start Solr server:
* MacOS:
```
solr-8.4.1/bin/solr start
```
>_To stop the Solr server, run `solr-8.4.1/bin/solr stop`_

* Window: `solr-8.4.1\bin\solr.cmd start`


Start Node server:
```
npm start
```

Visit the web interface at: `http://localhost:3000`

## Team Members
* Hung Pham
* Anthony
* Aqil
* Joon Woon
* Li Yan
