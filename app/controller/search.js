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
    let author = req.query.author || "*";;
    let text = req.query.q || "*";
    let page_size = req.query.row || "10";;

    let queryStr = solr.query().q({
        author: author.replace(/%20/g, '+'),
        text: text.replace(/%20/g, '+')
    }).start(0).rows(page_size);

    solr.search(queryStr, function (err, result) {
        if (err) {
            res.send(err);
            console.log(err);
        }
        res.json(result);
    })
}