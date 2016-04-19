// fork getUserMedia for multiple browser versions, for those
// that need prefixes

navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);

// set up forked web audio context, for multiple browsers
// window. is needed otherwise Safari explodes

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var voiceSelect = document.getElementById("voice");
var source;
var stream;

// grab the mute button to use below

var mute = document.querySelector('.mute');

//set up the different audio nodes we will use for the app

var analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;

var distortion = audioCtx.createWaveShaper();
var gainNode = audioCtx.createGain();
var biquadFilter = audioCtx.createBiquadFilter();
var convolver = audioCtx.createConvolver();

// distortion curve for the waveshaper, thanks to Kevin Ennis
// http://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion

// function Classifier(templates,dist,gap){

//     var self=this;
//     // self.algo=alg;
//     self.dist=dist;
//     self.tmp=templates||[];
//     self.stream=[];
//     self.labels={}
//     self.odds={};
//     // self.win=self.tmp[0].length+100;
//     self.gap=gap || 1;
//     self.gap_counter=0;
//     self.sample = function(el){

//         if((self.stream.length)&&(self.stream.length!=0)&&(self.win==self.stream.length)){
//             self.stream.shift();

//         };
//         self.stream.push(el);
//         self.gap_counter=self.gap_counter+1;

//         if(self.gap_counter==self.gap && (self.win>=self.stream.length)){
//             self.odds=new Object({});
//             for(var ex=0; ex<self.tmp.length; ex++){
//                 self.odds[ex]=self.algo(self.tmp[ex], self.stream, self.dist)[0];
//             }
//             max = argmax(Object.keys(self.odds).map(function ( key ) { return self.odds[key] }));
//             console.log("Most Likely: "+max+", "+self.odds[max]);
//             self.gap_counter=0;
//         }

//     }
//     self.record = function(label,frame_size,data){
//         if(!data)return -1;
//         if(!self.labels[label])self.labels[label]=[];
//         if((self.labels[label].length)&&(self.labels[label].length!=0)&&(frame_size==self.labels[label].length)){
//             self.labels[label].shift();
//         };

//         if(self.labels[label]){
//             self.labels[label].push(data)
//         }

//     }

//     return this;
// }
// var DTWClass=new Classifier();


// window.DTWClass=DTWClass;
function makeDistortionCurve(amount) {
  var k = typeof amount === 'number' ? amount : 50,
    n_samples = 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    i = 0,
    x;
  for ( ; i < n_samples; ++i ) {
    x = i * 2 / n_samples - 1;
    curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
  }
  return curve;
};

// grab audio track via XHR for convolver node

// function loadAudio(url, vol){
//   var audio = new Audio();
//   audio.src = url;
//   audio.preload = "auto";
//   audio.volume = vol;
//   $(audio).on("loadeddata", ajaxRequest.onload);  // jQuery checking
//   return audio;
// }

var soundSource, concertHallBuffer;

// ajaxRequest = new XMLHttpRequest();

// ajaxRequest.open('GET', './concert-crowd.ogg', true);

// ajaxRequest.responseType = 'arraybuffer';


// ajaxRequest.onload = function() {
//   console.log(arguments);
//   var audioData = ajaxRequest.response;

//   audioCtx.decodeAudioData(audioData, function(buffer) {
//       concertHallBuffer = buffer;
//       soundSource = audioCtx.createBufferSource();
//       soundSource.buffer = concertHallBuffer;
//     }, function(e){"Error with decoding audio data" + e.err});

  //soundSource.connect(audioCtx.destination);
  //soundSource.loop = true;
  //soundSource.start();
// }

// ajaxRequest.send();

// set up canvas context for visualizer

var canvas = document.querySelector('.visualizer');
var canvasCtx = canvas.getContext("2d");

var intendedWidth = document.querySelector('.wrapper').clientWidth;

canvas.setAttribute('width',intendedWidth);

var visualSelect = document.getElementById("visual");
var drawVisual;
var countz=0;
//main block for doing the audio recording

if (navigator.getUserMedia) {
   console.log('getUserMedia supported.');
   navigator.getUserMedia (
      // constraints - only audio needed for this app
      {
         audio: true
      },

      // Success callback
      function(stream) {
         source = audioCtx.createMediaStreamSource(stream);
         source.connect(analyser);
         analyser.connect(distortion);
         distortion.connect(biquadFilter);
         biquadFilter.connect(convolver);
         convolver.connect(gainNode);
         gainNode.connect(audioCtx.destination);

      	 visualize();
         voiceChange();

      },

      // Error callback
      function(err) {
         console.log('The following gUM error occured: ' + err);
      }
   );
} else {
   console.log('getUserMedia not supported on your browser!');
}

