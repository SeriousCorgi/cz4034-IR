const solr_client = require(process.cwd() + '/app/utils/solr')
const tweets = require(process.cwd() + '/data/ChannelNewsAsia_data.json')


// Add documents
exports.addData = function (req, res) {
    solr_client.update(doc, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Response:', result.responseHeader);
        res.send({ ok: "true", message: "Documents succesfully indexed" });
    });
}

// Delete documents
exports.deleteData = function (req, res) {
    solr_client.delete("id:12345", function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Response:', result.responseHeader);
        res.send({ ok: "true", message: "Documents succesfully deleted" });
    });
}