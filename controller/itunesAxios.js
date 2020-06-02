var axios = require("axios")

module.exports = {
    query: function (req) {

    var songValue = req.body.trackName
    var artistValue = req.body.artistName
    
    if (!songValue || !artistValue) {
        console.log("please enter both a valid artist and song")
    }

    var song = []
    var artist = []

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

    // Convertin Artist Name 

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

    return iTunesQueryURL

    }
}