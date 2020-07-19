// Sequelize model for creating albums in our database
module.exports = function (sequelize, DataTypes) {
    var Album = sequelize.define("Album", {
        // Giving artist id as primary key and name as string
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 30]
            }
        }
    });

    // Setting up a one-to-many relationship between albums and tracks. One album can have many tracks
    // Joining tables on album.id = track.AlbumId

    Album.associate = function (models) {
        Album.hasMany(models.Track);

        Album.belongsTo(models.Artist, {
            foreignKey: {
                allowNull: false
            }
        })
        
    }

    return Album;
}