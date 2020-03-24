const solr_client = require(process.cwd() + '/app/utils/solr')


exports.search = function (req, res) {
    solr_client.search("q=*:*", function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Response:', result.response);
        res.send(result.response);
    });
}