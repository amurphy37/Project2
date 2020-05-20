module.exports = function (sequelize, DataTypes) {
    var track = sequelize.define("track", {
        // Giving the track model a name of type STRING
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 30]
            }
        }
    });

    track.associate = function (models) {
        // Associating track to a genre
        track.belongsTo(models.Genre, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    track.associate = function (models) {
        // Associating track to album in a many-to-one relationship
        track.belongsTo(models.Album, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    track.associate = function (models) {
        // Associating track to playlistTrack 
        track.belongsTo(models.playlistTrack, {
            foreignKey: {
                allowNull: false
            }
        });
    };
    return Playlist;
};