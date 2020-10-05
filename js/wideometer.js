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

        if (input == ('' || null)) {
            console.log(`Wom command received`);
        }

        if (input === 'reset') {
            document.getElementById("fill1").setAttribute("wideData", "0");
            console.log(`Wom reset`);
        }
        if (Number.isInteger(+input) && input > 0 && input < 101) {
            document.getElementById("fill1").setAttribute("wideData", input)
            console.log(`Wom set to` + input);
        }
        if (input === 'critical') {
            //do the thing
            console.log(`wom is critical!`);
        }

        // Looking to implement color gradient change from green -> yellow -> orange -> red depending on percentage breaks.
        var per = document.getElementById("fill1").getAttribute("wideData");
        console.log(per);
        document.getElementById("fill1").style.width = per + "%";
        var margins =  (100 - per) / 2;
        document.getElementById("fill1").style.marginLeft = margins + "%";
        document.getElementById("fill1").style.marginRight = margins + "%";
        document.getElementById("wom").innerText = per + "%";
        console.log(`Wom set to ` + per);
    }
});
