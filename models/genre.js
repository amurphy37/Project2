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

    Genre.associate = function (models) {
        Genre.hasMany(models.Track)
    };

    return Genre;
}