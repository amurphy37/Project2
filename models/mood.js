module.exports = function (sequelize, DataTypes) {
    var Mood = sequelize.define("Mood", {
        // Giving Mood id as primary key and name as string
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 30]
            }
        }
    });

    Mood.associate = function (models) {
        Mood.hasMany(models.Playlist)
    };

    return Mood;
}