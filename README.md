# NextTrackUp

Communal playlist platform for users to collaborate on playlists, upvote songs based on fit with a mood and listen to playlist tracks on the go.

![Alt text](./public/images/HomeScreen.png?raw=true "NextTrackUp Landing Page")

**Deployed Application:** (https://nexttrackup.herokuapp.com/)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Please ensure all of the following prerequisites are installed on your local development machine:

* Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.

* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.

* MySQL - [Download & Install MySQL](https://dev.mysql.com/downloads/installer/), and make sure it's running on the default port (27017).

### Download

There are two ways you can get the code:

### Cloning The GitHub Repository
The recommended way to get NextTrackUp is to use git to directly clone the NextTrackUp repository:

```bash
$ git clone https://github.com/amurphy37/Project2.git NextTrackUp
```

This will clone the latest version of the NextTrackUp repository to a **NextTrackUp** folder.

### Downloading The Repository Zip File
Another way to use the NextTrackUp code is to download a zip copy from the [master branch on GitHub](https://github.com/amurphy37/Project2/archive/master.zip). You can also do this using the `wget` command:

```bash
$ wget https://github.com/amurphy37/Project2/archive/master.zip -O nexttrackup.zip; unzip nexttrackup.zip; rm nexttrackup.zip
```

Don't forget to rename after your project name.

### Install

Once you've downloaded and installed prerequisites, you're ready to begin install process. 

The project comes pre-bundled with a `package.json`file that contains the list of modules you'll need to run the application.

To install dependencies, run this in the application folder from the command-line:

```bash
$ npm install
```
This command does a few things:
* First it will install the dependencies needed for the application to run.
* If you're running in a development environment, it will then also install development dependencies needed for testing and running your application.
* To update these packages later on, just run `npm update`

## Running The Application

Run the application using npm:

```bash
$ npm start
```

Your application should run on port 8080 with the *development* environment configuration, so in your browser just go to [http://localhost:8080](http://localhost:8080)

## Running the tests

```bash
$ npm test
```

## Built With

* [Handlebars.js](https://nodejs.org/en/docs/) - Front-end Template Rendering Service
* [Node.js](https://nodejs.org/en/docs/) - The Server-Side Library Used
* [Express](https://expressjs.com/) - Server Routing technology
* [Sequelize](https://sequelize.org/) - MySQL ORM

## Team

* **Andrew Murphy**
* **Stephen Settle**
* **Ryan Hashier**
* **Sedat Atakan**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

