<template>
  <div id="app" v-on:click="resetOnInactivity">
    <!-- <PandaIcon class="test-icon panda-icon" style="width:16%"/> -->
    <div class="card-container">
      <transition
        name="slide"
      >
        <div
          class="score-icon-holder"
          v-show="scoreIsVisible"
        >
          <PandaIcon class="panda-icon"/>
          <h2 class="app-hud-text">Score:
            <span class="score bolded">{{ score }}</span>
          </h2>
        </div>
      </transition>
      <StartCard
        v-on:readyStartGame="readyStartGame"
        v-bind:showStartCard="preGame"
        v-bind:cardsPerRound="cardsPerRound"
      />
      <GameCard 
        v-for="image in imageData"
        v-bind:key="image.id"
        v-bind:cardData="image"
        v-bind:currentCardID="currentCard"
        v-on:nextCard="getNextGameCard"
        v-on:score="trackScore"
        v-bind:zooming="zooming"
      />
      <ReferenceImage
        v-for="image in referenceCardData"
        v-bind:key="image.animalName"
        v-bind:referenceAnimal="showReferenceImageWithID"
        v-bind:cardData="image"
        v-bind:zooming="zooming"
      />
      <EndCard
        v-bind:userData="imageData"
        v-bind:totalNumberCards="cardsPerRound"
        v-bind:showEndCard="endRound"
      />
      <transition
        name="slide-fade"
        v-on:after-leave="changeNextButtonText"
      >
        <div
          v-on:click="actionBasedOnGameState"
          class="next-card-button app-hud-button-and-text"
          v-show="nextButtonIsVisible"
          >
            <h2 class="app-hud-text button-text">{{ nextButtonText }}</h2>
            <svg viewBox="-10 -10 137.07 183.1">
              <path d="M11.79,1.18,115.5,71.64c6,4.08,6,15.73,0,19.81L11.79,161.91C6.37,165.59,0,160.24,0,152V11.09C0,2.86,6.37-2.5,11.79,1.18Z" fill="#333537"/>
            </svg>
        </div>
      </transition>
      <transition
        name="slide"
        enter-class="slide-horizontal"
        leave-to-class="slide-horizontal"
      >
      <div
        v-on:click="restartGame"
        v-show="startRound"
        class="restart-game-button app-hud-button-and-text"
      >
        <svg viewBox="0 0 110 113">
  <path fill="#221d20" d="M106 70a5 5 0 0 0-5 3 47 47 0 1 1-18-55l-9 6a4 4 0 0 0 2 8l26 4a4 4 0 0 0 4-4l4-25a4 4 0 0 0-6-4l-12 9a57 57 0 1 0 18 65 5 5 0 0 0-4-7z"/>
</svg>
        <h2 class="app-hud-text button-text">Restart Game</h2>
      </div>
      </transition>
      <div class="zoom-bg"></div>
    </div>
  </div>
</template>

<script>
import GameCard from './components/GameCard.vue'
import StartCard from './components/StartCard.vue'
import ReferenceImage from './components/ReferenceImage.vue'
import EndCard from './components/EndCard.vue'
import PandaIcon from './assets/panda.svg'

import shuffle from 'lodash/shuffle'
import sampleSize from 'lodash/sampleSize'
import filter from 'lodash/filter'
import uniqBy from 'lodash/uniqBy'

// Load in the image data from the csv file
import fullImgData from './assets/imageData.csv'

// import Zooming for image zoom and anime for animations
import Zooming from 'zooming'
import anime from 'animejs'

