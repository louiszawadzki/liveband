(function(window) {
	var BUFFER_SIZE = 1024;
	var client = new Peer('idd', {host: 'localhost', port: '9001'});
	client.on('open', function(){
		// create stream
		window.Stream = client.createStream();
		//set audio context
		audioContext = window.AudioContext || window.webkitAudioContext;
		context = new audioContext();	

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
		recorder.connect(context.destination);

        addSynth = document.getElementById("addSynth");
        addSynth.onclick = function(){createOscillator(600, context, recorder)};
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

    createOscillator = function (frequency, acontext, parentNode) {
        var osc = acontext.createOscillator();
        osc.frequency.value = frequency;
        osc.connect(parentNode);
        osc.start();

        var synthRack = document.getElementById("synthRack");
        var synth = document.createElement("div");
        synth.className = "synth";

        var frequencyField = document.createElement("input")
        frequencyField.setAttribute("type", "number");
        frequencyField.setAttribute("min", "100");
        frequencyField.setAttribute("max", "1200");
        frequencyField.setAttribute("value", frequency);

        frequencyField.onchange = function(e){
            osc.frequency.value = this.value;
        };
        synth.appendChild(frequencyField);
        synthRack.appendChild(synth);
        
    }

})(this);
