/*!
 *  Howler.js 3D Sound Demo
 *  howlerjs.com
 *
 *  (c) 2013-2019, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

'use strict';

/**
 * Setup and control all of the game's audio.
 */

let usersound = new Howl({
  src: ['./assets/test.m4a'],

})

let speaker2sound = new Howl({
  src: ['./assets/speaker2.mp3'],

})


let forestsound = new Howl({
  src: ['./assets/black.mp3'],

})



let selectBtn = document.getElementById('selectbtn');
let musicBtn = document.getElementById('musicbtn');
let effectBtn = document.getElementById('effectbtn');

let rainplay = true;
let musicplay = false;
let effectplay = true;
document.getElementById("choose").style.color = "white";


selectBtn.onclick = function () {

  if (rainplay == true)
    rainplay = false;
  else
    rainplay = true;

}

musicBtn.onclick = function () {

  if (musicplay == false) {
    musicplay = true;
    usersound.play();
    speaker2sound.play();

  }

  else {
    musicplay = false;
    speaker2sound.pause();
    usersound.pause();

  }


}



document.addEventListener("click", printMousePos);

var Sound = function () {
  // Setup the shared Howl.
  this.sound = new Howl({
    src: ['./assets/sprite.webm', './assets/sprite.mp3'],
    sprite: {
      lightning: [2000, 4147],
      rain: [8000, 9962, true],
      thunder: [19000, 13858],
      music: [34000, 31994, true]
    },
    volume: 0
  });



  // Begin playing background sounds.

  this.rain();

  this.thunder();

};
Sound.prototype = {
  /**
   * Play a rain loop in the background.
   */
  rain: function () {
    this._rain = this.sound.play('rain');

    this.sound.volume(0.01, this._rain);


  },

  /**
   * Randomly play thunder sounds periodically.
   */
  thunder: function () {
    setTimeout(function () {
      // Play the thunder sound in a random position.
      var x = Math.round(100 * (2 - (Math.random() * 4))) / 100;
      var y = Math.round(100 * (2 - (Math.random() * 4))) / 100;
      this._thunder = this.sound.play('thunder');

      this.sound.pos(x, y, -0.5, this._thunder);
      if (rainplay == true)
        this.sound.volume(1.0, this._thunder);
      else if (rainplay == false)
        this.sound.volume(0.0, this._thunder);

      // Schedule the next clap.
      this.thunder();
    }.bind(this), 5000 + Math.round(Math.random() * 15000));
  },

  /**
   * Play lightning in a random location with a random rate/pitch.
   */
  lightning: function () {
    var x = Math.round(100 * (2.5 - (Math.random() * 5))) / 100;
    var y = Math.round(100 * (2.5 - (Math.random() * 5))) / 100;
    var rate = Math.round(100 * (0.4 + (Math.random() * 1.25))) / 100;

    // Play the lightning sound.

    var id = this.sound.play('lightning');

    // Change the position and rate.
    this.sound.pos(x, y, -0.5, id);
    this.sound.rate(rate, id);
    if (rainplay == true)
      this.sound.volume(1.0, id);
    else if (rainplay == false)
      this.sound.volume(0.0, id);
  },

  /**
   * Setup a speaker in 3D space to play music from.
   * @param  {Number} x x-tile position of speaker.
   * @param  {Number} y y-tile position of speaker.
   */

  /*
 speaker: function (x, y) {
   var soundId = game.audio.sound.play('music');
   this.sound.once('play', function () {
     // Set the position of the speaker in 3D space.
     this.sound.pos(x + 0.5, y + 0.5, -0.5, soundId);

     this.sound.volume(0.1, soundId);

     // Tweak the attributes to get the desired effect.
     this.sound.pannerAttr({
       panningModel: 'HRTF',
       refDistance: 0.8,
       rolloffFactor: 2.5,
       distanceModel: 'exponential'
     }, soundId);
   }.bind(this), soundId);
 }
 */

  speaker: function (x, y) {
    // usersound.play();

    // Set the position of the speaker in 3D space.
    usersound.pos(x + 0.5, y + 0.5, -0.5);
    usersound.volume(0.2);

    // Tweak the attributes to get the desired effect.
    usersound.pannerAttr({
      coneInnerAngle: 360,
      coneOuterAngle: 360,
      coneOuterGain: 0,
      maxDistance: 10000,
      panningModel: 'HRTF',
      refDistance: 0.8,
      rolloffFactor: 9.0,
      distanceModel: 'exponential'
    });
    if (musicplay == true)
      usersound.play();
    else
      usersound.pause();

  },


  speaker1: function (x, y) {
    var soundId = game.audio.sound.play('music');
    this.sound.once('play', function () {
      // Set the position of the speaker in 3D space.
      this.sound.pos(x + 0.5, y + 0.5, -0.5, soundId);


      this.sound.volume(0.5, soundId);



      // Tweak the attributes to get the desired effect.
      this.sound.pannerAttr({
        panningModel: 'HRTF',
        refDistance: 0.8,
        rolloffFactor: 5.0,
        distanceModel: 'exponential'
      }, soundId);
    }.bind(this), soundId);
  },

  speaker2: function (x, y) {
    // usersound.play();

    // Set the position of the speaker in 3D space.
    speaker2sound.pos(x + 0.5, y + 0.5, -0.5);

    speaker2sound.volume(0.2);

    // Tweak the attributes to get the desired effect.
    speaker2sound.pannerAttr({
      coneInnerAngle: 360,
      coneOuterAngle: 360,
      coneOuterGain: 0,
      maxDistance: 10000,
      panningModel: 'HRTF',
      refDistance: 0.8,
      rolloffFactor: 8.0,
      distanceModel: 'exponential'
    });


  }

};

// Edits mouse click sound
function printMousePos(event) {


  forestsound.pos((event.clientX / 100), (event.clientY / 100), -0.5);
  forestsound.volume(1.0);
  forestsound.play();


}

let selectedReverb = 0;
function myFunction(valueSelected) {
  selectedReverb = valueSelected;
}


// Room effects added to the audio 

// 1) Setup your audio context (once) and extend with Reverb.js.
var audioContext = new (window.AudioContext || window.webkitAudioContext)();
reverbjs.extend(audioContext);



var sourceNode = null;




effectBtn.onclick = function () {

  // 2) Load the impulse response; upon load, connect it to the audio output.
  if (selectedReverb == 0) {

    var reverbUrl = "http://reverbjs.org/Library/ElvedenHallMarbleHall.m4a";
    var reverbNode = audioContext.createReverbFromUrl(reverbUrl, function () {
      reverbNode.connect(audioContext.destination);
    });
  }

  else if (selectedReverb == 1) {
    var reverbUrl = "http://reverbjs.org/Library/Basement.m4a";
    var reverbNode = audioContext.createReverbFromUrl(reverbUrl, function () {
      reverbNode.connect(audioContext.destination);
    });
  }

  else if (selectedReverb == 2) {
    var reverbUrl = "http://reverbjs.org/Library/R1NuclearReactorHall.m4a";
    var reverbNode = audioContext.createReverbFromUrl(reverbUrl, function () {
      reverbNode.connect(audioContext.destination);
    });
  }



  // 3) Load a test sound; upon load, connect it to the reverb node.



  if (effectplay == true) {

    sourceNode = audioContext.createSourceFromUrl(speaker2sound._src, function () {
      sourceNode.connect(reverbNode);
    });
    sourceNode.start();
    effectplay = false
  }
  else {
    sourceNode.disconnect();
    sourceNode.stop(0);
    sourceNode = null;
    //console.log(sourceNode)
    effectplay = true;
  }


}

