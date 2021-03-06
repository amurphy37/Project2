// Creating our track model to store and update tracks in our database.
module.exports = function (sequelize, DataTypes) {
    var Track = sequelize.define("Track", {
        // Giving the track model a name of type STRING
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 30]
            }
        }, 
        youTubeVidId: {
            type: DataTypes.STRING,
            
        },
        artworkUrl30: {
            type: DataTypes.STRING, 
            allowNull: true
        },
        artworkUrl60: {
            type: DataTypes.STRING,
            allowNull: true
        },
        artworkUrl100: {
            type: DataTypes.STRING,
            allowNull: true 
        }

    });

    // Associating track swith genres, albums and playlist tracks.
    Track.associate = function (models) {
        // Associating track to a genre
        Track.belongsTo(models.Genre, {
            foreignKey: {
                allowNull: false
            }
        });
    //     // Associating track to album in a many-to-one relationship
        Track.belongsTo(models.Album, {
            foreignKey: {
                allowNull: false
            }
        });
        // Associating track to playlistTrack 
        Track.hasMany(models.PlaylistTrack);
    };
    return Track;
};