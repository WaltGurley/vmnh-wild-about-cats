<template>
  <div id="app" v-on:click="resetOnInactivity">
    <transition
      name="slide"
    >
      <div
        class="score-icon-holder"
        v-show="scoreIsVisible"
      >
        <PandaIcon class="panda-icon"/>
      </div>
    </transition>

    <div class="card-container">
      <Card 
        v-for="image in imageData"
        v-bind:key="image.id"
        v-bind:cardData="image"
        v-bind:currentCardID="currentCard"
        v-on:nextCard="getNextGameCard"
        v-on:score="trackScore"
      ></Card>

      <StartCard
        v-on:readyStartGame="readyStartGame"
        v-bind:showStartCard="preGame"
      ></StartCard>

      <EndCard
        v-bind:userData="imageData"
        v-bind:totalNumberCards="cardsPerRound"
        v-bind:showEndCard="endRound"
      ></EndCard>
    </div>

    <transition
      name="slide-fade"
      v-on:after-leave="changeNextButtonText"
    >
      <div
        v-on:click="actionBasedOnGameState"
        class="next-card-button"
        v-show="nextButtonIsVisible"
        >
          <h2 class="button-text">{{ nextButtonText }}</h2>
          <svg viewBox="-10 -10 137.07 183.1">
            <path d="M11.79,1.18,115.5,71.64c6,4.08,6,15.73,0,19.81L11.79,161.91C6.37,165.59,0,160.24,0,152V11.09C0,2.86,6.37-2.5,11.79,1.18Z" fill="#333537"/>
          </svg>
      </div>
    </transition>
  </div>
</template>

<script>
import Card from './components/Card.vue'
import StartCard from './components/StartCard.vue'
import EndCard from './components/EndCard.vue'
import PandaIcon from './assets/panda.svg'

import shuffle from 'lodash/shuffle'
import sampleSize from 'lodash/sampleSize'
import filter from 'lodash/filter'
import uniq from 'lodash/uniq'

import fullImgData from './assets/imageData.csv'

export default {
  name: 'app',
  components: {
    Card,
    StartCard,
    EndCard,
    PandaIcon
  },
  data () {
    return {
      imageData: [],
      uniqueAnimalNames: [],
      cardsPerRound: 3,
      preGame: true,
      startRound: false,
      endRound: false,
      currentCard: 0,
      scoreIsVisible: false,
      nextButtonIsVisible: false,
      nextButtonText: 'Start'
    }
  },
  methods: {
    getImageDataOnLoad: function () {
      // This function reads and parses the image data from the file 'imageData.csv' located in the 'src' folder and creates an 'img' element using the provided URL. It also creates an array of unique animal names.
      let animalNames = []
      fullImgData.forEach(function (row) {
        row.identified = false
        row.src = require(`./assets/images/${row.imageName}`)
        animalNames.push(row.animalName)
      })
      this.uniqueAnimalNames = uniq(animalNames)
      console.log("this is the start of the game")
    },
    setDataForRound: function () {
      // This function sets the data for the 'cardsPerRound' to be used in one round of play.
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
    readyStartGame: function () {
      // This function changes the state of the game to prepare to start a round
      this.endRound = false
      this.scoreIsVisible = true
      this.nextButtonIsVisible = true
      this.setDataForRound()
      console.log("are you ready to play? click start!")
    },
    startRoundSetup: function () {
      this.preGame = false
      this.startRound = true
      this.getNextGameCard()
      console.log("the round is beginning")
    },
    getNextGameCard: function () {
      // This function provides the iteration over the cards in a round and handles when the last card in a round is completed
      this.nextButtonIsVisible = false
      if (this.currentCard === this.cardsPerRound) {
        this.finishRound()
        this.currentCard = 0
        return
      }
      this.currentCard++
      console.log("getting a new card")
    },
    trackScore: function (correct) {
      // This function keeps track of the score for the user
      this.imageData[this.currentCard - 1].identified = correct
      this.nextButtonIsVisible = true
    },
    finishRound: function () {
      // This function changes the state of the game to the end of a round in which the score is shown
      this.startRound = false
      this.endRound = true
      // this.nextButtonText = "Play Again"
      console.log("the round is done")
    },
    actionBasedOnGameState: function () {
      if (this.preGame) {
        this.startRoundSetup()
      } else if (this.endRound) {
        this.readyStartGame()
        this.startRoundSetup()
      } else { this.getNextGameCard() }
    },
    resetOnInactivity: function () {
      // This function reloads the page after two minutes of inactivity.
      clearTimeout(this.startInactiveResetTimer)
      this.startInactiveResetTimer = setTimeout( () => window.location.reload(), 120000)
    },
    changeNextButtonText: function () {
      if (this.currentCard === 0) {
        this.nextButtonText = this.preGame ? 'Start' : 'Play Again'
        this.nextButtonIsVisible = true
      } else if (this.currentCard === this.cardsPerRound) {
        this.nextButtonText = 'Finish'
      } else { this.nextButtonText = 'Next' }
    }
  },
  beforeMount () {
    // Call the getImageDataOnLoad method to prepare the images and data before App component is mounted
    this.getImageDataOnLoad()
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
    top: 50vh;
    left: $center-bw-card-0vw;
    transform: translateX(-50%) translateY(-50%);
    filter: drop-shadow(5px 10px 8px #24383A);

    display: flex;
    justify-content: center;
    
    .panda-icon {
      width: 100%;
      height: 100%;
    }
  }

  .next-card-button {
    position: absolute;
    top: 50vh;
    right: $center-bw-card-0vw;
    transform: translateX(50%) translateY(-50%);

    cursor: pointer;
    height: 7.5vh;
    display: flex;
    align-items: center;
    justify-content: center;

    .button-text {
      font-size: 3.2em;
      font-weight: 400;
      color: #FFFFFF;
      margin-top: 0;
      margin-bottom: 0;
      margin-right: 0.6rem;
      filter: drop-shadow(3px 6px 2px #24383A);
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
    transform: translateX(calc(-1 * #{$center-bw-card-0vw} - 101%)) translateY(-50%);
  }

  .slide-fade{
    transition-property: opacity;
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
  }
}
</style>
