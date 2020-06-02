var express = require("express");
var router = express.Router();
var axios = require("axios");
var db = require("../models")
var yt = require("./youtubeQueryURL")
var youtubeAxios = require("./youtubeAxiosQuery")
var itunes = require("./itunesAxios")

function capitalizeFirstLetters(string) {
    var lcStr = string.toLowerCase()
    var firstCapWords
    var wordArr = lcStr.split(" ")
    var newWordArr = []
    for (i = 0; i < wordArr.length; i++) {
        var firstChar = wordArr[i].charAt(0).toUpperCase()
        var word = firstChar + wordArr[i].substring(1)
        newWordArr.push(word)
    }

    firstCapWords = newWordArr.join(' ')
    return firstCapWords
}
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

router.get("/browse", async function (req, res){
    try {
        const playlistQuery = await db.Playlist.findAll({
            include: [db.Mood],
            order: [
                ["voteCount", "DESC"]
            ],
            limit: 5
        })
        
        
        var Playlists = []
        for (i = 0; i < playlistQuery.length; i++) {
                Playlists.push(playlistQuery[i].dataValues)
            }

            var hbObj = {
                playlists: Playlists
            }
            return res.render("browse", hbObj)
       
    }
    catch {
        res.status(500)
        console.log("error")
    }
   
})

// GET TOP 5 PlAYLISTS

router.get("/topFive", async function (req, res) {
    try {
    const playlistQuery = await db.Playlist.findAll({
        include: db.Mood,
        order: [
            ["voteCount", "DESC"]
        ],
        limit: 5 
    })
        var Playlists = []
        for (i = 0; i < playlistQuery.length; i++) {
            Playlists.push(playlistQuery[i].dataValues)
        }

        var hbObj = {
            playlists: Playlists
        }
        return res.render("browse", hbObj)
    }
    catch {
        res.status(500)
        console.log("error")
    }
});

// GET ALL PLAYLISTS ROUTES

router.get("/allPlaylists", async function (req, res){
    try {
        const playlistQuery = await db.Playlist.findAll({})
        var Playlists = []
        for (i = 0; i < playlistQuery.length; i++) {
            Playlists.push(playlistQuery[i].dataValues)
        }

        var hbObj = {
            playlists: Playlists
        }
        return res.render("browse", hbObj)
    }

    catch {
        res.status(500)
        console.log("error")
    }
})

// GET PLAYLIST BY MOOD

router.get("/playlists/mood/:name", async function (req, res) {
try {
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
        
    }

    else {
       
        var firstChar = req.params.name.charAt(0).toUpperCase()
        mood = firstChar + req.params.name.substring(1)
    }
    
    
    const moodQuery = await db.Mood.findOne({
                        where: {
                            name: mood
                                }
                        })

    const attributes = ["id", "name", "createdBy", "description", "pageViews", "voteCount", "Mood.id"];
      
    const playlistQuery = await db.Playlist.findAll({
            where: {
            MoodId: moodQuery.dataValues.id
            },
            attributes: attributes,
            include: [db.Mood],
            order: [
                ["name", "ASC"]
            ]
    })
        var Playlists = []
        for (i=0; i<playlistQuery.length; i++) {
            Playlists.push(playlistQuery[i].dataValues)
        }

         var hbObj = {
             playlists: Playlists
         }

           return res.render("browse", hbObj)
    }

catch {
    res.status(500)
    console.log("error")
    }

});

// GET PLAYLIST BY CREATOR

router.get("/playlists/creator/:name", async function (req, res){
    try {
        var creator;

        if (req.params.name.includes("+") === true) {
            var creatorArr = req.params.name.split("+")
            var newCreatorArr = []
            for (i = 0; i < creatorArr.length; i++) {
                var firstChar = creatorArr[i].charAt(0).toUpperCase()
                var word = firstChar + creatorArr[i].substring(1)
                newCreatorArr.push(word)
            }

            creator = newCreatorArr.join(' ')

        }

        else {

            var firstChar = req.params.name.charAt(0).toUpperCase()
            creator = firstChar + req.params.name.substring(1)
        }
        
         const playlistQuery = await db.Playlist.findAll({
            where: {
                createdBy: creator
            },
            include: [db.Mood]
        })
            var Playlists = []
            for (i = 0; i < playlistQuery.length; i++) {
                Playlists.push(playlistQuery[i].dataValues)
            }

            var hbObj = {
                playlists: Playlists
            }
            return res.render("browse", hbObj)

    }

    catch {
        res.status(500)
        console.log("error")
    }  
    
})

// GET PLAYLIST TRACKS