function visualize() {
  WIDTH = canvas.width;
  HEIGHT = canvas.height;


  var visualSetting = visualSelect.value;

  console.log(visualSetting);

  if(visualSetting == "sinewave") {
    DTWClass.frame_size=fft_size;
    analyser.fftSize = fft_size;
    var bufferLength = analyser.fftSize;
    console.log(bufferLength);
    var dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    function draw() {

      drawVisual = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

      canvasCtx.beginPath();

      var sliceWidth = WIDTH * 1.0 / bufferLength;
      var x = 0;

      for(var i = 0; i < bufferLength; i++) {
   
        var v = dataArray[i] / 128.0;
        var y = v * HEIGHT/2;
        DTWClass.stream_record(y);
        if(i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height/2);
      canvasCtx.stroke();
    };

    draw();

  } else if(visualSetting == "frequencybars") {

    DTWClass.frame_size=fft_size;
    analyser.fftSize = fft_size;
    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);
    var dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    function draw() {
      drawVisual = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = 'rgb(0, 0, 0)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      var barWidth = (WIDTH / bufferLength) * 2.5;
      var barHeight;
      var x = 0;
      var arr=[];
      for(var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
        canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);
        // DTWClass.stream_record(barHeight);
        x += barWidth + 1;

        DTWClass.tmp[i]=barHeight;
        if(DTWClass.background &&DTWClass.background[i]){
            // console.log('Back',DTWClass.background[i]);
          DTWClass.tmp[i]=DTWClass.tmp[i]-DTWClass.background[i];}
        // arr.push(barHeight);
      }
      // window.kat=dataArray;
      // if(countz%3==0){

      //   DTWClass.record( cur_lab, arr);
      // }else{
      //   countz+=1;
      // }
    };

    draw();

  } else if(visualSetting == "off") {
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    canvasCtx.fillStyle = "red";
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
  }

}

function voiceChange() {
  
  distortion.oversample = '4x';
  biquadFilter.gain.value = 0;
  convolver.buffer = undefined;

  var voiceSetting = voiceSelect.value;
  console.log(voiceSetting);

  if(voiceSetting == "distortion") {
    distortion.curve = makeDistortionCurve(400);
  } else if(voiceSetting == "convolver") {
    convolver.buffer = concertHallBuffer;
  } else if(voiceSetting == "biquad") {
    biquadFilter.type = "lowshelf";
    biquadFilter.frequency.value = 1000;
    biquadFilter.gain.value = 25;
  } else if(voiceSetting == "off") {
    console.log("Voice settings turned off");
  }

}

// event listeners to change visualize and voice settings
visualSelect.onchange = function() {
  window.cancelAnimationFrame(drawVisual);
  visualize();
}

var loopSelect = document.getElementById("looper");
var loopSetting = loopSelect.value;
var loopFreq=2;
var timeID=0;
loopSelect.onchange = function() {
  if(timeID!=0){clearInterval( timeID )};
  loopSetting = loopSelect.value;
  loopFreq=parseInt(loopSetting);
  console.log('LOOP',loopSetting,loopFreq);
  if(loopFreq<0){
    console.log('Loop Off');

  }else{
    console.log('Loop On: ',loopFreq);
    timeID=setInterval( "DTWClass.classify()", loopFreq*1000 );
  }
  // visualize();
}
var frameSelect = document.getElementById("fft_size");
var frameSetting = frameSelect.value;
var fft_size=256;

frameSelect.onchange = function() {
  frameSetting = frameSelect.value;
  fft_size=parseInt(frameSetting);
  // console.log('LOOP',frameSetting,fft_size);
  // visualize();
}


voiceSelect.onchange = function() {
  voiceChange();
}

mute.onclick = voiceMute;

function voiceMute() {
  if(mute.id == "") {
    gainNode.gain.value = 0;
    mute.id = "activated";
    mute.innerHTML = "Unmute";
  } else {
    gainNode.gain.value = 1;
    mute.id = "";    
    mute.innerHTML = "Mute";
  }
}

function RenderNodes(data,best){
  console.log('DAT',data);
  document.getElementById("ml-labels").innerHTML=(data.map(function(o){return '<div class="ml-label'+(''+o.label.replace('Digit','')==window.cur_lab.replace('Digit','') ? ' selected' : '')+'"><span class="ml-name">Pattern '+o.label+'<p class="ml-value '+(o.p==best.p ? ' best' : '')+'">'+o.p+'</p></span></div>'}).join(''));
}
window.RenderNodes=RenderNodes;