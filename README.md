# P5 Asynchronous Loading Library
A simple Javascript library for P5JS that makes asynchronous loading easy and seemless.
## Example usage
```javascript
function setup(){
  
  let filesToLoad = {
    sunsetPicture: "sunset.png", //A global variable called sunsetPicture will be created
    oceanPicture: "ocean.png", //FileLoader autodetects this is an image
    oceanWavesSound: "sounds/ocean.mp3", //FileLoader autodetects this is a sound file
  }
  
  let dumpObject = window; //when set to window, sunsetPicture, oceanPicture, and 
                           //oceanWavesSound will be global variables
  
  let hideAutoFillLogs = false;
  
  myFileLoader = new FileLoader(filesToLoad, dumpObject, hideAutoFillLogs)
  
}

function onLoadComplete(){
  console.log("All files have finished loading")
  console.log("Sunset picture width:" + sunsetPicture.width )
  console.log("Sunset picture height:" + sunsetPicture.height )
  oceanWavesSound.play();
}

function draw(){
  background(0)
  
  if(myLoader.complete){
    image(sunsetPicture, 0, 0)
    image(oceanPicture, 200, 0)
  }
  if(!myLoader.complete){
    fill(255);
    text("Loading...", 100, 100)
  }
  
}
```
## How to Use
### Syntax
```javascript
myFileLoader = new FileLoader(filesToLoad, [dumpObject], [hideAutoFillLogs])
```
### Parameters
`filesToLoad`

Object where each property is a file to load. Each property can either be a string containing the filepath or an array of settings for loading the file:
```javascript
filesToLoad = {
  myFile: "filepath_here",
  myFile2: ["filepath_here", loadFunctionToUse, successCallback, failCallback],
  //everything in the above array is optional (except for the filepath) and can be in any order
  myFileExample: ["assets/data/weather.html", loadStrings, weatherLoaded, weatherFailedToLoad]
  
}
```
If the fileLoader is not told which of p5's load functions to use (e.g. loadImage, loadSound, loadJSON) then it will guess based on the file extension (see [this chart](https://github.com/IkeB108/P5-Asyncronous-Loading-Library/blob/main/fileExtensionsMapping.txt)). If the file extension is unfamiliar, it will use `loadBytes`.
`dumpObject` (optional)

The object in which you would like the loaded images/sounds/etc to be stored. Default is `window` (making the images/sounds/etc global variables).

`hideAutoFillLogs` (optional)

Boolean. When true, FileLoader will not log a message to the console when it autodetects file types for you. Default is `false`.
