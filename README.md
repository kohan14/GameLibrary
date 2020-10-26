# Game Library
## Table of contents
* [General info](#general-info)
* [Features](#features)
* [Technologies](#technologies)
* [Setup](#setup)

## General info
This projects let you search through one of the biggest databases there are about video games and make your own library of games.
All the data is provided by RAWG Video Game Database which is stored in your browser's local memory. During development i've used tools like FETCH, or HTML5 Canvas to make vivid, colorfull and nice looking UI for the best user experience.	
## Features
The app can:
* Search game's info through HTTP GET Api call.
* Get the list of platform each game is availble on.
* Provide links to reddit subforum or official website (if the the game api has them, otherwise doesn't show buttons)
* Display games as widgets and store only selective info in memory.
* Style each widget separatively depending on the platform choosen by user.
* Dinamically add and remove elements from the DOM to improve performance (almost no display:none;).
* Convert all images to resized HTML5 canvas object (some api images were way to large to load)

## Technologies
Project was created with:
* JavaScript with some of ES6 features like - destructuring, ES6 classes.
* RAWG Video Games Database API - REST

## Setup
To run this project simply download the repository and click index.html, to preload some games you can click the TEST button

