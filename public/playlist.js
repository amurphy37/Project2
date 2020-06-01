//playlist button functions to hide and show content on page

$(document).ready(function () {
    $("#showTracksBtn").click(function () {
        $("#trackList").removeClass("hide");
        $("#showTracksBtn").addClass("hide");
        $("#hideTracksBtn").removeClass("hide");
    }),

    $("#hideTracksBtn").click(function () {
        $("#trackList").addClass("hide");
        $("#showTracksBtn").removeClass("hide");
        $("#hideTracksBtn").addClass("hide");
        $("#youTubePlayer").addClass("hide");
    }),

    $("#youTubeBtn").click(function () {
        $("#youTubePlayer").removeClass("hide");
        return false
    });

    $("#closeYouTubeBtn").click(function () {
        $("#youTubePlayer").addClass("hide");
    }),

    $("#addNewTrackBtn").click(function () {
        $("#newTrackForm").removeClass("hide");
    }),

    $("#returnPlaylistBtn").click(function () {
        $("#newTrackForm").addClass("hide");
    })

    // CREATE PLAYLIST AND CREATE PLAYLIST TRACK

   $("form").submit(function () {
    event.preventDefault()

       var playlistName = $("#playlistName").val()
       var playlistTracks = []
       var createdBy = $("#createdBy").val().trim()
       var mood = $("#mood").val().trim()
       var description = $("#description").val().trim()
       var song1 = $("#song1").val().trim()
       var artist1 = $("#artist1").val().trim()

       console.log(playlistName)

       var playlistTrack1 = {
           track: song1,
           artist: artist1
       }

       playlistTracks.unshift(playlistTrack1)

    var serializedArr = $(this).serializeArray()
    console.log(serializedArr)
    var trackArr = []
    var artistArr = []

    for (i=0; i<serializedArr.length; i++) {
        if (serializedArr[i].name === "songTitleField") {
            trackArr.push(serializedArr[i].value)
        }

        else {
            artistArr.push(serializedArr[i].value)
        }
    }

    for (i=0; i< trackArr.length; i++) {
        var trackObj = {
            track: trackArr[i],
            artist: artistArr[i]
        }

        playlistTracks.unshift(trackObj)
    }

    var playlistData = {
        moodName: mood,
        playlistName: playlistName,
        createdBy: createdBy,
        description: description,
        playlistTracks: playlistTracks
    }


    function createPlaylist(playlistData) {
        $.post("/api/playlist/create", playlistData)
            .then(function (response) {

                for (i=0; i< playlistData.playlistTracks.length; i++) {
                    var playlistTrackData = {
                        trackName: playlistData.playlistTracks[i].track,
                        artistName: playlistData.playlistTracks[i].artist,
                        playlistId: response.id
                    }

                    createPlaylistTrack(playlistTrackData)
                }
            })
    }

    

    function createPlaylistTrack(playlistTrackData) {
        $.post("/api/playlistTrack/create", playlistTrackData)
            .then(function (response) {
                
                
            })
    }

    createPlaylist(playlistData)

   })


    //on click to increment vote for playlist +1
    $("#playlistPlusBtn").click(function() {
        $('#counter').html(function(i, val) {
            $.ajax({
                //need path  for url
                url: '',
                type: 'POST',
                data: {increment: true},
            });
            return +val+1;
            
        });
    });

//on click to decrement vote for playlist -1
    $("#playlistMinusBtn").click(function() {
        $('#counter').html(function(i, val) {
            $.ajax({
                //need path  for url
                url: '',
                type: 'POST',
                data: {decrement: true},
            });
            return val-1;
        });
    });

//on click to increment vote for individual track +1
        $("#trackPlusBtn").click(function() {
            $('#trackCounter').html(function(i, val) {
                $.ajax({
                    //need path  for url
                    url: '',
                    type: 'POST',
                    data: {increment: true},
                });
                return +val+1;
            });
        });
    
//on click to decrement vote for playlist -1
        $("#trackMinusBtn").click(function() {
            $('#trackCounter').html(function(i, val) {
                $.ajax({
                    //need path  for url
                    url: '',
                    type: 'POST',
                    data: {decrement: true},
                });
                return val-1;
            });
        });
    

})
