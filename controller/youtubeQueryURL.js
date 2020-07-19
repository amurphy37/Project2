// This file exports a method which is used to call the YouTube Data API to retrieve the relevant video. 
// If we pass in artist name and song title, the video we'll receive will either be the music video for the songo or a video with the song audio. 

module.exports = {
    youtubeQueryURL: function (verTrackObj) {  
        var artistName = verTrackObj.artistName
        var songName = verTrackObj.trackName
        var youtubeApiKey = "&key=AIzaSyCWhzaXIbFYy_FCH58H-Go659o30FEiPb8";
        var youtubeQueryURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=";

        var searchValue = artistName + " " + songName

        var newSearchValue = searchValue.split(" ").join("%20")

        var newQueryURL = youtubeQueryURL + newSearchValue + youtubeApiKey;

        return newQueryURL

    }
}

