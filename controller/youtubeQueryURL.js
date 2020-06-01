module.exports = {
    youtubeQueryURL: function (verTrackObj) {  
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

    return newQueryURL

    }
}

