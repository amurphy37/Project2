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