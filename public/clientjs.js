(function(window) {
	var BUFFER_SIZE = 1024;
	var client = new BinaryClient('ws://' + window.location.hostname + ':9000');
	client.on('open', function(){
		// create stream
		window.Stream = client.createStream();
		//set audio context
		audioContext = window.AudioContext || window.webkitAudioContext;
		context = new audioContext();	

		/*create random frequency oscillator
		oscillator = context.createOscillator();
		oscillator.frequency.value = 400 + Math.round(Math.random()*1000);
		*/

		// load audio from file
		audio = new Audio();
                audio.src = "1.mp3";
		audioSource = context.createMediaElementSource(audio);
		// create script processor that write the buffer into the channel
  		recorder = context.createScriptProcessor(BUFFER_SIZE, 1, 1);
  		recorder.onaudioprocess = function(e){
            		var left = e.inputBuffer.getChannelData(0);
            		window.Stream.write(left);
                        for (var sample = 0; sample < left.length; sample++) {
                        // make output equal to the same as the input
                                e.outputBuffer.getChannelData(0)[sample] = left[sample];
                        }
                }

		function convertoFloat32ToInt16(buffer) {
      			var l = buffer.length;
      			var buf = new Int16Array(l)

      			while (l--) {
       				 buf[l] = buffer[l]*0xFFFF;    //convert to 16 bit
     			 }
     			 return buf
   		 }


		audioSource.connect(recorder);
		recorder.connect(context.destination);
		//audio.play();
	});

	client.on('stream', function(stream, meta) {
		stream.on('data', function(data) {
		        var source = context.createBufferSource();
		        source.connect(context.destination);
			var audio = new Float32Array(data);
			var audioBuffer = context.createBuffer(1, audio.length, 44100);
			audioBuffer.getChannelData(0).set(audio);
			source.buffer = audioBuffer;
                        source.start();
		});
	});



})(this);
