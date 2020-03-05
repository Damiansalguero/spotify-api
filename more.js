(function() {
    var submit = $(".submit");
    // var input = $("input");
    var results = $(".results");
    var nextUrl;

    if (nextUrl == undefined) {
        $(".more").css({
            display: "none"
        });
    }

    submit.on("click", function() {
        var userInput = $("input").val();
        var dropdown = $("select").val();

        $.ajax({
            url: "https://elegant-croissant.glitch.me/spotify",
            data: {
                q: userInput,
                type: dropdown,
                market: "DE"
            },
            success: processing
        });
    });

    var processing = function(payload) {
        payload = payload.artists || payload.albums;
        nextUrl =
            payload.next &&
            payload.next.replace(
                "https://api.spotify.com/v1/search",
                "https://elegant-croissant.glitch.me/spotify"
            );

        var htmlContainer = "";
        var picture;
        console.log(payload);
        for (var i = 0; i < payload.items.length; i++) {
            try {
                picture = payload.items[i].images[0].url;
            } catch (e) {
                picture = "missing.png";
            } finally {
                htmlContainer +=
                    '<div class="result-container">' +
                    '<div class="images"><img src=' +
                    picture +
                    "></div>" +
                    '<div class="artists"><a href="' +
                    payload.items[i].external_urls.spotify +
                    '">' +
                    payload.items[i].name +
                    "</a></div></div>";
            }
        }
        results.html(htmlContainer);

        if (nextUrl) {
            $(".more").css({
                display: "flex"
            });
        }
    };

    $(".more").on("click", function() {
        $.get(nextUrl, processing);
    });
    // input.on("keydown", function(e) {
    //     if (e.KeyCode == 13) {
    //         spotifysearch();
    //     }
    //});
})();
