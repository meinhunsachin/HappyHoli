// common utilities and animations
const canvas=document.getElementById("canvas");
const ctx=canvas?.getContext("2d");
if(canvas && ctx){
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    let particles=[];
    class Particle{
        constructor(x,y){
            this.x=x; this.y=y;
            this.size=Math.random()*10+4;
            this.speedY=Math.random()*4+1;
            this.speedX=Math.random()*4-2;
            this.color=`hsl(${Math.random()*360},100%,50%)`;
        }
        update(){
            this.y+=this.speedY;
            this.x+=this.speedX;
            if(this.y>canvas.height) this.y=0;
        }
        draw(){
            ctx.fillStyle=this.color;
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
            ctx.fill();
        }
    }
    for(let i=0;i<300;i++){
        particles.push(new Particle(Math.random()*canvas.width,Math.random()*canvas.height));
    }
    function animate(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        particles.forEach(p=>{p.update();p.draw();});
        requestAnimationFrame(animate);
    }
    animate();
    window.addEventListener("resize",()=>{
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;
    });
}

// generic popup messenger
function showMessage(text){
    const popup=document.getElementById("popup");
    if(!popup) return;
    popup.innerText=text;
    popup.style.display="block";
    popup.style.background=`linear-gradient(45deg,
        hsl(${Math.random()*360},100%,50%),
        hsl(${Math.random()*360},100%,50%)
    )`;
    const emojis=['🎉','🌈','💖','😊','🎨'];
    emojiRain(getRandom(emojis));
    setTimeout(()=>{popup.style.display="none";},5000);
}

// small burst of emojis falling
function emojiRain(symbol, count=20){
    for(let i=0;i<count;i++){
        const span=document.createElement('span');
        span.className='emoji';
        span.textContent=symbol;
        span.style.left=Math.random()*100+'vw';
        document.body.appendChild(span);
        // remove when animation ends
        span.addEventListener('animationend',()=>span.remove());
    }
}

// audio helper
function playMusic(id){
    const player=document.getElementById(id);
    if(!player){
        console.warn('playMusic: no element with id', id);
        return;
    }
    // attach error debugging if not already
    if(!player._logged){
        player.addEventListener('error',e=>{
            console.error('audio element error', e, player.error);
        });
        player._logged=true;
    }
    // ensure volume/unmuted
    player.volume = 1;
    player.muted = false;
    player.play().then(()=>{
        console.log('audio started');
    }).catch(e=>{
        console.warn('audio failed to play', e);
    });
}

// random message generator for main page
const messages=[
    "🌸 Every color reminds me of your beautiful smile 😘",
    "💞 This Holi, I just want to be lost in your colors forever 💕",
    "🌈 My favorite color is the one I see in your eyes 💖",
    "🎨 Life is more vibrant because you are in it 💘",
];

// additional romantic messages inserted into home card
const loveMessages=[
    "You are the color that fills my life with joy.",
    "Every moment with you feels like Holi – full of hues and happiness.",
    "My heart paints your name in every shade.",
];

// shared list of Holi facts for multiple pages
const holiFacts=[
    "Holi marks the arrival of spring and the victory of good over evil.",
    "It's also known as the festival of colors or the festival of love.",
    "People play Holi by throwing colored powders called 'gulal'.",
    "Holi is celebrated in India and Nepal, and among Indian diaspora worldwide.",
    "Bhagavata Purana describes the legend of Holika and Prahlad behind the festival."
];

// a few greetings shown when pages load
const greetings={
    home: [
        "Welcome to our Holi celebration! 🎉",
        "Click celebrate when you're ready to splash colors! 🌈",
        "Sending you virtual gulal and hugs ❤️",
    ],
    colors: [
        "Time to mix some vibrant shades! 🎨",
        "Pick a hue or go random - it's your Holi mood!",
    ],
    facts: [
        "Ready for a fun fact? 🤓",
        "Holi is full of surprises, just like you!",
    ]
};

function getRandom(arr){
    return arr[Math.floor(Math.random()*arr.length)];
}

function celebrate(){
    playMusic('music');
    showMessage(getRandom(messages));
    // also update the love message paragraph if present
    const loveEl=document.getElementById('loveMsg');
    if(loveEl){
        loveEl.innerText=getRandom(loveMessages);
    }
}

// display a random Holi fact via popup (reuse in multiple pages)
function showFact(){
    const fact=getRandom(holiFacts);
    showMessage('💡 ' + fact);
    // return for external use
    return fact;
}

// show a greeting when any page loads
window.addEventListener('DOMContentLoaded',()=>{
    const page=document.body.dataset.page;
    if(page && greetings[page]){
        showMessage(getRandom(greetings[page]));
    }
    // highlight nav link
    const links=document.querySelectorAll('nav a');
    links.forEach(a=>{
        const href=a.getAttribute('href');
        if((page==='home' && href.endsWith('index.html')) || (page!=='home' && href.includes(page))){
            a.classList.add('active');
        }
        // clickable feedback when user taps navigation
        a.addEventListener('click', e=>{
            e.preventDefault();
            // ensure audio is unlocked and playing
            const audio=document.getElementById('music');
            if(audio){
                audio.muted=false;
                audio.play().catch(()=>{});
            }
            // perform page-specific action
            if(href.includes('index.html')){
                // do nothing special; user can press the Celebrate button instead
            }else if(href.includes('colors.html')){
                showMessage('Ready for colours? Applying one now...');
                // also trigger a random color immediately
                if(typeof randomColor==='function') randomColor();
            }else if(href.includes('facts.html')){
                showMessage('Let me share a quick Holi fact...');
                showFact();
            }
            // navigate after a short pause
            setTimeout(()=>{ window.location.href = href; }, 300);
        });
    });

    // attempt to autoplay the music silently
    const audio=document.getElementById('music');
    if(audio){
        audio.play().catch(()=>{});
    }

    // unmute and resume music on first user interaction
    function unlockAudio(){
        if(audio){
            audio.muted=false;
            audio.play().catch(()=>{});
        }
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('keydown', unlockAudio);
    }
    document.addEventListener('click', unlockAudio);
    document.addEventListener('keydown', unlockAudio);
});
