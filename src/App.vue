<template>
  <div id="app"
    v-on:click="resetOnInactivity"
    v-bind:style="{ transform: testScale }"
  >
    <div class="card-container">
      <transition
        name="slide"
      >
        <div
          class="score-icon-holder"
          v-show="scoreIsVisible"
        >
          <!-- <PandaIcon class="panda-icon"/> -->
          <img src="./assets/WildAboutCats2019Logo_small.png" alt="Wild About Cats Logo" class="wild-about-cats-logo">
          <h2 class="app-hud-text">Score:
            <span class="score bolded">{{ score }}</span>
          </h2>
        </div>
      </transition>
      <InfoCard
        v-show="showInfoCard"
        v-on:removeInfoCard="toggleInfoCard"
      />
      <StartCard
        v-on:readyStartGame="readyStartGame"
        v-bind:showStartCard="preGame"
        v-bind:gameIsReseting="gameIsReseting"
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
      <div
        v-on:click="toggleInfoCard"
        class="info-button app-hud-button-and-text"
      >
        <svg viewBox="-6 -6 168 168">
          <circle cx="78" cy="78" r="78"/>
          <path fill="#fff" d="M59 136v-4a45 45 0 0 0 9-2l3-3V78v-7a8 8 0 0 0-1-4 6 6 0 0 0-4-2 42 42 0 0 0-7-1v-4a119 119 0 0 0 22-7h3v74l3 2a36 36 0 0 0 9 3v4zM87 27a13 13 0 0 1-1 5 12 12 0 0 1-2 4 10 10 0 0 1-3 2 8 8 0 0 1-4 1c-3 0-5 0-6-2a10 10 0 0 1-2-6 13 13 0 0 1 1-5 12 12 0 0 1 2-3 11 11 0 0 1 3-3 8 8 0 0 1 4-1q8 0 8 8z"/>
        </svg>
        <h2 class="app-hud-text button-text">About</h2>
      </div>
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
      <div
        class="zoom-bg"
        v-on:click="toggleInfoCard"
      ></div>
    </div>
  </div>
</template>

<script>
import GameCard from './components/GameCard.vue'
import StartCard from './components/StartCard.vue'
import ReferenceImage from './components/ReferenceImage.vue'
import EndCard from './components/EndCard.vue'
import InfoCard from './components/InfoCard.vue'

import shuffle from 'lodash/shuffle'
import sampleSize from 'lodash/sampleSize'
import filter from 'lodash/filter'
import uniqBy from 'lodash/uniqBy'

