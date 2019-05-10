<template>
  <transition
    :name="leftOrRightSlide"
    v-on:leave="onCardLeave"
    v-on:after-leave="afterCardLeave"
  >
    <div
      class="card flippable"
      v-show="cardData.id === currentCardID"
      v-bind:class="{ flipped: isFlipped }"
    >
      <div class="card-side front">
        <img
          v-bind:src="cardData.src" 
          v-bind:alt="cardData.altText"
          class="card-image top-border-radius img-zoomable"
          v-bind:class="{ 'no-pointer-event': isFlipped }"
          data-action="zoom"
        >
        <aside class="image-zoom-callout">
          <p class="image-zoom-text">Touch photo to zoom</p>
          <TouchIcon/>
        </aside>
        <div class="card-choices">
          <h2 class="card-header question">Can you identify this cat?</h2>
          <div class="card-buttons">
            <button
              v-for="(name, i) in cardData.choices"
              v-bind:key="i"
              v-on:click="flip(name)"
              class="card-button"
            >
              {{ name }}
            </button>
          </div>
        </div>
      </div>
      <div class="card-side back">
        <img
          v-bind:src="cardData.src" 
          v-bind:alt="cardData.altText"
          class="card-image top-border-radius img-zoomable"
          data-action="zoom"
        >
        <aside class="image-zoom-callout">
          <p class="image-zoom-text">Touch photo to zoom</p>
          <TouchIcon/>
        </aside>
        <div v-show="correct">
          <h2 class="card-header">You are correct!</h2>
          <h2 class="card-header">{{ cardData.animalName }}</h2>
          <h2 class="card-subheader sci-name">{{ cardData.scientificName }}</h2>
          <p class="card-paragraph" v-html="cardData.animalDescription"></p>
          <p class="card-paragraph small-font">Picture source: {{ cardData.project }}</p>
        </div>
        <div v-show="!correct">
          <h2 class="card-header">Sorry, that's incorrect</h2>
          <p class="card-paragraph big-font">The animal in this camera trap picture is {{ vowelOrConsonant(cardData.animalName) }} <span class="bolded">{{ cardData.animalName }}</span>.</p>
          <p class="card-paragraph big-font">The picture to the right provides a clearer view of what {{ vowelOrConsonant(cardData.animalName) }}  <span class="bolded">{{ cardData.animalName }}</span> looks like.</p>
          <p class="card-paragraph big-font">We'll put this card back in the deck for another round.</p>
        </div>
      </div>
    </div>
   </transition>
</template>

<script>
import TouchIcon from '../assets/touchIcon2.svg'

export default {
  name: 'GameCard',
  components: {
    TouchIcon
  },
  props: ['cardData', 'currentCardID', 'zooming'],
  data () {
    return {
      isFlipped: false,
      correct: false,
      userChoice: '',
      leftOrRightSlide: 'slide-right'
    }
  },
  methods: {
    flip: function (choice) {
      if (choice === this.cardData.animalName) {
        this.correct = true
        this.leftOrRightSlide = 'slide-left'
      } else {
        this.correct = false
        this.userChoice = choice
        this.leftOrRightSlide = 'slide-right'
      }
      this.$emit('score', this.correct, this.cardData.animalName)
      this.isFlipped = true
    },
    onCardLeave: function () {
      // Must remove the flipped transform for leave transition to work
      this.isFlipped = false
    },
    afterCardLeave: function () {
      this.leftOrRightSlide = 'slide-right'
    },
    // This function adds a precedent 'a' or 'an' before an animal's name depending on if the name begins with a consonant or a vowel
    vowelOrConsonant: function (animalName) {
      const vowels = ['a', 'e', 'i', 'o', 'u']
      if (vowels.includes(animalName.charAt(0).toLowerCase())) {
        return 'an'
      } else return 'a'
    }
  },
  mounted () {
    this.zooming.listen('.img-zoomable')
  }
}
</script>

