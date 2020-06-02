module.exports = function (sequelize, DataTypes) {
    var Artist = sequelize.define("Artist", {
        // Giving artist id as primary key and name as string
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 30]
            }
        }
    });

    Artist.associate = function (models) {
        Artist.hasMany(models.Album)
    };

    return Artist;
}