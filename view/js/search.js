$(document).ready(function () {
    console.log("loaded search.js");
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    $("#tweets-list").hide();

    $("#search-btn").click(function () {
        $("#tweets-list").empty();

        $author = $("#select-author").val();
        $query = $("#query-box").val();

        let page_size = 10;

        $.get("/search", { q: $query, author: $author, row: page_size }, function (data, status) {
            if (status == "success") {
                console.log(status);
            }
            let result = data.response;
            console.log(result);
            for (i = 0; i < result.docs.length; i++) {
                let tweet_author = result.docs[i].author;
                let tweet = result.docs[i].text;
                let fav = result.docs[i].favorite_count;
                let retweet = result.docs[i].retweet_count;
                let date = new Date(result.docs[i].created_at);
                let date_format = months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();

                let new_div = "<div class='row'>" +
                    "<div class='col-md-7'>" + "<h3>@" + tweet_author + "</h3>" + "<h4>" + date_format + "</h4>" +
                    "<p id='p1'>" + tweet + "</p>" +
                    "<p id='p2'> Favorite: " + fav + " - Retweet: " + retweet + "</p>" +
                    "</div></div> <hr/>";
                $("#tweets-list").append(new_div);
            }

            if ($("#tweets-list").is(':empty')) {
                $("#tweets-list").append(
                    "<div class='empty'>" +
                    "<div class='col-md-7'><h3> Oops </h3>" +
                    "<p>We can't seem to find the keyword you are looking for.</p>" +
                    "</div></div>"
                );
            }
            $("#tweets-list").show();
        });
    })
})