// modulizedController.js will act as our main controller within our MVC app framework. 
// In this file we'll find our api routes to store information on our database, retrieve information from database and render appropriate handlebars views.


// We need to require express and router to power our Express routes.
// We need to require our models to access our Sequelize models to perform CRUD operations.
// We're also requiring the methods exported in the other controller files to perform operations with iTunes and YouTube APIs.

var express = require("express");
var router = express.Router();
var axios = require("axios");
var db = require("../models")
var yt = require("./youtubeQueryURL")
var youtubeAxios = require("./youtubeAxiosQuery")
var itunes = require("./itunesAxios")

// Function to ensure that all string values have capitalized first letters and the rest lowercase.

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

// home route - this renders the home screen of the app

router.get("/playlist", function (req, res) {
    res.render("index")
})

// Get route for playlist create screen
router.get("/create", function (req, res) {
    res.render("create")
})


// Get route for browse screen

router.get("/browse", async function (req, res) {
    try {

        const newPL = await db.PlaylistTrack.findAll({
            // raw: true,
            attributes: [
                'PlaylistId', 'TrackId'
            ],
            include: [{
                model: db.Playlist,
                attributes: ['name']
            }, {
                model: db.Track,
                attributes: ['name']
            }],
            group: ['PlaylistTrack.PlaylistId', 'PlaylistTrack.TrackId']
        })

        console.log("TEST AGG", newPL)

        



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
    catch (error) {
        console.log(error.message)
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

router.get("/allPlaylists", async function (req, res) {
    try {
        let playlistQuery = await db.Playlist.findAll({ raw: true, include: [db.Mood] })

        playlistQuery = playlistQuery.map(function (element) {
            element.moodName = element['Mood.name']
            return element;
        })

        var hbObj = {
            playlists: playlistQuery
        }

        console.log(hbObj)
        return res.render("browse", hbObj)
    }

    catch (error) {
        console.log(error.message)
        res.status(500)
        console.log("error")
    }
})

// GET PLAYLIST BY MOOD

router.get("/playlists/mood/:name", async function (req, res) {
    try {
        var mood;

        if (req.params.name.includes("+") === true) {
            var moodArr = req.params.name.split("+")
            var newMoodArr = []
            for (i = 0; i < moodArr.length; i++) {
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
        for (i = 0; i < playlistQuery.length; i++) {
            Playlists.push(playlistQuery[i].dataValues)
        }

        var hbObj = {
            playlists: Playlists
        }

        console.log(hbObj)

        return res.render("browse", hbObj)
    }

    catch {
        res.status(500)
        console.log("error")
    }

});

// GET PLAYLIST BY CREATOR

router.get("/playlists/creator/:name", async function (req, res) {
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

    // As we have a series of joined tables, we'll need to perform our database calls asynchronously to make sure we have the proper order.
    try {
        // First call PlaylistTrack model to retreive all tracks within a given playlist based on PlaylistId
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

        // This function gets the genre for a given track. Note object deconstructing to retreive the genre. 

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

        // This function gets album for a given track. 

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

        // This function returns the artist for the track we pass in as an argument. 
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

        // This function returns track data (name, artwork and Youtube Video Id) based on the track argument we pass in.
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

        for (i = 0; i < playlistTracksArr.length; i++) {
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

            // Here we set the object for each playlist track. 

            var playlistTracksObj = {
                genre: genreName,
                album: albumName,
                artist: artistName,
                track: trackName,
                votes: voteCount,
                art: artwork,
                youtubeId: youtubeVidId
            }

            // Add the playlist track to our array of playlist tracks

            newTrackArr.push(playlistTracksObj)
        }


        newPlaylistArr = []
        for (i = 0; i < playlistArr.length; i++) {
            var newPlaylistObj = {
                id: playlistArr[i].id,
                name: playlistArr[i].name,
                voteCount: playlistArr[i].voteCount,
                description: playlistArr[i].description,
                createdBy: playlistArr[i].createdBy,
                Mood: playlistArr[i].Mood,
                playlistTracks: newTrackArr
            }

            newPlaylistArr.push(newPlaylistObj)

        }

        // Here we're passing in our array of playlists, each of which including an array of playlist tracks. We'll use this to render our handlebars view.

        var hbObj = {
            playlists: newPlaylistArr
        }

        // Render handlebars view with playlist and playlist track data.

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

    // We first take in the song name and artist name and query the iTunes database for validation purposes. If the song is verified, we'll set verTrackObj equal to our response.

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
        
        // If the track passes iTunes verification, we'll query Youtube to get back the video Id which we'll store in our database.
        if (verTrackObj) {

            youtubeAxios.query(yt.youtubeQueryURL(verTrackObj), verTrackObj).then(async (trackObject) => {

                // Using async/await to perform sequence of database calls to store artist, album, genre, track and playlist track in our databse. 

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
                        youTubeVidId: trackObject.vidId,
                        artworkUrl60: trackObject.artworkUrl60
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

// CREATE PLAYLIST ROUTE
// We first define a new body object which is writable such that we can create a new object to then use for our CRUD operations.

router.post("/api/playlist/create", async function (req, res) {
    const newBodyObj = {}

    Object.defineProperty(newBodyObj, 'property1', {
        value: 42,
        writable: false
    })

    var p = req.body

    for (var key in p) {
        if (p.hasOwnProperty(key) && typeof p[key] === "string") {
            var newValue = capitalizeFirstLetters(p[key])
            Object.defineProperty(newBodyObj, key, {
                value: newValue
            })
        }
    }

// Once we've defined our new object, we first either associate an existing mood within our database or create a new mood.
    try {
        const newMood = await db.Mood.findOrCreate({
            where: {
                name: newBodyObj.moodName
            }
        });

        // Function creates a new playlist in the database based on the new object we've created
        const newPlaylist = await db.Playlist.create({
            name: newBodyObj.playlistName,
            createdBy: newBodyObj.createdBy,
            description: newBodyObj.description,
            MoodId: newMood[0].id
        });

        res.json({ newPlaylist })


    }
    catch {
        res.redirect("/")
        console.log("error")
    }



});

module.exports = router;
