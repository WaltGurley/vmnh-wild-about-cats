<template>
  <div id="app" v-on:click="resetOnInactivity">
    <div class="card-container">
      <Card 
        v-for="(image, i) in imageData"
        v-bind:key="i"
        v-bind:cardData="image"
      ></Card>
      <StarterCard></StarterCard>
    </div>
  </div>
</template>

<script>
import Card from './components/Card.vue'
import StarterCard from './components/StarterCard.vue'

import shuffle from 'lodash/shuffle'
import sampleSize from 'lodash/sampleSize'
import filter from 'lodash/filter'
import uniq from 'lodash/uniq'

import fullImgData from './assets/imageData.csv'


export default {
  name: 'app',
  components: {
    Card,
    StarterCard
  },
  data () {
    return {
      imageData: [],
      uniqueAnimalNames: []
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
      // This function sets the data for the 'numberOfCards' to be used in one round of play.
      const numberOfCards = 5
      this.imageData = sampleSize(
        filter(fullImgData, img => !img.identified),
        numberOfCards
      )

      const numberOfChoices = 3
      const uniqueNames = this.uniqueAnimalNames
      this.imageData.forEach(function (data) {
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
        console.log(data.choices);
        
      })
    },
    resetOnInactivity: function () {
      // This function reloads the page after two minutes of inactivity.
      clearTimeout(this.startInactiveResetTimer)
      this.startInactiveResetTimer = setTimeout(() => window.location.reload(), 120000)
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
$card-container-height: 90vh;
#app {
  font-family: 'Heebo', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  background-image: url('./assets/RedTile.png');
  color: #333537;
  background-color: #333537;

  button {
    cursor: pointer;
    color: #FFFFFF;
    background-color: #333537;
    border-radius: 3em;
    transition: background-color 0.2s ease-in;

    &:hover {
      background-color: #DD5F5B;
    }
  }

  .card-container {
    width: 100vw;
    height: $card-container-height;
    perspective: 8000px;
  }
}
</style>