// Load in the image data from the csv file
import fullImgData from './assets/imageData.csv'
import referenceImgData from './assets/referenceImageData.csv'

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
    InfoCard
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
      showInfoCard: false,
      scoreIsVisible: false,
      nextButtonIsVisible: false,
      gameIsReseting: false,
      nextButtonText: 'Start',
      zooming: {},
      testScale: 1
    }
  },
  methods: {
    // This function reads and parses the image data from the file 'imageData.csv' located in the 'src' folder and creates an 'img' element using the provided URL. It also creates an array of unique animal names.
    getImageDataOnLoad: function () {
      let animalNames = []
      
      fullImgData.forEach(function (row) {
        row.identified = false
        row.src = require(`./assets/images/${row.imageName.trim()}`)
        row.animalName = row.animalName.trim()
        row.scientificName = row.scientificName.trim()
        row.animalDescription = row.animalDescription.trim()
        row.project = row.project.trim()
        animalNames.push(row.animalName)
      })
  
      referenceImgData.forEach(function(row) {
        row.src = require(`./assets/images/reference/${row.imageName.trim()}`)
      })
      this.referenceCardData = referenceImgData
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
      let uniqueAnimalsNotIdentified = uniqBy(
        filter(fullImgData, img => !img.identified),
        'animalName')
      
      // If the number of unique, unidentified animals is less than the number of cards in a round pad the round with already identified images
      if (uniqueAnimalsNotIdentified.length < this.cardsPerRound) {
        const cardsToFillRound = this.cardsPerRound -
          uniqueAnimalsNotIdentified.length
        uniqueAnimalsNotIdentified = uniqueAnimalsNotIdentified.concat(
          sampleSize(
            filter(fullImgData, img => img.identified),
            cardsToFillRound
          )
        )
 
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
      this.gameIsReseting = false
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
      if (this.currentCard === this.cardsPerRound) {
        this.finishRound()
        this.currentCard = 0
        return
      }
      this.currentCard++
    },
    // This function changes the text of the next button to reflect the action that will happen when it is clicked
    changeNextButtonText: function () {
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
    trackScore: function (isCorrect, correctAnimalName) {
      this.imageData[this.currentCard - 1].identified = isCorrect
      this.score = this.imageData.filter(d => d.identified).length
      this.nextButtonIsVisible = true

      // If the user's choice is incorrect show the reference image
      if (!isCorrect) {
        this.showReferenceImageWithID = correctAnimalName
      } else if (isCorrect) {
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
      this.endRound = false
      this.currentCard = 0
      this.showReferenceImageWithID = ''
      this.gameIsReseting = true
      if (this.showInfoCard) {
        this.toggleInfoCard()
      }
    },
    // This function is called when a user presses the "start/next/play again" button. It uses the state of the game booleans (preGame, endRound) to run other functions to setup the game, start a round, and get the next card
    actionBasedOnGameState: function () {
      if (this.preGame) {
        this.startRoundSetup()
      } else if (this.endRound) {
        this.readyStartGame()
        this.startRoundSetup()
      } else { this.getNextGameCard() }
    },
    // This function toggles showing/hiding the info card
    toggleInfoCard: function () {
      this.showInfoCard = !this.showInfoCard
      document.querySelector('.zoom-bg')
        .classList.toggle('show-with-info-card')
    },
    // This function reloads the page after two minutes of inactivity.
    resetOnInactivity: function () {
      clearTimeout(this.startInactiveResetTimer)
      this.startInactiveResetTimer = setTimeout( () =>
        this.restartGame(), 120000)
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
    },
    resizeApp: function() {
      const minDimension = Math.min(window.innerWidth / 1920,
        window.innerHeight / 1080)
        this.testScale = `translate(-50%, -50%) scale(${minDimension})`
    }
  },
  beforeMount () {
    // Call the getImageDataOnLoad method to prepare the images and data before App component is mounted
    this.getImageDataOnLoad()
    // Create the zooming instance with set options for later attachment to GameCard img and ReferenceImage img
    this.setupZooming()

    this.resizeApp()
  },
  mounted () {
    // Wait to set pregame to true in order to animate start card entrance
    this.preGame = true

    window.addEventListener("resize", this.resizeApp)
  }
}
</script>

<style lang="scss">
@import './src/assets/css/fonts.scss';

$dark-brown: #3a2c24;
$medium-brown: #9c6e4c;
$light-brown: #f7d98f;

#app {
  font-family: 'Gentium Basic', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 1920px;
  height: 1080px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-image: url('./assets/background.jpg');
  background-position: center;
  color: $dark-brown;
  background-color: #f6e4cb;
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
    font-weight: 700;
    color: $dark-brown;
    margin-top: 0;
    margin-bottom: 0;
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
    background-color: $dark-brown;
    border-radius: 1.1rem;
    border-color: $dark-brown;
    transition: all 0.2s ease-in;

    &:hover, &:focus {
      background-color: $medium-brown;
      border-color: $medium-brown;
      outline: none !important;
      box-shadow: none;
    }
  }

  .card-container {
    width: 1920px;
    height: 1080px;
    perspective: 10000px;
  }

  .zoom-bg {
    position: absolute;
    width: 1920px;
    height: 1080px;
    opacity: 0;
    pointer-events: none;
    z-index: 1;
    background-color: #333537;
    transition: opacity 0.4s;

    &.show {
      opacity: 0.8;
      pointer-events: auto;
    }

    &.show-with-info-card {
      opacity: 0.8;
      pointer-events: auto;
      z-index: 100;
    }
  }

  $card-height: 0.85 * 1080px;
  $card-width: 5 / 8 * $card-height;
  $center-bw-card-0vw: (1920px / 2 - $card-width / 2) / 2;
  
  .score-icon-holder {
    position: absolute;
    top: 0.75 * 1080px;
    left: $center-bw-card-0vw;
    transform: translateX(-50%) translateY(-50%);

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .wild-about-cats-logo {
      width: 250px;
      margin-bottom: 25px;
    }

    .score {
      display: inline-block;
      color: $medium-brown;
    }
  }

  .info-button {
    position: absolute;
    z-index: -1;
    left: 2%;
    top: 7.5%;

    .button-text {
      margin-left: 0.6rem;
    }

    svg {
      height: 3.8rem;
      filter: drop-shadow(2px 2px 3px $medium-brown);

      circle {
        fill: $light-brown;
        stroke: $dark-brown;
        stroke-width: 12px;
      }

      path {
        fill: $dark-brown;
      }
    }
  }

  .restart-game-button {
    position: absolute;
    z-index: -1;
    left: 2%;
    top: 15%;

    .button-text {
      margin-left: 0.6rem;
    }

    svg {
      height: 3.8rem;
      filter: drop-shadow(2px 2px 3px $medium-brown);

      path {
        fill: $dark-brown;
      }
    }
  }

  .next-card-button {
    position: absolute;
    z-index: -1;
    top: 75%;
    right: $center-bw-card-0vw;
    transform: translateX(50%) translateY(-50%);

    .button-text {
      margin-right: 0.6rem;
    }

    svg {
      height: 90%;
      width: auto;
      filter: drop-shadow(3px 6px 7px $medium-brown);

      path {
        fill: $light-brown;
        stroke: $dark-brown;
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
