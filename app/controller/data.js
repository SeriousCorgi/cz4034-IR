const solr = require(process.cwd() + '/app/utils/solr')
// const tweets = require(process.cwd() + '/data/ChannelNewsAsia_data.json')


// Add documents
// exports.addData = function (req, res, next) {
//     tweets.forEach((tweet) => {
//         solr.update(tweet, function (err, result) {
//             if (err) {
//                 console.log(err);
//                 return;
//             }
//             console.log('Response:', result.responseHeader);
//             res.send({ ok: "true", message: "Add tweet id " + tweet.id });
//             next();
//         });
//     });
// }

// Delete documents
exports.deleteData = function (req, res, next) {
    let id = req.params.id;

    solr.delete("id", id, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Response:', result.responseHeader);
        res.send({ ok: "true", message: "Documents succesfully deleted" });
        next();
    });
}