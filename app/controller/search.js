const solr = require(process.cwd() + '/app/utils/solr')


exports.getAll = function (req, res, next) {
    let row = req.params.row;
    let queryStr = solr.query().q('*:*').start(0).rows(row);

    solr.search(queryStr, function (err, result) {
        if (err) {
            res.send(err);
            console.log(err);
        }
        res.json(result);
    });
}

exports.search = function (req, res, next) {
    let author = req.query.author || "*";
    let text = req.query.q || "*";
    let page_size = req.query.row || "10";
    let start = req.query.start || "0";
    // sort based on favorite_count then retweet_count in desc order
    let sort = "favorite_count desc, retweet_count desc";

    // let queryStr = solr.query().q({
    //     text: text,
    //     author: author,
    // }).start(start).rows(page_size);

    let queryStr = "q=text:(" + text.replace(/\s/g, " AND ") +
        ") AND author:" + author +
        "&sort=" + sort + "&start=" + start + "&rows=" + page_size;

    console.log(queryStr);

    solr.search(queryStr, function (err, result) {
        if (err) {
            res.send(err);
            console.log(err);
        }
        res.json(result);
    })
}