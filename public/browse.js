//button functions for on click hide and add class for content areas

$(document).ready(function () {

    // Function for bringing forth view when use wants to search by mood
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
    // Function for bringing forth view when user searches by creator
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

    
//  Function for powering render of search results when user elects to view top 5 playlists.
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

    // Render top five playlists when clicking on trending button

    $("#trendingBtn").click(function () {
        getTopFivePlaylist()
    })


// Function for powering render of search results when user wishes to see all playlists
    function getAllPlaylists() {
        $.get("/allPlaylists", function (response) {
            console.log(response)
            $("body").html(response);
            $("#playlistContainer").removeClass("hide")
            $("#top-five").addClass("hide");
            $("#moods").addClass("hide");
            $("#allHeader").removeClass("hide");
            $("#creators").addClass("hide");

        })

    }

    // When user clicks to see all playlists, this will call function above

    $("#allBtn").click( function () {
        getAllPlaylists()
    })

    // Function for powering render of search results when user searches by mood

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

    // Calls above function when user clicks on search by moods button
    
    $(".moodBtns").click(function () {
        searchByMood(this.value)
    })

    // Function for powering render of search results when user searches by creator
    
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

    // Calls above function when user clicks search when entering in creator in query input.

    $("#button-addon2").click(function () {
        searchByCreator()
    })

    // Function to get playlist tracks when user clicks to view tracks on a given playlist. Takes in Playlist ID which will be present based on which playlist user clicks.

    function getPlaylistTracks (id) {


        $.get("/playlistTracks/" + id, function (response){
           console.log(response)
           $("body").html(response)
           $("#trackList").removeClass("hide")

        })
    }

    // Calls above function and renders view of tracks for a given playlist.

    $(".showTracksBtn").click(function () {
        var id = $(this).attr("value")
        getPlaylistTracks(id)
        $("#trackList").removeClass("hide");
        $("#showTracksBtn").addClass("hide");
        $("#hideTracksBtn").removeClass("hide");

    })

    

   
})