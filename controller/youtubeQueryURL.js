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

