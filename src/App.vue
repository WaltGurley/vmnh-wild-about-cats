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
          class="next-card-button"
          v-show="nextButtonIsVisible"
          >
            <h2 class="app-hud-text button-text">{{ nextButtonText }}</h2>
            <svg viewBox="-10 -10 137.07 183.1">
              <path d="M11.79,1.18,115.5,71.64c6,4.08,6,15.73,0,19.81L11.79,161.91C6.37,165.59,0,160.24,0,152V11.09C0,2.86,6.37-2.5,11.79,1.18Z" fill="#333537"/>
            </svg>
        </div>
      </transition>
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
      preGame: true,
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
    // This function sets the data for the 'cardsPerRound' to be used in one round of play.
    setDataForRound: function () {
      this.imageData = sampleSize(
        filter(fullImgData, img => !img.identified),
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
      this.animations.correct.seek(0);
      this.animations.incorrect.seek(0);
      this.animations.correct.pause();
      this.animations.incorrect.pause();
      if (this.currentCard === this.cardsPerRound) {
        this.finishRound()
        this.currentCard = 0
        return
      }
      this.currentCard++
    },
    // This function keeps track of the score after the user submits an answer. It also shows the 'next button' to select a new card.
    trackScore: function (correct, userChoice) {
      this.imageData[this.currentCard - 1].identified = correct
      this.score = this.imageData.filter(d => d.identified).length
      this.nextButtonIsVisible = true

      // If the user's choice is incorrect show the reference image
      if (!correct) {
        this.showReferenceImageWithID = userChoice
        // Start the panda animation for incorrect choices
        this.animations.incorrect.play()
      } else if (correct) {
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
      // this.nextButtonText = "Play Again"
    },
    // This function uses the state of the game booleans (preGame, endRound) to run other functions to setup the game, start a round, and get the next card
    actionBasedOnGameState: function () {
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
      this.startInactiveResetTimer = setTimeout( () => window.location.reload(), 120000)
    },
    // This function changes the text of the next button to reflect the action that will happen when it is clicked
    changeNextButtonText: function () {
      if (this.currentCard === 0) {
        this.nextButtonText = this.preGame ? 'Start' : 'Play Again'
        this.nextButtonIsVisible = true
      } else if (this.currentCard === this.cardsPerRound) {
        this.nextButtonText = 'Finish'
      } else { this.nextButtonText = 'Next' }
    },
    // This function creates a listener to zoom in/out on touch using the Zooming package. It returns a zoom object to attach the listener to the to card images and reference images.
    setupZooming: function () {
      const zooming = new Zooming({
        bgOpacity: 0,
        enableGrab: false,
        scaleBase: 0.9,
        // Add border radius to bottom of card image when zoomed in, lower the z-index of the visible reference image, and set image zoom callout text and icon display to none
        onBeforeOpen: (zoomedImage) => {
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
  font-family: 'Heebo', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  background-image: url('./assets/RedTile.png');
  background-position: center;
  color: #333537;
  background-color: #333537;
  overflow: hidden;

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

  button {
    cursor: pointer;
    font-size: 2.2em;
    font-weight: 400;
    color: #FFFFFF;
    background-color: #333537;
    border-radius: 1.1rem;
    border-color: #333537;
    transition: all 0.2s ease-in;

    &:hover, &:focus {
      background-color: #DD5F5B;
      border-color: #DD5F5B;
      outline: none !important;
      box-shadow: none;
    }
  }

  .card-container {
    width: 100vw;
    height: 100%;
    perspective: 10000px;
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

  .next-card-button {
    position: absolute;
    z-index: -1;
    top: 75vh;
    right: $center-bw-card-0vw;
    transform: translateX(50%) translateY(-50%);

    cursor: pointer;
    height: 7.5vh;
    display: flex;
    align-items: center;
    justify-content: center;

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

  .slide {
    transition-property: transform;
    transition-timing-function: cubic-bezier(0.25, -0.5, 0.25, 1.25);
  }

  .slide-enter-active, .slide-leave-active {
    transition-delay: 0.6s;
    transition-duration: 1.2s;
  }

  .slide-enter, .slide-leave-to {
    transform: translateX(calc(-1 * #{$center-bw-card-0vw} - 100% - 13px)) translateY(-50%);
  }

  .slide-fade {
    transition-property: opacity, transform;
    transition-timing-function: cubic-bezier(0.25, -0.5, 0.25, 1.25);
  }

  .slide-fade-enter-active {
    transition-delay: 1.2s;
    transition-duration: 1.2s;
  }

  .slide-fade-leave-active {
    transition-duration: 0.4s;
  }

  .slide-fade-enter, .slide-fade-leave-to {
    opacity: 0;
    transform: translateX(40%) translateY(-50%)
  }
}
</style>
