//playlist button functions to hide and show content on page

$(document).ready(function () {

    // Hides tracks once user has elected to view tracks for a given playlist.

    $(".hideTracksBtn").click(function () {
        $("#trackList").addClass("hide");
        $("#showTracksBtn").removeClass("hide");
        $("#hideTracksBtn").addClass("hide");
        $("#youTubePlayer").addClass("hide");
    }),

    // Presents Youtube Player with song video upon clicking Youtube button.

    $("#youTubeBtn").click(function () {
        $("#youTubePlayer").removeClass("hide");
        return false
    });

    // Closes Youtube iFrame

    $("#closeYouTubeBtn").click(function () {
        $("#youTubePlayer").addClass("hide");
    }),

    // Reveals form to add new track to playlist. 

    $(".addNewTrackBtn").click(function () {
        $("#newTrackForm").removeClass("hide");
    }),

    // Closes new track form

    $("#returnPlaylistBtn").click(function () {
        $("#newTrackForm").addClass("hide");
    })

    // CREATE PLAYLIST AND CREATE PLAYLIST TRACK

   $(".formSubmit").submit(function () {
    event.preventDefault()

       var playlistName = $("#playlistName").val()
       var playlistTracks = []
       var createdBy = $("#createdBy").val().trim()
       var mood = $("#mood").val().trim()
       var description = $("#description").val().trim()
       var song1 = $("#song1").val().trim()
       var artist1 = $("#artist1").val().trim()

    //    Creating object with artist and song of first song added to playlist.

       var playlistTrack1 = {
           track: song1,
           artist: artist1
       }

       playlistTracks.unshift(playlistTrack1)

    var serializedArr = $(this).serializeArray()
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

    // for all other songs, adding artist and track object to playlist tracks array.

    for (i=0; i< trackArr.length; i++) {
        var trackObj = {
            track: trackArr[i],
            artist: artistArr[i]
        }

        playlistTracks.unshift(trackObj)
    }

    // Creating object for playlist to create in database. 

    var playlistData = {
        moodName: mood,
        playlistName: playlistName,
        createdBy: createdBy,
        description: description,
        playlistTracks: playlistTracks
    }

    // Function to create playlist in our database. Function calls our post route and passes in the playlistData object. 
    function createPlaylist(playlistData) {
        $.post("/api/playlist/create", playlistData)
            .then(function (response) {

                console.log("playlist created successfully")

                // Looping through each track in the playlistTracks array and adding them as playlist tracks in the database.

                for (i = 0; i < playlistData.playlistTracks.length; i++) {
                    var playlistTrackData = {
                           trackName: playlistData.playlistTracks[i].track,
                           artistName: playlistData.playlistTracks[i].artist,
                           playlistId: response.newPlaylist.id
                       }

                    createPlaylistTrack(playlistTrackData)
                   }
               })

            .catch(error => {
                console.log("Error creating playlist ")
                console.log(error)
            })
       }

    //    Function to create playlist tracks in the PlaylistTrack table and associating them with playlist above.

    function createPlaylistTrack(playlistTrackData) {
        $.post("/api/playlistTrack/create", playlistTrackData)
            .then(function (response) {
                console.log("added track to playlist")
            })
            .catch(error => {
                console.log("Error adding song")
                console.log(error)
            })
    }

    // Calling our createPlaylist function upon form submit, kicking of the above sequence of actions.

    createPlaylist(playlistData)

    // When the user completes the form to add a song to a playlist, function below adds tracks to the track object.

    $("#addSongForm").submit(function () {
        var tracks = []

        var serializedArr = $(this).serializeArray()
        var trackArr = []
        var artistArr = []

        for (i = 0; i < serializedArr.length; i++) {
            if (serializedArr[i].name === "songTitleField") {
                trackArr.push(serializedArr[i].value)
            }

            else {
                artistArr.push(serializedArr[i].value)
            }
        }

        for (i = 0; i < trackArr.length; i++) {
            var trackObj = {
                track: trackArr[i],
                artist: artistArr[i]
            }

            tracks.unshift(trackObj)
        }

        console.log(tracks)

    })

   })



//    VOTING SYSTEM WILL BE VERSION TWO OF APP


//     //on click to increment vote for playlist +1
//     $("#playlistPlusBtn").click(function() {
//         $('#counter').html(function(i, val) {
//             $.ajax({
//                 //need path  for url
//                 url: 'api/playlist/songVote',
//                 type: 'POST',
//                 data: {increment: true},
//             });
//             return +val+1;
            
//         });
//     });

// //on click to decrement vote for playlist -1
//     $("#playlistMinusBtn").click(function() {
//         $('#counter').html(function(i, val) {
//             $.ajax({
//                 //need path  for url
//                 url: 'api/playlist/songVote',
//                 type: 'PUT',
//                 data: {decrement: true},
//             }).then(function (response) {
//                 consnole.log(response)
//             })
//             return val-1;
//         });
//     });

// //on click to increment vote for individual track +1
//         $("#trackPlusBtn").click(function() {
//             $('#trackCounter').html(function(i, val) {
//                 $.ajax({
//                     //need path  for url
//                     url: '',
//                     type: 'POST',
//                     data: {increment: true},
//                 });
//                 return +val+1;
//             });
//         });
    
// //on click to decrement vote for playlist -1
//         $("#trackMinusBtn").click(function() {
//             $('#trackCounter').html(function(i, val) {
//                 $.ajax({
//                     //need path  for url
//                     url: '',
//                     type: 'POST',
//                     data: {decrement: true},
//                 });
//                 return val-1;
//             });
//         });
    

})
