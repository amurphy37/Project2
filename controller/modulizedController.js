var express = require("express");
var router = express.Router();
var axios = require("axios");
var db = require("../models")
var yt = require("./youtubeQueryURL")
var youtubeAxios = require("./youtubeAxiosQuery")
var itunes = require("./itunesAxios")

// router for Playlist (get,post,put,delete)
router.get("/", function (req, res) {
    res.redirect("/playlist");
});

router.get("/playlist", function (req, res) {
    res.render("index")
})

router.get("/create", function (req, res) {
    res.render("create")
})

// GET TOP 5 PlAYLISTS

router.get("/browse", function (req, res) {
    db.Playlist.findAll({
        include: db.Mood,
        order: [
            ["voteCount", "DESC"]
        ],
        limit: 5 
    }).then(function (playlistData) {
        res.render("browse", {playlistData : playlistData});
    })
});

// GET ALL PLAYLISTS ROUTES

router.get("/allPlaylists", function (req, res){
    db.Playlist.findAll({}).then(function (playlistData) {
        res.json(playlistData)
    })
})

// GET PLAYLIST BY MOOD

router.get("/playlists/mood/:name", function (req, res) {
    var mood;

    if(req.params.name.includes("+")===true) {
        var moodArr = req.params.name.split("+")
        var newMoodArr = []
        for (i=0; i< moodArr.length; i++) {
            var firstChar = moodArr[i].charAt(0).toUpperCase()
            var word = firstChar + moodArr[i].substring(1)
            newMoodArr.push(word)
        }

        mood = newMoodArr.join(' ')
        
        
        // moodArr.join(' ')
        // console.log(moodArr)
        
    }

    else {
       
        var firstChar = req.params.name.charAt(0).toUpperCase()
        mood = firstChar + mood.substring(1)
    }

    console.log(mood)
    
    
    db.Mood.findOne({
       where: {
           name: mood
       }
    }).then(function (dbMood) { 

        var MoodId = dbMood.dataValues.id
      
        db.Playlist.findAll({
            where: {
            MoodId: MoodId,
            order: [
                ["name", "ASC"]
            ]
        }
    }).then(function(moodPlaylists){
            console.log(moodPlaylists[0])
            res.json(moodPlaylists)
        })

    })

})


// CREATE PLAYLIST TRACK ROUTE

router.post("/api/playlistTrack/create", function (req, res) {
    console.log(req.body)
    var artistValue = req.body.artistName
    var songValue = req.body.trackName
    var PlaylistId = req.body.playlistId

    axios.get(itunes.query(req)).then(function (axiosResponse) {
        var verTrackObj
        for (i = 0; i < axiosResponse.data.results.length; i++) {
            if (axiosResponse.data.results[i].trackName) {
                var lcEnteredArtist = artistValue.toLowerCase()
                var lcEnteredSong = songValue.toLowerCase()
                var lcItunesArtist = axiosResponse.data.results[i].artistName.toLowerCase()
                var lcItunesSong = axiosResponse.data.results[i].trackName.toLowerCase()

                if (lcEnteredArtist === lcItunesArtist && lcEnteredSong === lcItunesSong) {
                    verTrackObj = axiosResponse.data.results[i]
                    break
                }

            }
        }


        if (verTrackObj) {

            youtubeAxios.query(yt.youtubeQueryURL(verTrackObj), verTrackObj).then(async (trackObject) => {

                try {

                    const newArtist = await db.Artist.findOrCreate({
                        where: {
                            name: trackObject.artist
                        }
                    })

                    const newAlbum = await db.Album.findOrCreate({
                        where: {
                            title: trackObject.album,
                            ArtistId: newArtist[0].id
                        }
                    })

                    const newGenre = await db.Genre.findOrCreate({
                        where: {
                            name: trackObject.genre
                        }
                    })

                    const newTrack = await db.Track.create({
                        name: trackObject.track,
                        AlbumId: newAlbum[0].id,
                        GenreId: newGenre[0].id,
                        youTubeVidId: trackObject.youtubeVidId
                    })

                    const newPlaylistTrack = await db.PlaylistTrack.create({
                        TrackId: newTrack.id,
                        PlaylistId: PlaylistId
                    })

                    // res.json(200)
                    // res.render("index", { newPlaylistTrack })

                }

                catch {
                    console.log("error")
                }

            });

        }

        else {
            // Determine route to send user when they've entered incorrect/not valid song.
            console.log("Song not found. Please search a valid song.")
        }

    });

    res.json(200)
});

// // Get error message page

// router.get("/error", function (req, res) {
//     var errMsg = "Invalid song. Please ensure spelling is correct for both artist and song"
//     res.render("error", { errMsg: errMsg })

// })

// CREATE PLAYLIST ROUTE

router.post("/api/playlist/create", async function (req, res) {
    console.log(req.body)

    try {
        const newMood = await db.Mood.findOrCreate({
            where: {
                name: req.body.moodName
            }
        });


        const newPlaylist = await db.Playlist.create({
            name: req.body.playlistName,
            createdBy: req.body.createdBy,
            description: req.body.description,
            MoodId: newMood[0].id
        });

        res.json(newPlaylist)


    }
    catch {
        res.redirect("/")
        console.log("error")
    }

});

// ADD VOTE COUNT FOR SONG

router.put("api/playlist/songVote", function (req, res) {
    db.Track.update()
})

// ADD VOTE COUNT FOR PLAYLIST

// GET PLAYLISTS BY MOOD

router.get("api/playlist/mood")

module.exports = router;
