const solr = require(process.cwd() + '/app/utils/solr')
const twitter = require(process.cwd() + '/app/utils/twitter');


exports.deleteData = function (req, res, next) {
    let id = req.body.id;

    solr.delete("id", id, function (err, result) {
        if (err) {
            console.log(err);
            res.send(500, err);
        }
        console.log('Response:', result.responseHeader);
        res.send({ ok: "true", message: "Documents succesfully deleted" });
        next();
    });
}

exports.updateFav = function (req, res, next) {
    let id = req.body.id;
    let fav = req.body.fav;

    let data = {
        id: id,
        favorite_count: { "set": parseInt(fav) + 1 }
    }

    solr.update(data, function (err, result) {
        if (err) {
            console.log(err);
            res.send(500, err);
        }
        res.send({ ok: "true", message: result })
    })
}

exports.addTweet = function (req, res, next) {
    let screen_name = req.body.screen_name;
    let sources = ["BBCNewsAsia", "STcom", "ChannelNewsAsia"];

    if (sources.includes(screen_name)) {
        twitter.fetch(screen_name).then(function (tweets) {
            for (let i = 0; i < tweets.length; i++) {
                solr.update(tweets[i], function (err, result) {
                    if (err) {
                        console.log(err);
                        res.send(500, err);
                    }
                });
            }

            res.send(tweets);
        });
    } else {
        let tweets_cc = [];
        let i = 0;
        sources.forEach(function (source) {
            twitter.fetch(source).then(function (tweets) {
                for (let i = 0; i < tweets.length; i++) {
                    solr.update(tweets[i], function (err, result) {
                        if (err) {
                            console.log(err);
                            res.send(500, err);
                        }
                    });
                }
                tweets_cc = tweets_cc.concat(tweets);
                i++;

                // return data after fetching from the last source
                if (i == (sources.length)) {
                    res.send(tweets_cc);
                }
            });
        });
    }
}