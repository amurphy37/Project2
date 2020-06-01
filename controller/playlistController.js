var express = require("express");
var router = express.Router();
var axios= require("axios");
var db = require("../models")

// router for Playlist (get,post,put,delete)
router.get("/", function (req, res) {
  res.redirect("/playlist");
});

router.get("/playlist", function (req, res){
  res.render("indexRYAN")
})

// GET ALL PLAYLISTS

router.get("/api/playlists", function (req, res) {
  db.Playlist.findAll({}).then(function(PlaylistData){
    res.json(PlaylistData)
    // res.render("playlistTrack", {Playlist_Data : PlaylistData});
  })
});


// CREATE PLAYLIST TRACK ROUTE

router.post("/api/playlistTrack/create", function (req, res) {
  console.log(req.body)

  var songValue = req.body.trackName
  var artistValue = req.body.artistName
  var PlaylistId = req.body.playlistId

  

  if (!songValue || !artistValue) {
    console.log("please enter both a valid artist and song")
  }

  var song = []
  var artist = []

  // We need to convert the query data into the required url string to be able to validate the song and artist against the iTunes database.

  function convertSongName(songValue) {
    // Converting songValue into an array with eaach word as a value. Looping through array to ad "+" in between words to make song name compatible for ajax query
    var wordArray = songValue.split(' ');
    var newWordArray = [];
    var firstValue = wordArray[0];

    for (i = 1; i < wordArray.length; i++) {
      var stringWordArray = "+" + wordArray[i]
      newWordArray.push(stringWordArray)
    }
    var finalSongString = firstValue.concat(newWordArray.join(""));
    song.push(finalSongString);

  }

  function convertArtistName(artistValue) {
    var wordArray = artistValue.split(' ');
    var newWordArray = [];
    var firstValue = wordArray[0];

    for (i = 1; i < wordArray.length; i++) {
      var stringWordArray = "+" + wordArray[i]
      newWordArray.push(stringWordArray)
    }
    var finalArtistString = firstValue.concat(newWordArray.join(""));
    artist.push(finalArtistString)
  }
  convertSongName(songValue);
  convertArtistName(artistValue);

  var finalSong = song[0]
  var finalArtist = artist[0]
  var iTunesQueryURL = "https://itunes.apple.com/search?term=" + finalArtist + "+" + finalSong + "&entity=musicTrack"

  

  axios.get(iTunesQueryURL).then(function (axiosResponse) {
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

      var artistName = verTrackObj.artistName
      var songName = verTrackObj.trackName
      var youtubeApiKey = "&key=AIzaSyDdZ5GkQrrooVjiK_1WYr1LTRrLLlIuC9U";
      var youtubeQueryURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=";

      var searchValue = artistName + " " + songName
      var arraySearchVal = [...searchValue]
      var spaceIndeces = []
      var firstChar = [0];

      for (i = 0; i < searchValue.length; i++) {
        if (arraySearchVal[i] === " ") {
          spaceIndeces.push(i);
        }
      }

      for (i = 0; i < spaceIndeces.length; i++) {
        var firstCharIndex = spaceIndeces[i] + 1
        firstChar.push(firstCharIndex);
      }

      // Creating words array from search and appending all ingredients in search
      var wordArray = [searchValue.substring(0, spaceIndeces[0])];

      if (spaceIndeces.length >= 1) {

        for (i = 1; i < spaceIndeces.length; i++) {
          var newWordVal = searchValue.substring(firstChar[i], spaceIndeces[i]);
          wordArray.push(newWordVal);
        }
        var lastValFirstChar = spaceIndeces[spaceIndeces.length - 1] + 1
        wordArray.push(searchValue.substring(lastValFirstChar, (searchValue.length)));
      }

      var firstValue = wordArray[0];
      var newWordArray = [];
      for (i = 1; i < wordArray.length; i++) {
        var stringWordArray = "%20" + wordArray[i]
        newWordArray.push(stringWordArray);
      }
      var finalSearchString = firstValue.concat(newWordArray.join(""));
      var newQueryURL = youtubeQueryURL + finalSearchString + youtubeApiKey;


      function youTubeAxios(newQueryURL, verTrackObj) {
        return axios.get(newQueryURL).then(function (youTubeJSON) {
          var vidId = youTubeJSON.data.items[0].id.videoId

          class TrackObject {
            constructor(artist, track, artworkUrl30, artworkUrl60, artworkUrl100, genre, album, youtubeVidId) {
              this.artist = artist,
                this.track = track,
                this.artworkUrl30 = artworkUrl30,
                this.artworkUrl60 = artworkUrl60,
                this.artworkUrl100 = artworkUrl100,
                this.genre = genre,
                this.album = album,
                this.youtubeVidId = youtubeVidId
            }
          }

          const trackObject = new TrackObject(verTrackObj.artistName, verTrackObj.trackName, verTrackObj.artworkUrl30, verTrackObj.artworkUrl60, verTrackObj.artworkUrl100, verTrackObj.primaryGenreName, verTrackObj.collectionName, vidId)

          return trackObject
        })
      }

      youTubeAxios(newQueryURL, verTrackObj).then(async (trackObject) => {

        try{

        console.log(trackObject)
        console.log(PlaylistId)

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

        res.json(newPlaylistTrack)
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
      res.redirect("/")
    }

  });
});

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



// router.put("/playlist/:id", function (req, res) {
//   Playlist.update(req.params.id, function (result) {
//     // wrapper for orm.js that using MySQL update callback will return a log to console,
//     // render back to index with handle
//     console.log(result);
//     // Send back response and let page reload from .then in Ajax
//     res.sendStatus(200);
//   });
// });
// router.delete("/api/playlist/:id", function (req, res) {
//   var condition = "id = " + req.params.id;

//   Playlist.delete(condition, function (result) {
//     if (result.affectedRows == 0) {
//       // If no rows were changed, then the ID must not exist, so 404
//       return res.status(404).end();
//     } else {
//       res.status(200).end();
//     }
//   });
// });
// // router for PlaylistTrack (get,post,put,delete)
// router.get("/", function (req, res) {
//   res.redirect("/playlistTrack");
// });

// router.get("/playlistTrack", function (req, res) {
//   PlaylistTrack.all(function (PlaylistTrackData) {
//     res.render("index", { PlaylistTrack_data: PlaylistTrackData })
//   });
// });
// router.put("/playlistTrack/:id", function (req, res) {
//   PlaylistTrack.update(req.params.id, function (result) {
//     // wrapper for orm.js that using MySQL update callback will return a log to console,
//     // render back to index with handle
//     console.log(result);
//     // Send back response and let page reload from .then in Ajax
//     res.sendStatus(200);
//   });
// });
// router.delete("/api/playlistTrack/:id", function (req, res) {
//   var condition = "id = " + req.params.id;

//   PlaylistTrack.delete(condition, function (result) {
//     if (result.affectedRows == 0) {
//       // If no rows were changed, then the ID must not exist, so 404
//       return res.status(404).end();
//     } else {
//       res.status(200).end();
//     }
//   });
// });
// // router for Track (get,post,put,delete)
// router.get("/", function (req, res) {
//   res.redirect("/track");
// });

// router.get("/track", function (req, res) {
//   Track.all(function (TrackData) {
//     res.render("index", { Track_data: TrackData })
//   });
// });
// router.post("/track/create", function (req, res) {
//   Track.create(req.body.Track.name, function (result) {
//     console.log(result);
//     res.redirect('/');
//   });
// });
// router.put("/track/:id", function (req, res) {
//   Track.update(req.params.id, function (result) {
//     // wrapper for orm.js that using MySQL update callback will return a log to console,
//     // render back to index with handle
//     console.log(result);
//     // Send back response and let page reload from .then in Ajax
//     res.sendStatus(200);
//   });
// });
// router.delete("/api/track/:id", function (req, res) {
//   var condition = "id = " + req.params.id;

//   Track.delete(condition, function (result) {
//     if (result.affectedRows == 0) {
//       // If no rows were changed, then the ID must not exist, so 404
//       return res.status(404).end();
//     } else {
//       res.status(200).end();
//     }
//   });
// });
// // router for Genre (get,post,put,delete)
// router.get("/", function (req, res) {
//   res.redirect("/genre");
// });

// router.get("/genre", function (req, res) {
//   Genre.all(function (GenreData) {
//     res.render("index", { Genre_data: GenreData })
//   });
// });
// router.post("/genre/create", function (req, res) {
//   Genre.create(req.body.Genre.name, function (result) {
//     console.log(result);
//     res.redirect('/');
//   });
// });
// router.put("/genre/:id", function (req, res) {
//   Genre.update(req.params.id, function (result) {
//     // wrapper for orm.js that using MySQL update callback will return a log to console,
//     // render back to index with handle
//     console.log(result);
//     // Send back response and let page reload from .then in Ajax
//     res.sendStatus(200);
//   });
// });
// router.delete("/api/genre/:id", function (req, res) {
//   var condition = "id = " + req.params.id;

//   Genre.delete(condition, function (result) {
//     if (result.affectedRows == 0) {
//       // If no rows were changed, then the ID must not exist, so 404
//       return res.status(404).end();
//     } else {
//       res.status(200).end();
//     }
//   });
// });
// // router for Album (get,post,put,delete)
// router.get("/", function (req, res) {
//   res.redirect("/album");
// });

// router.get("/album", function (req, res) {
//   Album.all(function (AlbumData) {
//     res.render("index", { Album_data: AlbumData })
//   });
// });
// router.post("/album/create", function (req, res) {
//   Album.create(req.body.Album.name, function (result) {
//     console.log(result);
//     res.redirect('/');
//   });
// });
// router.put("/album/:id", function (req, res) {
//   Album.update(req.params.id, function (result) {
//     // wrapper for orm.js that using MySQL update callback will return a log to console,
//     // render back to index with handle
//     console.log(result);
//     // Send back response and let page reload from .then in Ajax
//     res.sendStatus(200);
//   });
// });
// router.delete("/api/album/:id", function (req, res) {
//   var condition = "id = " + req.params.id;

//   Album.delete(condition, function (result) {
//     if (result.affectedRows == 0) {
//       // If no rows were changed, then the ID must not exist, so 404
//       return res.status(404).end();
//     } else {
//       res.status(200).end();
//     }
//   });
// });
// // router for Artist (get,post,put,delete)
// router.get("/", function (req, res) {
//   res.redirect("/artist");
// });

// router.get("/artist", function (req, res) {
//   Artist.all(function (ArtistData) {
//     res.render("index", { Artist_data: ArtistData })
//   });
// });
// router.post("/artist/create", function (req, res) {
//   Artist.create(req.body.Artist.name, function (result) {
//     console.log(result);
//     res.redirect('/');
//   });
// });
// router.put("/artist/:id", function (req, res) {
//   Artist.update(req.params.id, function (result) {
//     // wrapper for orm.js that using MySQL update callback will return a log to console,
//     // render back to index with handle
//     console.log(result);
//     // Send back response and let page reload from .then in Ajax
//     res.sendStatus(200);
//   });
// });
// router.delete("/api/artist/:id", function (req, res) {
//   var condition = "id = " + req.params.id;

//   Artist.delete(condition, function (result) {
//     if (result.affectedRows == 0) {
//       // If no rows were changed, then the ID must not exist, so 404
//       return res.status(404).end();
//     } else {
//       res.status(200).end();
//     }
//   });
// });
// // router for Mood (get,post,put,delete)
// router.get("/", function (req, res) {
//   res.redirect("/mood");
// });

// router.get("/mood", function (req, res) {
//   Mood.all(function (MoodData) {
//     res.render("index", { Mood_data: MoodData })
//   });
// });
// router.post("/mood/create", function (req, res) {
//   Mood.create(req.body.Mood.name, function (result) {
//     console.log(result);
//     res.redirect('/');
//   });
// });
// router.put("/mood/:id", function (req, res) {
//   Mood.update(req.params.id, function (result) {
//     // wrapper for orm.js that using MySQL update callback will return a log to console,
//     // render back to index with handle
//     console.log(result);
//     // Send back response and let page reload from .then in Ajax
//     res.sendStatus(200);
//   });
// });
// router.delete("/api/mood/:id", function (req, res) {
//   var condition = "id = " + req.params.id;

//   Mood.delete(condition, function (result) {
//     if (result.affectedRows == 0) {
//       // If no rows were changed, then the ID must not exist, so 404
//       return res.status(404).end();
//     } else {
//       res.status(200).end();
//     }
//   });
// });
module.exports = router;