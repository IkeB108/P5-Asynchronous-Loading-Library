/*
filesToLoadObject = {
  exampleFile1: ["filepath.png", loadImage, successCallback, failCallback ],
  exampleFile2: [ loadJSON, "filepath.json", successCallback, failCallback ],
  exampleFile3: "filepath.txt"
}

dumpObject = {...} // Optional: Object that loaded files will be bound to (defaults to window so that they are global variables)
hideAutofills = false // Optional: if true, auto-filled files will not be logged to console
*/
function FileLoader( filesToLoadObject, dumpObject = window, hideAutofills ){
  this.successCount = 0;
  this.failCount = 0;
  this.progress = 0;
  this.completion =  Object.keys(filesToLoadObject).length ;
  if(this.completion == 0)this.complete = true;
  else this.complete = false;
  
  let thisCopy = this;
  let defaultSuccessCallback = () => {
    
  };
  let defaultFailCallback = (e) => {
    console.error(e)
  };
  
  let _checkForCompletion = function() {
    if(thisCopy.progress == thisCopy.completion){
      thisCopy.complete = true;
      if(typeof onLoadComplete === "function")onLoadComplete();
    }
  }
  
  let _autoDetectLoaderLog = 'Autodetected files:\n';
  
  let _primarySuccessCallback = function( e, fileSuccessCallback ){
    thisCopy.successCount ++;
    thisCopy.progress ++
    fileSuccessCallback(e);
    _checkForCompletion();
  }
  let _primaryFailCallback = function( e, fileFailCallback, fileName ){
    console.warn("FAILED TO LOAD FILE " + fileName)
    thisCopy.progress ++
    fileFailCallback(e);
    _checkForCompletion();
  }
  let _filesList = {};
  
  for(i in filesToLoadObject){
    let f = filesToLoadObject[i];
    
    let thisFileName = null;
    let thisFileSuccessCallback = null;
    let thisFileFailCallback = null;
    let thisLoader = null;
    
    if(typeof f == "string"){
      thisFileName = f;
    }
    if(typeof f == "object"){ //assume it's an array
      let ordered_f = f.itemsThatMeet([
        (n)=>{return typeof n == "string"},
        (n)=>{return typeof n == "function" && n.name == "bound "},
      ], true) //ike.js
      
      let fCopy = [...f]
      let index_of_loader = ordered_f[1];
      if(index_of_loader !== null){
        thisLoader = f[index_of_loader]
        fCopy.splice(index_of_loader, 1)
      }
      for(let i of fCopy){
        if(typeof i == "string")thisFileName = i;
        if(typeof i == "function"){
          if(thisFileSuccessCallback == null)
          thisFileSuccessCallback = i; //assume successCallback comes before failCallback
          else
          thisFileFailCallback = i;
        }
      }
    }
    
    if(thisFileName == null){
      thisFileName = "NameNotProvided.txt";
      thisLoader = loadStrings
      console.error("File path for " + i + " was not provided.")
    }
    if(thisLoader == null){
      let thisFileExtension = thisFileName.split('.')
      thisFileExtension = thisFileExtension[thisFileExtension.length - 1]
      let fileExtensionKey = {
        Image: "jpg jpeg png gif webp tiff psd raw bmp heif indd svg ai eps pdf",
        Font: "otf ttf",
        Model: "obj stl",
        Shader: "vert frag",
        "JSON": "json",
        Table: "csv ods",
        "XML": "docx xlsx pptx doc xls ppt docm xlsm pptm",
        Strings: "txt",
        Sound: "mp3 wav ogg"
      }
      for(j in fileExtensionKey){
        if( fileExtensionKey[j].includes(thisFileExtension) ){
          let loaderFunctionName = "load" + j
          // console.log("Loader function for " + thisFileName + " was not specified; " + loaderFunctionName + " will be used")
          _autoDetectLoaderLog += thisFileName + " => " + loaderFunctionName + "\n"
          thisLoader = window[loaderFunctionName]
        }
      }
      if(thisLoader === null){ //If file type still unknown, use loadBytes()
        _autoDetectLoaderLog += thisFileName + " => loadBytes (unknown filetype)\n"
        thisLoader = loadBytes
      }
    }
    if(thisFileSuccessCallback == null)thisFileSuccessCallback = defaultSuccessCallback;
    if(thisFileFailCallback == null)thisFileFailCallback = defaultFailCallback;
    
    _filesList[i] = {
      fileName: thisFileName,
      loader: thisLoader,
      successCallback: thisFileSuccessCallback,
      failCallback: thisFileFailCallback
    }
    
  }
  for(let fileName in _filesList){
    let f = _filesList[fileName]
    dumpObject[fileName] = f.loader(
      f.fileName,
      (e) => _primarySuccessCallback(e, f.successCallback) ,
      (e) => _primaryFailCallback(e, f.failCallback, f.fileName)
    )
  }
  if(_autoDetectLoaderLog !== "Autodetected files:\n" && !hideAutofills)
  console.log(_autoDetectLoaderLog)
}
