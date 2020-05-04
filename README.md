# Lyricorder

Your Lyrics and Records made simple.
Main features:
* Lyric Editor with chords highlight
* Built-in player and Recorder
* Environment sounds 
* Rhymes, Dictionary and Mood related words


<img src="images/ApresentationImage.png" width="600"/>

## Summary

This project was created with learning purposes. Was developed years ago while learning Ionic 3 but just recently uploaded.
That means that a lot of things would be done different now, as always. Besides that, a lot of working functionality.

## TODOs

* Authentication: With an authentication system we can provide synchronization funtionality to the user if using multiple devices. PouchDB was chosed for the synchronization hability.
* Add more options during edition like having a Chord selector helper.
* Folders creation.



### Installing

```
npm install
```


## Deployment

For browser deployment. (audio recording not available)

```
ionic serve
```

For mobile deployment. 
```
ionic cordova build android --prod
```
Never deployed it for iOS but i believe Ionic will handle it just right.


## Built With

* [Ionic 3](https://ionicframework.com/) 
* [Angular 4](https://angular.io/) 
* [PouchDB](https://pouchdb.com/)
* [RecordRTC](https://recordrtc.org/)
* [wavesurfer.js](https://wavesurfer-js.org/)


## Features

Main screen

<img src="images/MainScreen.png" />

Built-in player for last recorded file

<img src="images/MainScreenWithPlayer.png" width="300"/>

Filtering and Ordering options

<img src="images/Filter.png" width="400"/>

Lyric View mode

<img src="images/LyricEditor.png" width="300"/>

Options Menu  |  Text Options | Scroll Options
:-------------------------:|:-------------------------:|:-------------------------:
<img src="images/OptionsMenu.png" width="200"/>  | <img src="images/TextOptions.png" width="200"/> | <img src="images/ScrollOptions.png" width="200"/>


Lyric Edit mode - To define a chord use between curly brackets. Eg: {Am}

<img src="images/LyricEditorEditing.png" width="400"/>


Built-in player and recorder

<img src="images/LyricEditorWithPlayer.png" width="300"/>

Records List

<img src="images/RecordsList.png" width="300"/>

Song Properties tab - Tunning, Capo, Speed and Mood

<img src="images/SongProperties.png" width="300"/>

Ideas Tab - Feeling related words 

<img src="images/Ideas.png" width="300"/>

Ideas Tab - Rhymes - Find rhymes for a specific word

<img src="images/Rhymes.png" width="300"/>

Ideas Tab - Favorites - All the words can be favourited and will appear here

<img src="images/FavouriteWords.png" width="300"/>

Environment Sounds - Set relaxing sounds that will keep playing while you write and record

<img src="images/EnvironmentSounds.png" width="300"/>

Side Screen

<img src="images/SideScreen.png" width="300"/>

Trash - The lyrics will be permanently deleted after the defined period on settings 

<img src="images/Trash.png" width="300"/>

Settings

<img src="images/Settings.png" width="300"/>

