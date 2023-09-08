gsap.registerPlugin(ScrollTrigger);

// Split text
// Select elements


let intro =  document.querySelector('.title .greet');
let name =  document.querySelector('.title .name');

// Split text

let introText = intro.textContent.split('');

let introName = name.textContent.split('');

let splitText = introText.map((letter) => {
//  Create span
    let span = document.createElement('span');
    span.textContent = letter;
    return span;
}
);

let splitName = introName.map((letter) => {
    //  Create span
    let span = document.createElement('span');
    span.textContent = letter;
    return span;
}
);

intro.textContent = '';
name.textContent = '';
splitText.forEach((letter) => intro.appendChild(letter));
splitName.forEach((letter) => name.appendChild(letter));

let splitLetters = document.querySelectorAll('.title .greet span');
let splitLettersName = document.querySelectorAll('.title .name span');

let tl1 = gsap.timeline();

tl1
	.from(splitLetters, {duration: .5, opacity: 0, stagger: .125, delay:0.5 , ease: 'power1. In'})
	.to(splitLetters, {duration: .25, opacity: 0, stagger: .125,  ease: 'power3. inOut'}, '+=3')
    .set('.greet', {display: 'none'}, '+=0.5')
    .set('.name', {display: 'block'})
    .from(splitLettersName, {duration: .25, opacity: 0, stagger: .075,  ease: 'power1. In'})
    .to(splitLettersName, {duration: .25, opacity: 0, stagger: .075,  ease: 'power3. inOut'}, '+=3')
    .set('.title', {display: 'none'}, '+=0.5')
    .set('.content', {display: 'block'})
    .from('.content h1', {duration: 1,y:200 ,opacity: 0, ease: 'power1. In'})
    .from('.content img', {duration: 1,y:200 ,opacity: 0, ease: 'power1. In'}, '-=0.5')
    .from('.content i', {duration: 1,y:200 ,opacity: 0, ease: 'power1. In', onComplete: animator}, '-=0.5');


// 
function clampBuilder( minWidthPx, maxWidthPx, minFontSize, maxFontSize ) {
    const root = document.querySelector( "html" );
    const pixelsPerRem = Number( getComputedStyle( root ).fontSize.slice( 0,-2 ) );
  
    const minWidth = minWidthPx / pixelsPerRem;
    const maxWidth = maxWidthPx / pixelsPerRem;
  
    const slope = ( maxFontSize - minFontSize ) / ( maxWidth - minWidth );
    const yAxisIntersection = -minWidth * slope + minFontSize
  
    return `clamp( ${ minFontSize }rem, ${ yAxisIntersection }rem + ${ slope * 100 }vw, ${ maxFontSize }rem )`;
  }

  console.log(clampBuilder( 320, 1200, 1, 2 ));

//   Background

(function() {

    var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;

    // Main
    initHeader();
    initAnimation();
    addListeners();

    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = {x: width/2, y: height/2};


        canvas = document.getElementById('demo-canvas');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        // create points
        points = [];
        for(var x = 0; x < width; x = x + width/20) {
            for(var y = 0; y < height; y = y + height/20) {
                var px = x + Math.random()*width/20;
                var py = y + Math.random()*height/20;
                var p = {x: px, originX: px, y: py, originY: py };
                points.push(p);
            }
        }

        // for each point find the 5 closest points
        for(var i = 0; i < points.length; i++) {
            var closest = [];
            var p1 = points[i];
            for(var j = 0; j < points.length; j++) {
                var p2 = points[j]
                if(!(p1 == p2)) {
                    var placed = false;
                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(closest[k] == undefined) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }

                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }

        // assign a circle to each point
        for(var i in points) {
            var c = new Circle(points[i], 2+Math.random()*2, 'rgba(255,255,255,0.3)');
            points[i].circle = c;
        }
    }

    // Event handling
    function addListeners() {
        if(!('ontouchstart' in window)) {
            window.addEventListener('mousemove', mouseMove);
        }
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
    }

    function mouseMove(e) {
        var posx = posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY)    {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;
    }

    function scrollCheck() {
        if(document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        largeHeader.style.height = height+'px';
        canvas.width = width;
        canvas.height = height;
    }

    // animation
    function initAnimation() {
        animate();
        for(var i in points) {
            shiftPoint(points[i]);
        }
    }

    function animate() {
        if(animateHeader) {
            ctx.clearRect(0,0,width,height);
            for(var i in points) {
                // detect points in range
                if(Math.abs(getDistance(target, points[i])) < 4000) {
                    points[i].active = 0.3;
                    points[i].circle.active = 0.6;
                } else if(Math.abs(getDistance(target, points[i])) < 20000) {
                    points[i].active = 0.1;
                    points[i].circle.active = 0.3;
                } else if(Math.abs(getDistance(target, points[i])) < 40000) {
                    points[i].active = 0.02;
                    points[i].circle.active = 0.1;
                } else {
                    points[i].active = 0;
                    points[i].circle.active = 0;
                }

                drawLines(points[i]);
                points[i].circle.draw();
            }
        }
        requestAnimationFrame(animate);
    }

    function shiftPoint(p) {
        TweenLite.to(p, 1+1*Math.random(), {x:p.originX-50+Math.random()*100,
            y: p.originY-50+Math.random()*100, ease:Circ.easeInOut,
            onComplete: function() {
                shiftPoint(p);
            }});
    }

    // Canvas manipulation
    function drawLines(p) {
        if(!p.active) return;
        for(var i in p.closest) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.closest[i].x, p.closest[i].y);
            ctx.strokeStyle = 'rgba(156,217,249,'+ p.active+')';
            ctx.stroke();
        }
    }

    function Circle(pos,rad,color) {
        var _this = this;

        // constructor
        (function() {
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
        })();

        this.draw = function() {
            if(!_this.active) return;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(156,217,249,'+ _this.active+')';
            ctx.fill();
        };
    }

    // Util
    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }
    
})();

let headings = document.querySelectorAll('.pager > h1');
let paras = document.querySelectorAll('.pager > p');
let circles = document.querySelectorAll('.circle');


// function animator() {
//     gsap.from(headingPage2,{
//         scrollTrigger:{
//             scroller: ".content",
//             toggleActions: "play none none none",
//             trigger: headingPage2,
//             start:'top bottom',
//              markers:true
//             },
//         opacity:0,x:-400,duration:2,ease:"none"});
// }

function animator() {
    headings.forEach((heading) => {
        gsap.from(heading,{
            scrollTrigger:{
                scroller: ".content",
                toggleActions: "play none none none",
                trigger: heading,
                start:'top bottom'
                },
            opacity:0,xPercent: -100,duration:2,ease:"none"});
    }
    );

    paras.forEach((para) => {
        gsap.from(para,{
            scrollTrigger:{
              toggleActions: "play none none none",
              scroller: ".content",
              trigger: para,
              start:'top bottom'
            },
       opacity:0,duration:2,ease:"none"})
    }
    );
    
    circles.forEach((circle) => {
        gsap.from(circle,{
            scrollTrigger:{
              scroller: ".content",
              toggleActions: "play none none none",
              trigger: circle,
              start:'top bottom'
            },
       opacity:0,duration:2,ease:"none"})
    }
    );
    
}

