<template>
  <div id="app" v-on:click="resetOnInactivity">
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
        v-on:startGame="startGame"
        v-bind:showStartCard="preGame"
      ></StartCard>
      <EndCard
        v-bind:userData="imageData"
        v-bind:showEndCard="endRound"
      ></EndCard>
    </div>
    <div class="next-card-button">
        <h2 class="button-text">Start</h2>
        <svg viewBox="-10 -10 137.07 183.1">
          <path d="M11.79,1.18,115.5,71.64c6,4.08,6,15.73,0,19.81L11.79,161.91C6.37,165.59,0,160.24,0,152V11.09C0,2.86,6.37-2.5,11.79,1.18Z" fill="#333537"/>
        </svg>
    </div>
  </div>
</template>

<script>
import Card from './components/Card.vue'
import StartCard from './components/StartCard.vue'
import EndCard from './components/EndCard.vue'

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
    EndCard
  },
  data () {
    return {
      imageData: [],
      uniqueAnimalNames: [],
      preGame: true,
      startRound: false,
      endRound: false,
      cardsPerRound: 5,
      currentCard: 0
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
      this.setDataForRound()
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
    startGame: function () {
      // This function changes the state of the game to start a round
      this.preGame = false
      this.startRound = true
      this.getNextGameCard()
    },
    getNextGameCard: function () {
      // This function provides the iteration over the cards in a round and handles when the last card in a round is completed
      if (this.currentCard === this.cardsPerRound) {
        this.finishRound()
        this.currentCard = 0
        return
      }
      this.currentCard++
    },
    trackScore: function (correct) {
      // This function keeps track of the score for the user
      this.imageData[this.currentCard - 1].identified = correct
    },
    finishRound: function () {
      // This function changes the state of the game to the end of a round in which the score is shown
      this.startRound = false
      this.endRound = true
    },
    resetOnInactivity: function () {
      // This function reloads the page after two minutes of inactivity.
      clearTimeout(this.startInactiveResetTimer)
      this.startInactiveResetTimer = setTimeout( () => window.location.reload(), 120000)
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
  .next-card-button {
    position: fixed;
    top: 50vh;
    right: $center-bw-card-0vw;
    transform: translateX(50%) translateY(-50%);

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
    }

    svg {
      height: 90%;
      width: auto;

      path {
        stroke: #FFFFFF;
        stroke-width: 0.6rem;
      }
    }
  }
}
</style>
