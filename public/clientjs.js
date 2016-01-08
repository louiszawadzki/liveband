(function(window) {
	//set audio context
	audioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
	context = new audioContext();	

	// Stream node
	var streamNode = context.createMediaStreamDestination();

    // Global volume
    var globalVolumeNode = context.createGain();
    globalVolumeNode.connect(context.destination);
    globalVolumeNode.connect(streamNode);

    var volumeField = document.getElementById("globalVolumeField")
    volumeField.setAttribute("type", "number");
    volumeField.setAttribute("min", "0");
    volumeField.setAttribute("max", "100");
    volumeField.setAttribute("value", 100);
    volumeField.onchange = function(e){
        globalVolumeNode.gain.value = this.value/100;
    };
	
	//P2P part
    var peer = new Peer({host: window.location.hostname, port: 8081, path :'/peerjs'});
    peer.on('open', function(id) {
    	console.log('My id is ' + id);
    });
    peer.on('call', function(call){
    	call.answer(streamNode.stream);
    	streamPeer(call, context);
    	console.log('call successful!')
    })
	
	// function for the button that triggers the call
	document.getElementById('call').onclick = function(){
		var callid = document.getElementById('callto').value;
		var call = peer.call(callid, streamNode.stream);
		
		streamPeer(call, context);
	};


    addSynth = document.getElementById("addSynth");
    addSynth.onclick = function(){createOscillator(600, context, globalVolumeNode,40)};


    var createOscillator = function (frequency, acontext, dest, gainValue) {
        var osc = acontext.createOscillator();
        var gain = acontext.createGain();
        osc.frequency.value = frequency;
        gain.gain.value = gainValue/100;
        osc.connect(gain);
        gain.connect(dest);
        
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

        var volumeField = document.createElement("input")
        volumeField.setAttribute("type", "number");
        volumeField.setAttribute("min", "0");
        volumeField.setAttribute("max", "100");
        volumeField.setAttribute("value", gainValue);
        volumeField.onchange = function(e){
            gain.gain.value = this.value/100;
        };

        synth.appendChild(frequencyField);
        synth.appendChild(volumeField);
        synthRack.appendChild(synth);
    }


	var streamPeer = function(call, acontext){
		// Initiate existing calls array
		if (!window.exisitingCalls){
			window.existingCalls = [];
		}
		
		//
		call.on('stream', function(stream){
			var audioStream = acontext.createMediaStreamSource(stream);
			audioStream.connect(acontext.destination);
		});
		
		window.existingCalls.push(call);
	}
})(this);
