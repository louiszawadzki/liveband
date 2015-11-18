(function(window) {
	//set audio context
	audioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
	context = new audioContext();	

	// Stream node
	var streamNode = context.createMediaStreamDestination();
	var dest       = context.destination;
	
	//P2P part
    var peer = new Peer({host: 'localhost', port: 8081, path :'/peerjs'});
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
    addSynth.onclick = function(){createOscillator(600, context, {dest, streamNode})};


    var createOscillator = function (frequency, acontext, connections) {
        var osc = acontext.createOscillator();
        osc.frequency.value = frequency;
        for (var node=0; node < connections.length; node++){
        	osc.connect(connections[node]);
        }
        
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
