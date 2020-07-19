// Creating our genre model to store genres of songs in database as its own table

module.exports = function(sequelize, DataTypes) {
    var Genre = sequelize.define("Genre", {
        // Giving genre id as primary key and name as string
        name: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1, 30]
            }
        } 
    });

    // Creating a one-to-many relationship between genre and tracks. Each track has one genre, and one genre can have many tracks.

    Genre.associate = function (models) {
        Genre.hasMany(models.Track)
    };

    return Genre;
}