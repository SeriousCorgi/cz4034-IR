$(document).ready(function () {
    console.log("loaded data.js");
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    $("#fetch-btn").click(function () {
        $("#tweets-list").empty();

        $screen_name = $("#select-author").find(':selected').attr("twitter");
        console.log($screen_name);

        $.ajax({
            url: '/add',
            type: 'post',
            data: { screen_name: $screen_name },
            headers: {},
            dataType: 'json',
            success: function (data) {
                let tweets = JSON.parse(JSON.stringify(data));
                console.log(tweets);

                for (i = 0; i < tweets.length; i++) {
                    let regexp = /(.+?)\s(https:\/\/.+$)/g;

                    let tweet_author = tweets[i].author;
                    let id = tweets[i].id;
                    let tweet = tweets[i].text;
                    let url = "#"
                    let match = regexp.exec(tweet);
                    if (match) {
                        tweet = match[1];
                        url = match[2];
                    }
                    console.log(url);
                    let fav = tweets[i].favorite_count;
                    let retweet = tweets[i].retweet_count;
                    let date = new Date(tweets[i].created_at);
                    let date_format = months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();

                    let new_div = "<div class='tweet col-md-12' id='" + id + "'>" +
                        "<h3 class='mb-2'>" + tweet + "</a></h3>" +
                        "<p class='meta'><span class='mr-3 date'><i class='fa fa-calendar' aria-hidden='true'></i> " + date_format + "</span>" +
                        "<span class='mr-3 author'>" + tweet_author + "</span>" +
                        "<span class='mr-3 favorite' fav='" + fav + "'><i class='fa fa-twitter' aria-hidden='true'></i> " + fav + " favorite</span>" +
                        "<span class='retweet'><i class='fa fa-retweet' aria-hidden='true'></i> " + retweet + " retweet</span></p>" +
                        "<p><a href='" + url + "'>Read More ></a></p>" +
                        "</div> <hr/>";
                    $("#tweets-list").append(new_div);
                }
                $("#tweets-list").show();
                $.getScript("js/extension/fav_count.js");
            }
        });
    })
})