router.get("/playlistTracks/:id", async function (req, res) {
try {
     const playlistTracks = await db.PlaylistTrack.findAll({
            include: [
                {
                 model: db.Playlist,
                    where: {
                        id: req.params.id
                    },
                    include: [db.Mood]
                },
                {
                model: db.Track,
                    include: [
                        {
                            model: db.Album,
                            include: [db.Artist]
                        },
                        db.Genre
                    ]
             }
            ]
        })

    var playlistTracksArr = [] 
    for (i = 0; i < playlistTracks.length; i++) {
       playlistTracksArr.push(playlistTracks[i].dataValues)
    }

    var playlistArr = []
    playlistArr.push(playlistTracks[0].dataValues.Playlist.dataValues)

    function getGenre(track) {
        
        const genre = track

        const {
            dataValues: {
                Genre: {
                    dataValues: {
                        name
                    },
                },
            },
        } = genre
        
        genreName = name
    } 

    function getAlbum(track) {
    
    const album = track

        const {
            dataValues: {
                Album: {
                    dataValues: {
                        title
                    },
                },
            },
        } = album

        albumName = title
    }

    function getArtist(track) {
        const artist = track

        const {
            dataValues: {
                Album: {
                    dataValues: {
                        Artist: {
                            dataValues: {
                                name
                            },
                        },
                    },
                },
            },
        } = artist

        artistName = name
    } 

    function getTrack(track) {
        const Track = track

        const {
            dataValues: {
                name, artworkUrl60, youTubeVidId
            },
        } = Track

        trackName = name;
        artwork = artworkUrl60;
        youtubeVidId = youTubeVidId
    }

    var newTrackArr = []
    
    for (i=0; i<playlistTracksArr.length; i++) {
        var track = playlistTracksArr[i].Track
        var genreName;
        var albumName;
        var artistName;
        var trackName;
        var voteCount = playlistTracksArr[i].voteCount
        var artwork;
        var youtubeVidId;

        getGenre(track)
        getAlbum(track)
        getArtist(track)
        getTrack(track)

        var playlistTracksObj = {
            genre: genreName,
            album: albumName,
            artist: artistName,
            track: trackName,
            votes: voteCount,
            art: artwork,
            youtubeId: youtubeVidId
        }

        newTrackArr.push(playlistTracksObj)
    }

    
    newPlaylistArr = []
    for (i=0; i<playlistArr.length; i++) {
        var newPlaylistObj = {
            id: playlistArr[i].id,
            name: playlistArr[i].name,
            voteCount: playlistArr[i].voteCount,
            createdBy: playlistArr[i].createdBy,
            Mood: playlistArr[i].Mood,
            playlistTracks: newTrackArr 
        }

        newPlaylistArr.push(newPlaylistObj)

    }

    



    var hbObj = {
        playlists: newPlaylistArr
    }

    console.log(hbObj)
    
    return res.render("browse", hbObj)

}
catch {

    }
})



// CREATE PLAYLIST TRACK ROUTE
router.post("/api/playlistTrack/create", function (req, res) {
    var artistValue = req.body.artistName
    var songValue = req.body.trackName
    var plistId = req.body.playlistId

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
                        youTubeVidId: trackObject.youtubeVidId,
                        artworkUrl30: trackObject.artworkUrl30, 
                        artworkUrl60: trackObject.artworkUrl60, 
                        artworkUrl100: trackObject.artworkUrl100 
                    })

                    

                    const newPlaylistTrack = await db.PlaylistTrack.create({
                        TrackId: newTrack.id,
                        PlaylistId: plistId
                    })

                    res.status(200)
                    res.end()

                    return newPlaylistTrack

                }

                catch {
                    res.status(500)
                    console.log("error")
                }

            });

        }

        else {

            

            res.status(500)
            
            // Determine route to send user when they've entered incorrect/not valid song.
            console.log("Song not found. Please go to playlist and add a valid song.")
        }


    });
});

// // Get error message page

// router.get("/error", function (req, res) {
//     var errMsg = "Invalid song. Please ensure spelling is correct for both artist and song"
//     res.render("error", { errMsg: errMsg })

// })

// CREATE PLAYLIST ROUTE

router.post("/api/playlist/create", async function (req, res) {
    const newBodyObj = {}

    Object.defineProperty(newBodyObj, 'property1', {
        value: 42,
        writable: false
    })

    var p = req.body

    for (var key in p){
        if (p.hasOwnProperty(key) && typeof p[key]==="string") {
            var newValue = capitalizeFirstLetters(p[key])
            Object.defineProperty(newBodyObj, key, {
                value: newValue
            })
        }
    }


    try {
        const newMood = await db.Mood.findOrCreate({
            where: {
                name: newBodyObj.moodName
            }
        });


        const newPlaylist = await db.Playlist.create({
            name: newBodyObj.playlistName,
            createdBy: newBodyObj.createdBy,
            description: newBodyObj.description,
            MoodId: newMood[0].id
        });

        res.json({newPlaylist})


    }
    catch {
        res.redirect("/")
        console.log("error")
    }

   

});

// ADD VOTE COUNT FOR SONG

router.put("api/playlist/songVote", function (req, res) {
    console.log(req.body)

    res.end()
    // db.PlaylistTrack.update({
    //     voteCount: 
    // })
})

// ADD VOTE COUNT FOR PLAYLIST

module.exports = router;
