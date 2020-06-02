//button functions for on click hide and add class for content areas

$(document).ready(function () {

    function searchByMoodView() {
        $("#playlistContainer").addClass("hide");
        $("#top-five").addClass("hide")
        $("#creators").addClass("hide");
        $("#allHeader").addClass("hide");
        $("#moods").removeClass("hide");

    }

    $("#moodBtn").click(function () {
        searchByMoodView()
    })

    function searchByCreatorView () {
        $("#playlistContainer").addClass("hide");
        $("#top-five").addClass("hide");
        $("#moods").addClass("hide");
        $("#allHeader").addClass("hide");
        $("#creators").removeClass("hide");

    }

    $("#creatorBtn").click(function () {
        searchByCreatorView()
    })

    

    function getTopFivePlaylist () {

        $.get("/topFive", function (response) {
            $("body").html(response);
            $("#playlistContainer").removeClass("hide")
            $("#top-five").removeClass("hide");
            $("#moods").addClass("hide");
            $("#allHeader").addClass("hide");
            $("#creators").addClass("hide");

        })

    }

    $("#trendingBtn").click(function () {
        getTopFivePlaylist()
    })



    function getAllPlaylists() {
        $.get("/allPlaylists", function (response) {
            $("body").html(response);
            $("#playlistContainer").removeClass("hide")
            $("#top-five").addClass("hide");
            $("#moods").addClass("hide");
            $("#allHeader").removeClass("hide");
            $("#creators").addClass("hide");

        })

    }

    $("#allBtn").click( function () {
        getAllPlaylists()
    })

    function searchByMood(value) {
        var genre = value.toLowerCase()
        var routeParam = genre.split(" ").join("+")
        
        $.get("/playlists/mood/" + routeParam, function(response){
            $("body").html(response)
            $("#playlistContainer").removeClass("hide");
            $("#top-five").addClass("hide");
            $("#moods").removeClass("hide");
            $("#creators").addClass("hide");
            $("#allHeader").addClass("hide");
        })
    }
    
    $(".moodBtns").click(function () {
        searchByMood(this.value)
    })
    
    function searchByCreator () {
        var creator = $("#search").val().trim()
        var lcCreator = creator.toLowerCase()
        var routeParam = lcCreator.split(" ").join("+")

        $.get("/playlists/creator/" + routeParam, function(response){
            $("body").html(response)
            $("#playlistContainer").removeClass("hide");
            $("#top-five").addClass("hide");
            $("#moods").addClass("hide");
            $("#creators").removeClass("hide");
            $("#allHeader").addClass("hide");

        })
        
    }

    $("#button-addon2").click(function () {
        searchByCreator()
    })


    function getPlaylistTracks (id) {


        $.get("/playlistTracks/" + id, function (response){
           console.log(response)
           $("body").html(response)
           $("#trackList").removeClass("hide")

        })
    }

    $(".showTracksBtn").click(function () {
        var id = $(this).attr("value")
        getPlaylistTracks(id)

    })

    

   
})