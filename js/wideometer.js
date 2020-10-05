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
            console.log(`Wom command received`);
        }

        if (input === 'reset') {
            document.getElementById("fill1").setAttribute("wideData", "0");
            document.getElementById("cont").classList.remove("shake");
            document.getElementById("wom").classList.remove("critical");
            document.getElementById("glass").classList.remove("crack");
            console.log(`Wom reset`);
        }
        if (Number.isInteger(+input) && input > 0 && input < 101) {
            document.getElementById("fill1").setAttribute("wideData", input);
            if (input >= 90) {
                document.getElementById("cont").classList.add("shake");
                document.getElementById("wom").classList.add("critical");
                document.getElementById("glass").classList.add("crack");
                Sparks();
            }
            else {
                document.getElementById("cont").classList.remove("shake");
                document.getElementById("wom").classList.remove("critical");
                document.getElementById("glass").classList.remove("crack");
            }
        }
        //if (input === 'critical') {
            //do the thing
        //    console.log(`wom is critical!`);
        //}

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



        //particle animations

        
        //var particles = [];
        var alreadyRendering = false;

        // originally from Rachel Smith on CodePen https://codepen.io/rachsmith/pen/oXBOwg
        /* global particles */
        function sparkShower(startx, starty, sparkWidth, sparkHeight) {
            var canvas = document.getElementById('canvas');
            var ctx = canvas.getContext('2d');
            var width = canvas.width = sparkWidth;
            var height = canvas.height = sparkHeight;
            var colors = ['#000000', '#000000', '#000000'];
            // this is only used for simple gravity
            var gravity = 0.08;
            var particles = [];
            var floor = sparkHeight;
            var currentlySparking = false;
            var maxSize = 10;
            // This is the acceleration of Gravity in m/s.
            var ag = 9.81;
          
            function initParticles() {
              currentlySparking = true;
              for (var i = 0; i < 50; i++) {
                setTimeout(function() {
                  createParticle(i);
                  createParticle(i * 2);
                }, i);
              }
            }
          
            function createParticle(i) {
              // initial position in middle of canvas
              var x = startx;
              var y = starty;
              var z = (Math.random() * 2);
              // randomize the vx and vy a little - but we still want them flying 'up' and 'out'
              var maxex = Math.random() * 20;
              var vx = (Math.random() * maxex) - (maxex / 2);
              var vy = (Math.random() * -20);
              // velocity size?
              var vsize = 0;
              // randomize size and opacity a little & pick a color from our color palette
              var size = 1 + Math.random();
              var color = colors[Math.floor(Math.random() * colors.length)];
              var opacity = 0.5 + Math.random() * 0.5;
              var d = new Date();
              var startTime = d.getTime();
              var p = new Particle(x, y, z, vx, vy, size, vsize, color, opacity, startTime, startTime);
              p.finished = false;
              particles.push(p);
            }
          
            function Particle(x, y, z, vx, vy, size, vsize, color, opacity, startTime, lastTime) {
          
              function reset() {
                opacity = 0;
                this.finished = true;
              }
          
              this.update = function() {
                // if a particle has faded to nothing we can reset it to the starting position
                if (opacity - 0.0005 > 0) opacity -= 0.0005;
                else reset();
                // simple gravity
                //vy += gravity;
                var d = new Date();
                var timeNow = d.getTime();
                // Calculate gravity based on time elapsed since last update in lastTime
                // Pixels per "Meter" = 4735 = 4.7
                // Velocity of Y = Acceleration of Gravity in meters per second * number of seconds since last calc * pixels-per-meter
                if (timeNow > lastTime)
                  vy += (ag * ((timeNow - lastTime) / 1000) * 4.7);
                lastTime = timeNow;
                x += vx;
                y += vy;
                if (y > (floor + 10)) this.finished = true;
                if (size < maxSize) size += vsize * z;
                if ((opacity < 0.5) && (y < floor)) {
                  vsize = 0.55 - opacity;
                } else {
                  vsize = 0;
                }
                // add bouncing off the floor
                if (y > floor) {
                  vy = vy * -0.4;
                  vx = vx * 0.96;
                }
              };
          
              this.draw = function() {
                ctx.globalAlpha = opacity;
                ctx.fillStyle = color;
                //ctx.fillRect(x, y, size, size);
                ctx.beginPath();
                ctx.arc(x, y, size, 0, 2 * Math.PI);
                ctx.fill();
              };
            }
          
            function render() {
              alreadyRendering = true;
              ctx.clearRect(0, 0, width, height);
              for (var i = 0; i < particles.length; i++) {
                if (typeof particles[i] !== "undefined") {
                  if (particles[i].finished === true) {
                    particles.splice(i, 1);
                  } else {
                    particles[i].update();
                    particles[i].draw();
                  }
                }
              }
              requestAnimationFrame(render);
            }
          
            // resize
            window.addEventListener('resize', resize);
          
            function resize() {
              width = canvas.width = window.innerWidth;
              height = canvas.height = window.innerHeight;
            }
          
            // init
            initParticles();
            if (!alreadyRendering)
              render();
          }
          
          function Sparks() {
            var source = $('#glass');
            var initialY = source.position().right + (source.width() / 2);
            var initialX = source.position().bottom + (source.height() / 2);
            var sparkCanvas = $('#canvas');
            var sparkWidth = sparkCanvas.width();
            var sparkHeight = sparkCanvas.height();
            sparkShower(initialY, initialX, sparkWidth, sparkHeight);
            console.log('sparked');
          }
    }
});