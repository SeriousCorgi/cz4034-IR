$(document).ready(function () {
    console.log("loaded search.js");
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let scroll = false;

    $("#tweets-list").hide();

    $("#search-btn").click(function () {
        $("#tweets-list").empty();

        $author = $("#select-author").val();
        $query = $("#query-box").val();

        $start = 0;
        $page_size = 10;

        $.getJSON("/search", { q: $query, author: $author, start: $start, row: $page_size }, function (data, status) {
            if (status == "success") {
                console.log(status);
                scroll = true;
            }

            let result = JSON.parse(JSON.stringify(data.response));
            $num_found = result.numFound;
            console.log(result);

            let docs = result.docs;
            // docs.sort(function (a, b) {
            //     return b.favorite_count[0] - a.favorite_count[0] || b.retweet_count[0] - a.retweet_count[0];
            // });
            for (i = 0; i < docs.length; i++) {
                let regexp = /(.+?)\s(https:\/\/.+$)/g;

                let tweet_author = docs[i].author;
                let id = docs[i].id;
                let match = regexp.exec(docs[i].text[0]);
                let tweet = match[1];
                let url = match[2];
                console.log(url);
                let fav = docs[i].favorite_count;
                let retweet = docs[i].retweet_count;
                let date = new Date(docs[i].created_at);
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

            if ($("#tweets-list").is(':empty')) {
                $("#tweets-list").append(
                    "<div class='empty'>" +
                    "<div class='col-md-12'><h3> Oops </h3>" +
                    "<p>We can't seem to find the keyword you are looking for.</p>" +
                    "</div></div>"
                );
                scroll = false;
            }
            $("#tweets-list").show();

            $start += $page_size;
            $.getScript("js/extension/fav_count.js");
        });
    })

    $("#fetch-btn").click(function () { scroll = false; });

    // Load more tweets on scroll down.
    $(window).scroll(function () {
        if (scroll == true && $start < $num_found) {
            if (($(window).height() + $(window).scrollTop() == $(document).height())) {
                console.log($start);
                $.getJSON("/search", { q: $query, author: $author, start: $start, row: $page_size }, function (data, status) {
                    if (status == "success") {
                        console.log(status);
                        scroll = true;
                    }

                    let result = JSON.parse(JSON.stringify(data.response));
                    let num_found = result.numFound;
                    console.log(result);

                    let docs = result.docs;
                    for (i = 0; i < docs.length; i++) {
                        let regexp = /(.+?)\s(https:\/\/.+$)/g;

                        let tweet_author = docs[i].author;
                        let id = docs[i].id;
                        let match = regexp.exec(docs[i].text[0]);
                        let tweet = match[1];
                        let url = match[2];
                        console.log(url);
                        let fav = docs[i].favorite_count;
                        let retweet = docs[i].retweet_count;
                        let date = new Date(docs[i].created_at);
                        let date_format = months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();

                        $new_div = $("<div class='tweet col-md-12'>" +
                            "<h3 class='mb-2'>" + tweet + "</a></h3>" +
                            "<p class='meta'><span class='mr-3 date'><i class='fa fa-calendar' aria-hidden='true'></i> " + date_format + "</span>" +
                            "<span class='mr-3 author'>" + tweet_author + "</span>" +
                            "<span class='mr-3 favorite'><i class='fa fa-twitter' aria-hidden='true'></i> " + fav + " favorite</span>" +
                            "<span class='retweet'><i class='fa fa-retweet' aria-hidden='true'></i> " + retweet + " retweet</span></p>" +
                            "<p><a href='" + url + "' id='" + id + "'>Read More ></a>" +
                            "</div> <hr/>");
                        $new_div.appendTo($("#tweets-list")).hide().fadeIn(1500);
                    }
                    $start += $page_size;
                });
            }
        }
    });
})