let Promise = require('promise');
let Twitter = require('twitter');
const config = require(process.cwd() + '/config');

let client = new Twitter({
    consumer_key: config.TWITTER_CONSUMER_KEY,
    consumer_secret: config.TWITTER_CONSUMER_SECRET,
    access_token_key: config.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: config.TWITTER_ACCESS_TOKEN_SECRET
});

const NUM_TWEET = 10;

let fetch = function (screen_name) {
    return new Promise(function (resolve, reject) {
        let data = [];
        let params = {
            screen_name: screen_name,
            trim_user: false,
            count: NUM_TWEET
        }
        client.get('statuses/user_timeline', params, function (err, tweets, response) {
            if (err) {
                reject(err);
                return;
            }

            for (let i = 0; i < tweets.length; i++) {
                let tweet = {
                    id: tweets[i].id,
                    text: tweets[i].text,
                    author: tweets[i].user.name,
                    created_at: new Date(Date.parse(tweets[i].created_at.replace(/( \+)/, ' UTC$1'))),
                    retweet_count: tweets[i].retweet_count,
                    favorite_count: tweets[i].favorite_count
                };

                data.push(tweet);
            }
            resolve(data);
        });

    });
}

exports.fetch = fetch;