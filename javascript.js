const paper = document.querySelector("#paper");
const pen = paper.getContext("2d");


let soundEnabled = false; 

document.onvisibilitychange = () => soundEnabled = false;

let firstClick = true;
let startTime;

const calculateNextImpactTime = (currentImpactTime, velocity) => {
    return currentImpactTime + (Math.PI / velocity) * 1000;
}

paper.onclick = () => {
    if (firstClick) {
        startTime = new Date().getTime();
        firstClick = false;
        arcs.map((arc) => {
            arc.nextImpactTime = calculateNextImpactTime(startTime, arc.velocity)
        });

        draw();
    }
    soundEnabled = !soundEnabled;
}

const pulseEnabled = true;

const arcs = [
    // "#D0E7F5",
    // "#D9E7F4",
    // "#D6E3F4",
    // "#BCDFF5",
    // "#B7D9F4",
    // "#C3D4F0",
    // "#9DC1F3",
    // "#9AA9F4",
    // "#8D83EF",
    // "#AE69F0",
    // "#D46FF1",
    // "#DB5AE7",
    // "#D911DA",
    // "#D601CB",
    // "#E713BF",
    // "#F24CAE",
    // "#FB79AB",
    // "#FFB6C1",
    // "#FED2CF",
    // "#FDDFD5",
    // "#FEDCD1"
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
].map((color, index) => {
    const audio = new Audio(`./music/${index + 1}.mp3`);
    audio.volume = 1;

    
    // the 2 variables below changes the velocity 
    // of the polyrhythm
    const intervalSeconds = 180;
    const numberOfLoops = 22 - index;

    const oneFullLoop = 2 * Math.PI;
    const velocity = numberOfLoops * oneFullLoop / intervalSeconds;


    return {
        color,
        audio,
        nextImpactTime: calculateNextImpactTime(startTime, velocity),
        velocity
    }
});

const calculateDynamicOpacity = (currentTime, lastImpactTime, baseOpacity, maxOpacity, duration) => {
    const timeSinceImpact = currentTime - lastImpactTime,
          percentage = Math.min(timeSinceImpact / duration, 1),
          opacityDelta = maxOpacity - baseOpacity;
    
    return maxOpacity - (opacityDelta * percentage);
  }
  
const determineOpacity = (currentTime, lastImpactTime, baseOpacity, maxOpacity, duration) => {
    if(!pulseEnabled) return baseOpacity;
    
    return calculateDynamicOpacity(currentTime, lastImpactTime, baseOpacity, maxOpacity, duration);
  }

const draw = () => {
    const currentTime = new Date().getTime();

    const elapsedTime = (currentTime - startTime) / 1000;

    paper.width = paper.clientWidth;
    paper.height = paper.clientHeight;

    const start = {
        x: paper.width * 0.25,
        y: paper.height * 0.5
    }

    const end = {
        x: paper.width * 0.75,
        y: paper.height * 0.5  
    }    

    const center = {
        x: paper.width * 0.5,
        y: paper.height * 0.5
    }

    pen.strokeStyle = "white";
    pen.lineWidth = 1;
    
    // makes the base of the polyrhythms
    pen.beginPath();
    pen.moveTo(start.x, start.y);
    pen.lineTo(end.x, end.y);
    pen.stroke();


    const length = end.x - start.x;
    const initialArcRadius = length * 0.05;
    const spacing = (length / 2 - initialArcRadius) / arcs.length;

    arcs.forEach((arc, index) => {
        const arcRadius = initialArcRadius + (index * spacing);

        const maxAngle = 2 * Math.PI;
        const distance = Math.PI + (elapsedTime * arc.velocity);
        // let modDistance = distance % maxAngle;
        let modDistance = distance;
    
        if (modDistance <= Math.PI) {
            modDistance = maxAngle - modDistance;
        }
    
        const x = center.x + arcRadius * Math.cos(modDistance);
        const y = center.y + arcRadius * Math.sin(modDistance);

        // draws an arc
        pen.beginPath();
        pen.strokeStyle = arc.color;
        pen.globalAlpha = determineOpacity(currentTime, arc.lastImpactTime, 0.35, 0.85, 1000);
        pen.arc(center.x, center.y, arcRadius, 0, 2 * Math.PI);
        pen.stroke();

        // draws a circle
        pen.strokeStyle = "white";
        pen.fillStyle = "white";
        pen.beginPath();
        pen.arc(x, y, length * 0.0065, 0 , 2 * Math.PI);
        pen.fill();
        pen.stroke(); 

        // play the music
        if (currentTime >= arc.nextImpactTime) {
            if (soundEnabled) {
                arc.audio.play();
            }
            arc.lastImpactTime = arc.nextImpactTime;
            arc.nextImpactTime = calculateNextImpactTime(arc.nextImpactTime, arc.velocity);
        }
    });
    requestAnimationFrame(draw);
}

const outline = () => {

    paper.width = paper.clientWidth;
    paper.height = paper.clientHeight;

    const start = {
        x: paper.width * 0.25,
        y: paper.height * 0.5
    }

    const end = {
        x: paper.width * 0.75,
        y: paper.height * 0.5  
    }    

    const center = {
        x: paper.width * 0.5,
        y: paper.height * 0.5
    }

    pen.strokeStyle = "white";

    pen.beginPath();
    pen.moveTo(start.x, start.y);
    pen.lineTo(end.x, end.y);
    pen.stroke();

    const length = end.x - start.x;
    const initialArcRadius = length * 0.05;
    const spacing = (length / 2 - initialArcRadius) / arcs.length;

    arcs.forEach((arc, index) => {
        const arcRadius = initialArcRadius + (index * spacing);
    
        const x = center.x - arcRadius;
        const y = center.y

        // draws an arc
        pen.beginPath();
        pen.strokeStyle = arc.color;
        pen.arc(center.x, center.y, arcRadius, 0, 2 * Math.PI);
        pen.stroke();

        // draws a circle
        pen.strokeStyle = "white";
        pen.fillStyle = "white";
        pen.beginPath();
        pen.arc(x, y, length * 0.0065, 0 , 2 * Math.PI);
        pen.stroke();
        pen.fill();
    });

}

outline();

let subMenu = document.getElementById("subMenu");

function toggleMenu() {
    subMenu.classList.toggle("open-menu");
}