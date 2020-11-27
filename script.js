class AudioController{
    constructor(){
        this.bgMusic = new Audio('assets/sounds/creepy.mp3');
        this.victorySound = new Audio('assets/sounds/victory.wav');
        this.gameOverSound = new Audio('assets/sounds/gameOver.wav');
        this.matchedSound = new Audio('assets/sounds/match.wav');
        this.flipSound = new Audio('assets/sounds/flip.wav');

        this.bgMusic.volume = 1
    }

    startMusic(){
        this.bgMusic.play()
    }

    stopMusic(){
        this.bgMusic.pause();
        this.bgMusic.currentTime=0;
    }

    flip(){
        this.flipSound.play();
    }

    matched(){
        this.matchedSound.play();
    }

    gameOver(){
        this.gameOverSound.play();
        this.stopMusic();
    }

    victory(){
        this.victorySound.play();
        this.stopMusic();
    }
}

class Game{
    constructor(totalTime,cards){
        this.cardArray=cards;
        this.totalTime=totalTime;
        this.timeRemaining=totalTime;
        this.timer=document.getElementById('time-remaining');
        this.fliper=document.getElementById('flips');
        this.audioController=new AudioController;
    }

    startGame(){
        this.cardCheck=null;
        this.totalClicks=0;
        this.timeRemaining=this.totalTime;
        this.matchedCard=[];
        this.busy=true;
        setTimeout(()=>{
            this.audioController.startMusic();
            this.shuffleCards();
            this.countDown=this.starCountDown();
            this.busy=false;
        },500);
        this.hideCards();
        this.timer.innerText=this.timeRemaining;
        this.fliper.innerText=this.totalClicks;
    }

    hideCards(){
        this.cardArray.forEach(card =>{
            card.classList.remove('show');
            card.classList.remove('matched');
        })
    }

    shuffleCards(){
        for(let i=this.cardArray.length-1;i>0;i--){
            let random = Math.floor(Math.random()*(i+1));
            this.cardArray[random].style.order=i;
            this.cardArray[i].style.order=random;
        }
    }

    starCountDown(){
        return setInterval(() => {
            this.timeRemaining--;
            console.log(this.timeRemaining)
            this.timer.innerText=this.timeRemaining;
            if(this.timeRemaining==0){
                this.GameOver();
            }
        }, 1000);
    }

    GameOver(){
        clearInterval(this.countDown);
        this.audioController.gameOver();
        document.getElementById('gameover-text').classList.add('show');
    }

    flipCard(card){
        if(this.canFlipcard(card)){
            this.audioController.flip();
            this.totalClicks++;
            this.fliper.innerText=this.totalClicks;
            card.classList.add('show')
            if(this.cardCheck){
                this.checkForMatch(card);
            }else{
                this.cardCheck=card;
            }
        }
    }

    checkForMatch(card){
        if(this.getCardType(card)==this.getCardType(this.cardCheck)){
            this.cardMatched(card,this.cardCheck)
        }else{
            this.misMatched(card,this.cardCheck);
        }
        this.cardCheck=null;
    }

    cardMatched(card1,card2){
        this.matchedCard.push(card1);
        this.matchedCard.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.matched();
        if(this.matchedCard.length==this.cardArray.length){
            this.Victory();
        }
    }

    misMatched(card1,card2){
        this.busy=true;
        setTimeout(()=>{
            card1.classList.remove('show');
            card2.classList.remove('show');
            this.busy=false;
        },1000)
    }

    Victory(){
        clearInterval(this.countDown);
        this.audioController.victory();
        document.getElementById('victory-text').classList.add('show');
    }

    getCardType(card){
        return card.getElementsByClassName('card-value')[0].src;
    }

    canFlipcard(card){
        return (!this.busy && !this.matchedCard.includes(card) && card!=this.cardCheck);
    }
}

function ready(){
    let overlayText = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new Game(100,cards);

    overlayText.forEach(overlay =>{
        overlay.addEventListener('click',()=>{
            overlay.classList.remove('show');
            game.startGame();
        })
    })

    cards.forEach(card =>{
        card.addEventListener('click',()=>{
            console.log('im here');
            game.flipCard(card);
        })
    })

}

let audioController = new AudioController;

ready();