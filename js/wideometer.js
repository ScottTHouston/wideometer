var pageCanvas = document.getElementById("canvas");
pageCanvas.width  = window.innerWidth;
pageCanvas.height = window.innerHeight;

const client = new tmi.Client({
	connection: {
		secure: true,
		reconnect: true
	},
	channels: [ 'majink' ]
});

var block = false;

client.connect();

client.on('message', (channel, tags, message, self) => {
    if(self || message[0] !== '!') {
        return;
    }
    let params = message.slice(1).split(' ');
    let command = params.shift().toLowerCase();
    if(command === 'wom') {
        var input = message.split(' ')[1];

        if (input == ('' || null)) {
            console.log(`Invalid !wom command received : Please use '!wom [1-100]' or '!wom reset'.`);
        }

        if (input === 'reset') {
            reset();
        }
        if (Number.isInteger(+input) && input > 0 && input < 101) {
            setWide(input);
        }

        function reset(){
            document.getElementById("fill1").setAttribute("wideData", "0");
            document.getElementById("cont").classList.remove("shake");
            document.getElementById("wom").classList.remove("critical");
            document.getElementById("glass").classList.remove("crack");
            $('.particles').removeClass("particle");
            console.log(`Wom reset`);
        }

        function setWide(input){
            document.getElementById("fill1").setAttribute("wideData", input);
            if (input >= 90) {
                document.getElementById("cont").classList.add("shake");
                document.getElementById("wom").classList.add("critical");
                document.getElementById("glass").classList.add("crack");
                $('.particles').addClass('particle');
            }
            else {
                document.getElementById("cont").classList.remove("shake");
                document.getElementById("wom").classList.remove("critical");
                document.getElementById("glass").classList.remove("crack");
                $('.particles').removeClass("particle");
            }
        }

        function hsl_col_perc(percent, start, end) {
            var a = percent / 100,
                b = (end - start) * a,
                c = b + start;
            return 'hsl('+c+', 60%, 50%)';
        }
        
        var per = document.getElementById("fill1").getAttribute("wideData");
        document.getElementById("fill1").style.width = per + "%";
        var margins =  (100 - per) / 2;
        document.getElementById("fill1").style.marginLeft = margins + "%";
        document.getElementById("fill1").style.marginRight = margins + "%";     
        let colour = hsl_col_perc(per, 120, 0);
        document.getElementById("fill1").style.backgroundColor = colour;
        document.getElementById("wom").innerText = per + "%";
        console.log(`Wom set to ` + per);

        block = true;
          setTimeout(() => {
              block = false;
          }, (60 * 1000));
    
    }
});