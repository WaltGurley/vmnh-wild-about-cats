<template>
  <div class="card flippable slidable" v-bind:class="{ flipped: isFlipped }">
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
            {{name}}
          </button>
        </div>
      </div>
    </div>
    <div v-on:click="flip" class="card-side back">
      <h1>BACK</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: ['cardData'],
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
        console.log("Correct", this.cardData.animalName)
      }
      this.isFlipped = !this.isFlipped
    }
  }
}
</script>

<style lang="scss" scoped>
  $card-width: 28vw;
  $card-container-height: 90vh;
  .card {
    width: $card-width;
    height: 8/5 * $card-width;
    position: absolute;
    transform: translateX(95vw) translateY(calc(#{$card-container-height} / 2 - 50%));

    border-style: solid;
    border-width: 1px;
    border-radius: 2em;
    border-color: darken(#FFFFFF, 10%);
    box-shadow: 10px 20px 40px #24383A;

    .card-side {
      border-radius: 2em;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      // justify-content: space-between;
      backface-visibility: hidden;

      .card-image {
        width: 100%;

        &.bottom-border-radius {
          border-bottom-right-radius: 2em;
          border-bottom-left-radius: 2em;
        }

        &.top-border-radius {
          border-top-right-radius: 2em;
          border-top-left-radius: 2em;
        }
      }

      .card-choices {
        height: 100%;

        .card-header {
          font-size: 2.2em;
          font-weight: 700;
          text-align: center;
        }

        .card-buttons {
          display: flex;
          flex-direction: column;

          .card-button {
            font-size: 2.2em;
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
  }

  .slide-in {
    transform: translateX(calc(50vw - 50%)) translateY(calc(50vh - 50%));
  }

  .flippable {
    transition-property: transform box-shadow;
    transition-duration: 1.2s;
    transition-timing-function: cubic-bezier(0.25, -0.5, 0.25, 1.25);
    transform-style: preserve-3d;
  }

  .flipped {
    transform: translateX(-100%) rotateY(180deg);
    transform-origin: right;
    box-shadow: -10px 10px 20px #24383A;
  }
</style>
