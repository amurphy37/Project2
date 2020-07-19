// Config.js file to set up the connection to our MySQL database with our three environments: Development, Test and Production 
module.exports = {
    "development": {
        "username": "root",
            "password": "password",
                "database": "playlist_db",
                    "host": "127.0.0.1",
                        "port": 3306,
                            "dialect": "mysql"
    },
    "test": {
        "username": "root",
            "password": "password",
                "database": "playlist_db_test",
                    "host": "127.0.0.1",
                        "port": 3306,
                            "dialect": "mysql"
    },
    "production": {
        "use_env_variable": "JAWSDB_URL",
        "dialect": "mysql"
    }
}