<style lang="scss" scoped>
$card-height: 85vh;
$card-width: 5 / 8 * $card-height;
$card-offset-x: -50%;
$card-offset-y: -50%;
$dark-brown: #3a2c24;
$medium-brown: #9c6e4c;
$light-brown: #f7d98f;
.card {
  width: $card-width;
  height: 8/5 * $card-width;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX($card-offset-x) translateY($card-offset-y);
  z-index: 2;

  border-style: solid;
  border-width: 8px;
  border-radius: 2rem;
  border-color: #FFFFFF;
  box-shadow: 10px 20px 40px $dark-brown;

  .card-side {
    border-radius: 1.6rem;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    backface-visibility: hidden;
    box-shadow: 0px 0px 0px 8px $light-brown inset;

    .image-zoom-callout {
      position: absolute;
      display: flex;
      align-items: flex-end;
      pointer-events: none;
      height: 6%;
      top: 0.5%;
      right: 2.5%;
      color: #FFFFFF;

      svg {
        height: 75%;
      }

      .image-zoom-text {
        font-size: 1.4rem;
        line-height: 1.1em;
        filter: drop-shadow(2px 2px 2px #000000);
      }
    }

    .card-image {
      width: calc(100% - 16px);
      margin-top: 8px;
      position: relative;
      transition: box-shadow 1s ease-in-out;

      &.full-border-radius {
        border-bottom-right-radius:  1.1rem;
        border-bottom-left-radius:  1.1rem;
        border-top-right-radius: 1.1rem;
        border-top-left-radius: 1.1rem;
      }

      &.top-border-radius {
        border-top-right-radius: 1.1rem;
        border-top-left-radius: 1.1rem;
      }
    }

    .card-header {
      font-size: 2.4rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 0;
    }

    .card-subheader {
      font-size: 1.9rem;
      font-weight: 400;
      text-align: center;
      margin-top: 0;
      margin-bottom: 0;
    }

    .sci-name {
      font-style: italic;
      font-weight: 300;
    }

    .card-paragraph {
      font-size: 1.8rem;
      padding-left: 1.4rem;
      padding-right: 1.4rem;
      margin-top: 0.8em;

      &.big-font {
        font-size: 2.0rem;
      }

      &.small-font {
        font-size: 1.6rem;
        color: lighten($dark-brown, 10%)
      }
    }

    .card-choices {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .card-buttons {
        display: flex;
        flex-direction: column;
        margin: 2.1rem 0;

        .card-button {
          margin-bottom: 1.9rem;
          padding-left: 0.6em;
          padding-right: 0.6em;
          padding-top: 0.6em;
          padding-bottom: 0.6em;
        }
      }
    }
  }

  .front {
    background-color: #FFFFFF;
    justify-content: space-between;
  }

  .back {
    background-color: #FFFFFF;
    position: relative;
    top: -100%;
    left: 0;
    transform: rotateY(180deg);
  }
}

.slide-right, .slide-left {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.25, -0.5, 0.25, 1.25);
}

.slide-right-enter {
  transform: translateX(50vw) translateY($card-offset-y);
}

.slide-right-leave-to {
  transform: translateX(100vw) translateY($card-offset-y) rotateY(180deg);
}

.slide-left-enter, .slide-left-leave-to {
  transform: translateX(-50vw) translateY($card-offset-y) rotateY(180deg);
}

.slide-left-enter-active, .slide-left-leave-active, .slide-right-leave-active, .slide-right-enter-active {
  transition-duration: 1.2s;
}

.flippable {
  transition-property: transform, box-shadow;
  transition-duration: 1.2s;
  transition-timing-function: cubic-bezier(0.25, 0, 0.25, 1.1);
  transform-style: preserve-3d;
  transform-origin: left;
}

.flipped {
  transform: translateX(calc(#{$card-offset-x} + 100%)) translateY($card-offset-y) rotateY(180deg);
  transform-origin: left;
  box-shadow: -10px 20px 40px $dark-brown;
}
</style>
