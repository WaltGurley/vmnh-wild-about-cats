<template>
  <div class="card flippable slidable" v-bind:class="[{ flipped: isFlipped}, slideType]">
    <div class="card-side front">
      <img
        v-bind:src="cardData.src" 
        v-bind:alt="cardData.altText"
        class="card-image top-border-radius"
      >
      <div class="card-choices">
        <h2 class="card-header question">Can you identify this animal?</h2>
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
    <div v-on:click="getNextGameCard" class="card-side back">
      <img
        v-bind:src="cardData.src" 
        v-bind:alt="cardData.altText"
        class="card-image top-border-radius"
      >
      <div v-show="correct">
        <h2 class="card-header">You are correct!</h2>
        <h2 class="card-header">{{ cardData.animalName }}</h2>
        <h2 class="card-subheader sci-name">{{ cardData.scientificName }}</h2>
        <p class="card-paragraph">{{ cardData.animalDescription }}</p>
      </div>
      <div v-show="!correct">
        <h2 class="card-header">Sorry, that's incorrect</h2>
        <p class="card-paragraph">The animal in this camera trap picture is a {{ cardData.animalName }}.</p>
        <p class="card-paragraph">We'll put this card back in the deck for another round.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: ['cardData', 'currentCardID'],
  data () {
    return {
      isFlipped: false,
      correct: false
    }
  },
  methods: {
    flip: function (choice) {
      if (choice === this.cardData.animalName) {
        this.correct = true
      } else {
        this.correct = false
      }
      this.$emit('score', this.correct)
      this.isFlipped = true
    },
    getNextGameCard: function () {
      // This function sends a signal to the App component to set the currentCardID to the next card 'currentCard++'
      this.$emit('nextCard')
      this.isFlipped = false
    }
  },
  computed: {
    slideType: function () {
      let slideType = 'slide-in-from-left'
      if (this.cardData.id === this.currentCardID) {
        slideType = ''
      } else if (this.cardData.id === this.currentCardID - 1) {
        slideType = 'slide-out-bottom'
      }
      return slideType
    }
  }
}
</script>

<style lang="scss" scoped>
  $card-height: 85vh;
  $card-width: 5 / 8 * $card-height;
  $card-offset-x: -50%;
  $card-offset-y: -50%;
  .card {
    width: $card-width;
    height: 8/5 * $card-width;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX($card-offset-x) translateY($card-offset-y);

    border-style: solid;
    border-width: 8px;
    border-radius: 2rem;
    border-color: #FFFFFF;
    box-shadow: 10px 20px 40px #24383A;

    .card-side {
      border-radius: 1.6rem;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      backface-visibility: hidden;
      box-shadow: 0px 0px 0px 8px #DD5F5B inset;

      .card-image {
        width: calc(100% - 16px);
        margin-top: 8px;

        &.bottom-border-radius {
          border-bottom-right-radius:  1.6rem;
          border-bottom-left-radius:  1.6rem;
        }

        &.top-border-radius {
          border-top-right-radius: 1.1rem;
          border-top-left-radius: 1.1rem;
        }
      }

      .card-header {
        font-size: 2.2em;
        font-weight: 700;
        text-align: center;
        margin-bottom: 0;
      }

      .card-subheader {
        font-size: 2em;
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
        font-size: 1.4rem;
        padding-left: 3rem;
        padding-right: 3rem;
        margin-top: 0.4em;
      }

      .card-choices {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .card-buttons {
          display: flex;
          flex-direction: column;
          margin-bottom: 2.2rem;

          .card-button {
            // font-weight: 700;
            margin-bottom: 0.5em;
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
    }

    .back {
      background-color: #FFFFFF;
      position: relative;
      top: -100%;
      left: 0;
      transform: rotateY(180deg);
    }
  }

  .slidable {
    transition-property: transform;
    transition-duration: 1.2s;
    transition-timing-function: cubic-bezier(0.25, -0.5, 0.25, 1.25);

    &.slide-in-from-left {
      transform: translateX(50vw) translateY($card-offset-y);
    }

    &.slide-out-bottom {
      transform: translateX($card-offset-x) translateY(50vh) rotateY(180deg) rotateZ(90deg);
    }
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
    box-shadow: -10px 20px 40px #24383A;
  }
</style>
