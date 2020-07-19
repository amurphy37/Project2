// Creating our artist model to store artists in our database.
module.exports = function (sequelize, DataTypes) {
    var Artist = sequelize.define("Artist", {
        // Giving artist id as primary key and name as string
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 30]
            }
        }
    });
    
    // Creating a one-to-many relationship between artists and albums. One artist can have many albums.
    // Joining on artist.id = album.ArtistId
    Artist.associate = function (models) {
        Artist.hasMany(models.Album)
    };

    return Artist;
}