export default {
  name: 'app',
  components: {
    GameCard,
    StartCard,
    ReferenceImage,
    EndCard,
    PandaIcon
  },
  data () {
    return {
      imageData: [],
      referenceCardData: [],
      uniqueAnimalNames: [],
      cardsPerRound: 5,
      score: 0,
      preGame: false,
      startRound: false,
      endRound: false,
      currentCard: 0,
      showReferenceImageWithID: '',
      scoreIsVisible: false,
      nextButtonIsVisible: false,
      nextButtonText: 'Start',
      animations: {},
      zooming: {}
    }
  },
  methods: {
    // This function reads and parses the image data from the file 'imageData.csv' located in the 'src' folder and creates an 'img' element using the provided URL. It also creates an array of unique animal names.
    getImageDataOnLoad: function () {
      let animalNames = []
      
      fullImgData.forEach(function (row) {
        row.identified = false
        row.src = require(`./assets/images/${row.imageName}`)
        animalNames.push(row.animalName)
      })

      this.referenceCardData = uniqBy(fullImgData, 'animalName')
        .map(function (row) {
          const srcAndName = {
            src: row.src,
            animalName: row.animalName
          }
          return srcAndName
        })
      this.uniqueAnimalNames = this.referenceCardData.map(row => row.animalName)
    },
    // This function sets the data for the 'cardsPerRound' to be used in one round of play. The full image data is shuffled, then filtered by unique name to prevent duplication of an animal type in one round, and then filtered to ensure an already identified image is not shown
    setDataForRound: function () {
      // Get the number of images that have not been identified
      const numNotIdentified = filter(fullImgData, img =>
        !img.identified).length
      // If the number of unidentified animals is less than the number of cards in a round, reset all of the images to a state of unidentified
      if (numNotIdentified < this.cardsPerRound) {
        fullImgData.forEach(d => d.identified = false)
      }

      // Create an array consisting of unique animals that have not yet been identified
      const uniqueAnimalsNotIdentified = filter(
        uniqBy(shuffle(fullImgData), 'animalName'),
        img => !img.identified
      )
      // If the number of unique, unidentified animals is less than the number of cards in a round set the number of cards in a round to the number of unique, unidentified animals
      if (uniqueAnimalsNotIdentified.length < this.cardsPerRound) {
        this.cardsPerRound = uniqueAnimalsNotIdentified.length;
      }

      // Set the image data that will populate the cards in a round
      this.imageData = sampleSize(uniqueAnimalsNotIdentified,
        this.cardsPerRound
      )

      const numberOfChoices = 3
      const uniqueNames = this.uniqueAnimalNames
      this.imageData.forEach(function (data, i) {
        // Set unique id for reference later
        data.id = i + 1
        // Shuffle image animal name and selection of two other unique animal names to create choices
        data.choices = shuffle(
          [
            ...sampleSize(
              filter(uniqueNames, name =>
                name !== data.animalName
              ),
              numberOfChoices - 1
            ),
            data.animalName
          ]
        )
      })
    },
    // This function changes the state of the game to prepare to start a round
    readyStartGame: function () {
      this.endRound = false
      this.score = 0
      this.scoreIsVisible = true
      this.nextButtonIsVisible = true
      this.setDataForRound()
    },
    // This function removes the preGame StartCard and calls the first GameCard to start the round.
    startRoundSetup: function () {
      this.preGame = false
      this.startRound = true
      this.getNextGameCard()
    },
    // This function provides the iteration over the cards in a round and handles when the last card in a round is completed
    getNextGameCard: function () {
      this.nextButtonIsVisible = false
      this.showReferenceImageWithID = ''
      this.animations.correct.restart();
      this.animations.incorrect.restart();
      this.animations.correct.pause();
      this.animations.incorrect.pause();
      if (this.currentCard === this.cardsPerRound) {
        this.finishRound()
        this.currentCard = 0
        return
      }
      this.currentCard++
    },
    // This function changes the text of the next button to reflect the action that will happen when it is clicked
    changeNextButtonText: function () {
      console.log(`Button text: ${this.nextButtonText}`)
      if (this.currentCard === 0) {
        this.nextButtonText = this.preGame ? 'Start' : 'Play Again'
        if (this.nextButtonText === 'Play Again') {
          this.nextButtonIsVisible = true
        }
      } else if (this.currentCard === this.cardsPerRound) {
        this.nextButtonText = 'Finish'
      } else { this.nextButtonText = 'Next' }
    },
    // This function keeps track of the score after the user submits an answer. It also shows the 'next button' to select a new card.
    trackScore: function (isCorrect, userChoice) {
      this.imageData[this.currentCard - 1].identified = isCorrect
      this.score = this.imageData.filter(d => d.identified).length
      this.nextButtonIsVisible = true

      // If the user's choice is incorrect show the reference image
      if (!isCorrect) {
        this.showReferenceImageWithID = userChoice
        // Start the panda animation for incorrect choices
        this.animations.incorrect.play()
      } else if (isCorrect) {
        // Start the panda animation for correct choice
        this.animations.correct.play()

        // Animate score number on change
        anime({
          targets: '.score',
          scale: 1.25,
          duration: 200,
          direction: 'alternate',
          easing: 'easeInOutBack'
        })
      }
    },
    // This function changes the state of the game to the end of a round in which the end of the round card is shown
    finishRound: function () {
      this.startRound = false
      this.endRound = true
    },
    // This function restarts the game to the front of the start card and removes any other objects
    restartGame: function () {
      this.scoreIsVisible = false
      this.nextButtonIsVisible = false
      this.preGame = true
      this.startRound = false
      this.currentCard = 0
      this.showReferenceImageWithID = ''
      this.animations.correct.restart();
      this.animations.incorrect.restart();
      this.animations.correct.pause();
      this.animations.incorrect.pause();
    },
    // This function is called when a user presses the "start/next/play again" button. It uses the state of the game booleans (preGame, endRound) to run other functions to setup the game, start a round, and get the next card
    actionBasedOnGameState: function () {
      console.log(`pregame: ${this.preGame}, endround ${this.endRound}`);
      
      if (this.preGame) {
        this.startRoundSetup()
      } else if (this.endRound) {
        this.readyStartGame()
        this.startRoundSetup()
      } else { this.getNextGameCard() }
    },
    // This function reloads the page after two minutes of inactivity.
    resetOnInactivity: function () {
      clearTimeout(this.startInactiveResetTimer)
      this.startInactiveResetTimer = setTimeout( () =>
        this.restartGame, 120000)
    },
    // This function creates a listener to zoom in/out on touch using the Zooming package. It returns a zoom object to attach the listener to the to card images and reference images.
    setupZooming: function () {
      const zooming = new Zooming({
        bgOpacity: 0,
        enableGrab: false,
        scaleBase: 0.9,
        // Add border radius to bottom of card image when zoomed in, lower the z-index of the visible reference image, and set image zoom callout text and icon display to none
        onBeforeOpen: (zoomedImage) => {
          document.querySelector(".zoom-bg").classList.add("show")
          document.querySelectorAll('.next-card-button').forEach(d =>
            d.setAttribute('disabled', true)
          )
          if (zoomedImage.classList.contains('card-image')) {
            zoomedImage.classList.add('full-border-radius')
            document.querySelectorAll('.reference-image-holder').forEach(d =>
              d.style.display !== 'none' ?
                d.classList.add('send-backwards') : null
            )
          } else {
            document.querySelectorAll('.image-zoom-callout.reference-image-callout').forEach(d =>
              d.style.visibility = 'hidden'
            )
          }
        },
        onBeforeClose: () => 
          document.querySelector(".zoom-bg").classList.remove("show"),
        // Remove border radius from bottom of card image when zoomed out, raise the z-index of the visible reference image, and make image zoom callout text and icon visible
        onClose: (zoomedImage) => {
          document.querySelectorAll('.next-card-button').forEach(d =>
            d.removeAttribute('disabled')
          )
          if (zoomedImage.classList.contains('card-image')) {
            zoomedImage.classList.remove('full-border-radius')
            document.querySelectorAll('.reference-image-holder').forEach(d =>
              d.style.display !== 'none' ?
                d.classList.remove('send-backwards') : null
            )
          } else {
            document.querySelectorAll('.image-zoom-callout.reference-image-callout').forEach(d =>
              d.style.visibility = 'visible'
            )
          }
        }
      })

      this.zooming = zooming
    }
  },
  beforeMount () {
    // Call the getImageDataOnLoad method to prepare the images and data before App component is mounted
    this.getImageDataOnLoad()
    // Create the zooming instance with set options for later attachment to GameCard img and ReferenceImage img
    this.setupZooming()
  },
  mounted () {
    // Wait to set pregame to true in order to animate start card entrance
    this.preGame = true
    
    // Animations used to show the score panda shake its head 'yes' on a correct choice
    const correctAnimation = anime.timeline({
      direction: 'alternate',
      loop: true,
      autoplay: false
    })

    correctAnimation
      .add({
        targets: '.score-icon-holder .head',
        translateY: -5,
        rotateX: '25deg',
        offset: 0,
        duration: 400,
        easing: 'easeInOutSine'
      })
      .add({
        targets: ['.score-icon-holder [data-name="mouth"]', '.score-icon-holder [data-name="upper-mouth"]', '.score-icon-holder [data-name="nose"]', '.score-icon-holder [data-name="face-shadow"]'],
        translateY: -9,
        offset: 0,
        duration: 400,
        easing: 'easeInOutSine'
      })
     .add({
        targets: '.score-icon-holder [data-name="head-shadow"]',
        translateX: -20,
        offset: 0,
        duration: 400,
        easing: 'easeInOutSine'
      })

    // Animations used to show the score panda shake its head 'no' on an incorrect choice
    const incorrectAnimation = anime.timeline({
      direction: 'normal',
      loop: true,
      autoplay: false
    })

    incorrectAnimation
      .add({
        targets: '.score-icon-holder .head',
        rotateY: [
          { value: '-20deg', duration: 200, easing: 'easeInOutSine' },
          { value: '20deg', duration: 400, easing: 'easeInOutSine' },
          { value: '-20deg', duration: 400, easing: 'easeInOutSine' },
          { value: 0, duration: 400, easing: [0.175, 0.885, 1.000, 1.650] }
        ],
        offset: 400,
      })
      .add({
        targets: '.score-icon-holder [data-name="ears"]',
        rotateY: [
          { value: '-25deg', duration: 200, easing: 'easeInOutSine' },
          { value: '25deg', duration: 400, easing: 'easeInOutSine' },
          { value: '-25deg', duration: 400, easing: 'easeInOutSine' },
          { value: 0, duration: 400, easing: [0.175, 0.885, 1.000, 1.650] }
        ],
        offset: 400,
      })
      .add({
        targets: ['.score-icon-holder [data-name="mouth"]', '.score-icon-holder [data-name="upper-mouth"]', '.score-icon-holder [data-name="nose"]', '.score-icon-holder [data-name="face-shadow"]'],
        translateX: [
          { value: -6, duration: 200, easing: 'easeInOutSine' },
          { value: 6, duration: 400, easing: 'easeInOutSine' },
          { value: -6, duration: 400, easing: 'easeInOutSine' },
          { value: 0, duration: 400, easing: [0.175, 0.885, 1.000, 1.650] }
        ],
        offset: 400,
      })
      .add({
        targets: ['.score-icon-holder [data-name="head-shadow"]'],
        translateX:[
          { value: -20, duration: 200, easing: 'easeInOutSine' },
          { value: 0, duration: 200, easing: 'linear' },
          { value: -10, duration: 200, easing: 'easeInOutSine' },
          { value: 0, duration: 200, easing: 'linear' },
          { value: -20, duration: 200, easing: 'easeInOutSine' },
          { value: 0, duration: 400, easing: [0.175, 0.885, 1.000, 1.650] }
        ],
        offset: 400
      })

    this.animations = {
      'correct': correctAnimation,
      'incorrect': incorrectAnimation
    }
  }
}
</script>

