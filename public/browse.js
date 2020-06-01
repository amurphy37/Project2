//button functions for on click hide and add class for content areas

$(document).ready(function () {
    $("#moodBtn").click(function () {
        $("#top-five").addClass("hide");
        $("#creators").addClass("hide");
        $("#all").addClass("hide");
        $("#moods").removeClass("hide");
    }),
    
    $("#creatorBtn").click(function () {
        $("#top-five").addClass("hide");
        $("#moods").addClass("hide");
        $("#all").addClass("hide");
        $("#creators").removeClass("hide");
    }),

    $("#trendingBtn").click(function () {
        $("#top-five").removeClass("hide");
        $("#moods").addClass("hide");
        $("#all").addClass("hide");
        $("#creators").addClass("hide");
    }),

    $("#allBtn").click(function () {
        $("#top-five").addClass("hide");
        $("#moods").addClass("hide");
        $("#all").removeClass("hide");
        $("#creators").addClass("hide");

        $.get("/allPlaylists", function (data) {
            console.log(data)
        })
    }),

    $("#coffeeBtn").click(function () {
        $("#partyTime").addClass("hide");
        $("#chillMode").addClass("hide");
        $("#workout").addClass("hide");
        $("#dateNight").addClass("hide");
        $("#rock").addClass("hide");
        $("#hipHop").addClass("hide");
        $("#countryRoad").addClass("hide");
        $("#coffeeHouse").removeClass("hide");

        $.get("/playlists/mood/coffee+house", function (response) {
            console.log(response)
        })
    })

    $("#partyBtn").click(function () {
        $("#partyTime").removeClass("hide");
        $("#chillMode").addClass("hide");
        $("#workout").addClass("hide");
        $("#dateNight").addClass("hide");
        $("#rock").addClass("hide");
        $("#hipHop").addClass("hide");
        $("#countryRoad").addClass("hide");
        $("#coffeeHouse").addClass("hide");

        $.get("/playlists/mood/party+time", function (response) {
            console.log(response)
        })
    })
    $("#chillBtn").click(function () {
        $("#partyTime").addClass("hide");
        $("#chillMode").removeClass("hide");
        $("#workout").addClass("hide");
        $("#dateNight").addClass("hide");
        $("#rock").addClass("hide");
        $("#hipHop").addClass("hide");
        $("#countryRoad").addClass("hide");
        $("#coffeeHouse").addClass("hide");

        $.get("/playlists/mood/chill+mode", function (response) {
            console.log(response)
        })
    })
    $("#workoutBtn").click(function () {
        $("#partyTime").addClass("hide");
        $("#chillMode").addClass("hide");
        $("#workout").removeClass("hide");
        $("#dateNight").addClass("hide");
        $("#rock").addClass("hide");
        $("#hipHop").addClass("hide");
        $("#countryRoad").addClass("hide");
        $("#coffeeHouse").addClass("hide");

        $.get("/playlists/mood/workout", function (response) {
            console.log(response)
        })
    })
    $("#dateBtn").click(function () {
        $("#partyTime").addClass("hide");
        $("#chillMode").addClass("hide");
        $("#workout").addClass("hide");
        $("#dateNight").removeClass("hide");
        $("#rock").addClass("hide");
        $("#hipHop").addClass("hide");
        $("#countryRoad").addClass("hide");
        $("#coffeeHouse").addClass("hide");

        $.get("/playlists/mood/date+night", function (response) {
            console.log(response)
        })
    })
    $("#rockBtn").click(function () {
        $("#partyTime").addClass("hide");
        $("#chillMode").addClass("hide");
        $("#workout").addClass("hide");
        $("#dateNight").addClass("hide");
        $("#rock").removeClass("hide");
        $("#hipHop").addClass("hide");
        $("#countryRoad").addClass("hide");
        $("#coffeeHouse").addClass("hide");

        $.get("/playlists/mood/rock", function (response) {
            console.log(response)
        })
    })
    $("#hipHopBtn").click(function () {
        $("#partyTime").addClass("hide");
        $("#chillMode").addClass("hide");
        $("#workout").addClass("hide");
        $("#dateNight").addClass("hide");
        $("#rock").addClass("hide");
        $("#hipHop").removeClass("hide");
        $("#countryRoad").addClass("hide");
        $("#coffeeHouse").addClass("hide");

        console.log("test")

        $.get("/playlists/mood/hip+hop", function (response) {
            console.log(response)
        })
    })
    $("#countryBtn").click(function () {
        $("#partyTime").addClass("hide");
        $("#chillMode").addClass("hide");
        $("#workout").addClass("hide");
        $("#dateNight").addClass("hide");
        $("#rock").addClass("hide");
        $("#hipHop").addClass("hide");
        $("#countryRoad").removeClass("hide");
        $("#coffeeHouse").addClass("hide");

        $.get("/playlists/mood/country+roads", function (response) {
            console.log(response)
        })
    })



})