module.exports = function (sequelize, DataTypes) {
    var playlist = sequelize.define("playlist", {
        // Giving the playlist model a name of type STRING
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 30]
                }
            },
            voteCount: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    len: [1, 500]
                },
                defaultValue: 0
            },
            pageViews: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    len: [1, 50000]
                },
                defaultValue: 0
            }
        });

            playlist.associate = function (models) {
                // Associating Playlist with moodID
                // Foreign Key used to link the moodID
                playlist.belongsTo(models.Mood, {
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
     
    return playlist;
};