<style lang="scss">
@import './src/assets/css/fonts.scss';
#app {
  font-family: 'Gentium Basic', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  background-image: url('./assets/RedTile.png');
  background-position: center;
  color: #333537;
  background-color: #333537;
  overflow: hidden;
  position: fixed;

  .bolded {
    font-weight: 700;
  }

  .no-pointer-event {
    pointer-events: none;
  }

  .send-backwards {
    z-index: -1;
  }

  .app-hud-text {
    font-size: 3.2rem;
    font-weight: 400;
    color: #FFFFFF;
    margin-top: 0;
    margin-bottom: 0;
    filter: drop-shadow(3px 6px 2px #24383A);
  }

  .app-hud-button-and-text {
    cursor: pointer;
    height: 7.5vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  button {
    cursor: pointer;
    font-family: 'Gentium Basic', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 2.2em;
    font-weight: 400;
    color: #FFFFFF;
    background-color: #333537;
    border-radius: 1.1rem;
    border-color: #333537;
    transition: all 0.2s ease-in;

    &:hover, &:focus {
      background-color: #ff3920;
      border-color: #ff3920;
      outline: none !important;
      box-shadow: none;
    }
  }

  .card-container {
    width: 100vw;
    height: 100%;
    perspective: 10000px;
  }

  .zoom-bg {
    position: absolute;
    width: 100vw;
    height: 100vh;
    opacity: 0;
    pointer-events: none;
    z-index: 1;
    background-color: #333537;
    transition: opacity 0.4s;

    &.show {
      opacity: 0.8;
    }
  }

  $card-height: 85vh;
  $card-width: 5 / 8 * $card-height;
  $center-bw-card-0vw: calc((50vw - #{$card-width} / 2) / 2);
  
  .score-icon-holder {
    position: absolute;
    top: 75vh;
    left: $center-bw-card-0vw;
    transform: translateX(-50%) translateY(-50%);

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .panda-icon {
      width: 100%;
      height: 100%;
      filter: drop-shadow(5px 10px 8px #24383A);
    
      .head, [data-name="ears"] {
        transform-origin:40%;
      }
    }

    .score {
      display: inline-block;
    }
  }

  .restart-game-button {
    position: absolute;
    z-index: -1;
    left: 2%;
    top: 7.5vh;

    .button-text {
      margin-left: 0.6rem;
    }

    svg {
      // background-color: #333537;
      // border-radius: 1.2rem;
      // border-style: solid;
      // border-width: 5px;
      // border-color: #FFFFFF;
      height: 80%;
      filter: drop-shadow(3px 6px 2px #24383A);

      path {
        fill: #ffffff;
      }
    }
  }

  .next-card-button {
    position: absolute;
    z-index: -1;
    top: 75vh;
    right: $center-bw-card-0vw;
    transform: translateX(50%) translateY(-50%);

    .button-text {
      margin-right: 0.6rem;
    }

    svg {
      height: 90%;
      width: auto;
      filter: drop-shadow(5px 10px 6px #24383A);

      path {
        stroke: #FFFFFF;
        stroke-width: 12px;
      }
    }
  }

  // panda score icon and restart game button animation
  .slide {
    transition-property: transform;
    transition-timing-function: cubic-bezier(0.25, -0.5, 0.25, 1.25);
  }

  // panda score icon animation
  .slide-enter-active, .slide-leave-active {
    transition-delay: 0.6s;
    transition-duration: 1.2s;
  }

  // panda score icon animation
  .slide-enter, .slide-leave-to {
    transform: translateX(calc(-1 * #{$center-bw-card-0vw} - 100% - 13px)) translateY(-50%);
  }

  // restart game button animation
  .slide-horizontal {
    transform: translateX(calc(-101% - 2vw));
  }

  // start/next button animation
  .slide-fade {
    transition-property: opacity, transform;
    transition-timing-function: cubic-bezier(0.25, -0.5, 0.25, 1.25);
  }

  // start/next button animation
  .slide-fade-enter-active {
    transition-delay: 1.2s;
    transition-duration: 1.2s;
  }

  // start/next button animation
  .slide-fade-leave-active {
    transition-duration: 0.4s;
  }

  // start/next button animation
  .slide-fade-enter, .slide-fade-leave-to {
    opacity: 0;
    transform: translateX(40%) translateY(-50%)
  }
}
</style>
