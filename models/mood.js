// Creating our mood model to store playlist moods in database as its own table.

module.exports = function (sequelize, DataTypes) {
    var Mood = sequelize.define("Mood", {
        // Giving Mood id as primary key and name as string
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 30]
            }
        }
    });

    // Creating a one-to-many relationship between mood and playlist. 
    // Every playlist has a mood, and each mood can have many playlists.

    Mood.associate = function (models) {
        Mood.hasMany(models.Playlist)
    };

    return Mood;
}