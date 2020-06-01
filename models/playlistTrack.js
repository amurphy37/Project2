module.exports = function (sequelize, DataTypes) {
    var PlaylistTrack = sequelize.define("PlaylistTrack", {
        // Giving the playlistTrack model a name of type STRING
        voteCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                len: [1, 30]
            },
            defaultValue: 0
        }

    });

        PlaylistTrack.associate = function (models) {
            // Associating playlist track with playlist
            PlaylistTrack.belongsTo(models.Playlist, {
                foreignKey: {
                    allowNull: false
                }
            });

            PlaylistTrack.belongsTo(models.Track, {
                foreignKey: {
                    allowNull: false
                }
            });
        };
    
    return PlaylistTrack;
};