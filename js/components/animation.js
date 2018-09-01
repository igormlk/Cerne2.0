const newDeckButton = document.querySelector('#new-deck');
const plus = document.querySelector('#plus');
const flashcard = document.querySelector('#flashcard-creator');
const moon = document.querySelector('#dark-mode');
const remember = document.querySelector('#remembered');
const forget = document.querySelector('#forgot');
const flipStudy = document.querySelector('#flip-card');


const rememberWave = new mojs.Shape({
    parent: remember,
    stroke: {'#12c2e9':'#c471ed'},
    strokeWidth: {30:0},
    fill: 'none',
    duration: 500,
    radius: {42:100},
    x: 32,
    y:32
});

const forgetWave = new mojs.Shape({
    parent: forget,
    stroke: {'#12c2e9':'#c471ed'},
    strokeWidth: {30:0},
    fill: 'none',
    duration: 500,
    radius: {42:100},
    x: -32,
    y:32
});


const newDeckWave = new mojs.Shape({
    parent: newDeckButton,
    stroke: {'#12c2e9':'#c471ed'},
    strokeWidth: {30:0},
    fill: 'none',
    duration: 500,
    radius: {42:100},
    x: 32,
    y:32
});


const newDeckBounce = new mojs.Html({
    el: newDeckButton,
    scale: {1:1.2},
    duration: 300,
    isYoyo: true
}).then({
    scale: {1.2:1},
    duration: 300
});


const rememberBounce = new mojs.Html({
    el: remember,
    scale: {1:1.2},
    duration: 300,
    isYoyo: true
}).then({
    scale: {1.2:1},
    duration: 300
});


const forgetBounce = new mojs.Html({
    el: forget,
    scale: {1:1.2},
    duration: 300,
    isYoyo: true
}).then({
    scale: {1.2:1},
    duration: 300
});


const plusAnimation = new mojs.Html({
  el: plus,
  scale: {1:1.2},
  duration: 300
}).then({
    scale: 1,
    duration: 300
});

const moonAnimation = new mojs.Html({
  el: moon,
  scale: {1:1.2},
  duration: 300
}).then({
    scale: 1
});

let newDeckButtonAnimation = new mojs.Timeline();
newDeckButtonAnimation.add(newDeckWave,newDeckBounce,plusAnimation)

let rememberButtonAnimation = new mojs.Timeline();
rememberButtonAnimation.add(rememberWave,rememberBounce)

let forgetButtonAnimation = new mojs.Timeline();
forgetButtonAnimation.add(forgetWave,forgetBounce)

const burst = new mojs.Burst({
    top: 0,
    left: 0,
    radius: {0:21},
    count: 5,
    opacity: {1:0},
    children: {
        fill: {'#12c2e9':'#c471ed'},
        easing: 'quad.out'
    }
})

const flashcardFlip = new mojs.Html({
    el: flashcard,
    angleY: {0:360},
    duration: 500,
    easing: 'quad.out'
});

const flashcardIn = new mojs.Html({
    el: flashcard,
    scale:{0.2:1},
    timeline: {delay:500},
    opacity: {0:1},
    angleY: {0:-360},
    duration: 500,
    easing: 'quad.out'
});

const flashcardOut = new mojs.Html({
    el: flashcard,
    scale:{1:0.2},
    opacity: {1:0},
    duration: 500
});

const flipStudyAnimation = new mojs.Html({
    el: flipStudy,
    scale: {1:1.2},
    duration: 250
}).then({
    scale: 1,
    duration: 250
});

let newFlashcardAnimation = new mojs.Timeline();
newFlashcardAnimation.add(flashcardOut,flashcardIn)

let darkModeAnimation = new mojs.Timeline();
darkModeAnimation.add(moonAnimation,burst)

