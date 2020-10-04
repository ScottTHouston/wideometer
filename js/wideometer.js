//var womData = document.getElementById("fill1").getAttribute("wideData");

const client = new tmi.Client({
	connection: {
		secure: true,
		reconnect: true
	},
	channels: [ 'majink' ]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
    //console.log(`${tags['display-name']}: ${message}`);
    if(self || message[0] !== '!') {
        return;
    }
    let params = message.slice(1).split(' ');
    let command = params.shift().toLowerCase();
    if(command === 'wom') {
        var input = message.split(' ')[1];

        if (input === '' || null) {
            console.log(`Wom command received`);
        }

        if (input === 'reset') {
            document.getElementById("fill1").setAttribute("wideData", '10')
            console.log(`Wom reset`);
        }
        if (Number.isInteger(+input)) {
            document.getElementById("fill1").setAttribute("wideData", input)
            document.getElementById("fill1").style.width = input;
            var margins =  (100 - input) / 2;
            document.getElementById("fill1").style.marginLeft = margins;
            document.getElementById("fill1").style.marginRight = margins;
            console.log(`Wom set to` + input);
        }
        if (input === 'critical') {
            //do the thing
            console.log(`wom is critical!`);
        }
    }
});

