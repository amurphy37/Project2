// This file exports a query method which takes in a query url and verified track object from the iTunes query and performs a get call to the YouTube Data API to retrieve the video for the song.
// The function then creates a TrackObject class inlcuding the Youtube video ID which can be accessed later for rendering purposes. 

var axios = require ("axios")

module.exports = {

 query: function (newQueryURL, verTrackObj) {

        return axios.get(newQueryURL).then(function (youTubeJSON) {
            console.log(youTubeJSON.data.items)
            var vidId = youTubeJSON.data.items[0].id.videoId

            class TrackObject {
                constructor(artist, track, artworkUrl30, artworkUrl60, artworkUrl100, genre, album, vidId) {
                    this.artist = artist,
                        this.track = track,
                        this.artworkUrl30 = artworkUrl30,
                        this.artworkUrl60 = artworkUrl60,
                        this.artworkUrl100 = artworkUrl100,
                        this.genre = genre,
                        this.album = album,
                        this.vidId = vidId
                }
            }


            const trackObject = new TrackObject(verTrackObj.artistName, verTrackObj.trackName, verTrackObj.artworkUrl30, verTrackObj.artworkUrl60, verTrackObj.artworkUrl100, verTrackObj.primaryGenreName, verTrackObj.collectionName, vidId)

            return trackObject

            // We return our full track object which includes, track title, artwork, genrea, album, artist and video Id
            

        })
    
}

}