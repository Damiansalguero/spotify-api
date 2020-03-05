(function() {
    var nextUrl;
    var results = $("#results");
    var html = "";
    var interval;

    if (nextUrl == undefined) {
        $(".more").css({
            display: "none"
        });
    }

    $(".submit-button").on("click", function() {
        results.html("");
        html = "";
        //Checks the input put by user
        var userInput = $("input").val();
        var dropdown = $(".artist-or-album").val();

        //We have to pass 3 pieces of information
        //(1) url -- just defines what website we're making a request todo
        //(2) user input -- the text the user put n the input field
        //(3) dropdown input -- the uesr's choice from the dropdown menu, did user select artist or album?
        $.ajax({
            url: "https://elegant-croissant.glitch.me/spotify",
            data: {
                //represents what input we got from the user
                //query = q
                query: userInput,
                type: dropdown
                //default method is GET, which is why it does not need to be put here
            },
            //success is a function that runs once we've heard a response from the API
            //Variable in the function can be called anything
            success: loading
        });
    });

    var loading = function(data) {
        var userInput = $("input").val();
        $(".results-for").html("Results for: " + userInput);
        html = "";
        data = data.artists || data.albums;
        console.log(data);
        nextUrl =
            data.next &&
            data.next.replace(
                "https://api.spotify.com/v1/search",
                "https://elegant-croissant.glitch.me/spotify"
            );

        var picture;
        for (var i = 0; i < data.items.length; i++) {
            try {
                picture = data.items[i].images[0].url;
            } catch (e) {
                picture = "img/missing.png";
            } finally {
                html +=
                    '<div class="result-item">' +
                    '<img class="display-img" src = "' +
                    picture +
                    '">' +
                    '<a class="tag" target="_blank" href ="' +
                    data.items[i].external_urls.spotify +
                    '">' +
                    data.items[i].name +
                    "</a></div>";
            }
        }
        if (nextUrl == undefined) {
            results.html(html);
        } else {
            results.append(html);
        }

        if (nextUrl) {
            $(".more").css({
                display: "flex"
            });
        }

        $(".more").on("click", function() {
            // console.log("url", nextUrl);
            $.get(nextUrl, loading);
        });

        //INFINITE SCROLL
        //Setup for triggerScroll function
        function checkScroll() {
            //Checks the URL
            var qs = location.search.slice(1);
            qs = qs.split("&");
            var parsedQs = {};
            for (var i = 0; i < qs.length; i++) {
                var item = qs[i].split("=");
                parsedQs[item[0]] = item[1];
            }
            //Checks for the keyword "infinite" in URL
            if (item.indexOf("infinite")) {
                $(".more").hide();
                interval = setInterval(triggerScroll, 500);
            } else {
                return;
            }
        }
        checkScroll();

        function triggerScroll() {
            if (
                $(window).height() + $(document).scrollTop() >=
                $(document).height() - 300
            ) {
                clearInterval(interval);
                $(".more").trigger("click");
            }
        }
    };
})();
