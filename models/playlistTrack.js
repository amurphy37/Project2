module.exports = function (sequelize, DataTypes) {
    var playlistTrack = sequelize.define("playlistTrack", {
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

        playlistTrack.associate = function (models) {
            // Associating playlist track with playlist
            playlistTrack.belongsTo(models.playlist, {
                foreignKey: {
                    allowNull: false
                }
            });
        };
    
    return playlistTrack;
};