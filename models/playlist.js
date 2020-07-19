// Defining our playlist model to store playlists in our database.
module.exports = function (sequelize, DataTypes) {
    var Playlist = sequelize.define("Playlist", {
        // Giving the playlist model a name of type STRING
            name: {
            type: DataTypes.STRING,
            allowNull: false
            },
            voteCount: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0
            },
            createdBy: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false
            },
            pageViews: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0
            }
        });

        // Creating a many-to-one relationship between playlist and moods. Necessary to associate the two.

            Playlist.associate = function (models) {
                // Associating Playlist with moodID
                // Foreign Key used to link the moodID
                Playlist.belongsTo(models.Mood, {
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
     
    return Playlist;
};