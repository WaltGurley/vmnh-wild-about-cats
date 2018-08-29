<template>
  <div class="card flippable slidable"
    v-bind:class="{ flipped: isFlipped, 'slide-out': slideOut }"
  >
    <div class="card-side front">
      <h1 class="card-header">Under the Umbrella</h1>
      <p class="card-paragraph">
        How well do you know the animals in the mountains of China? Test your ability to identify other animals that share the giant panda habitat.
      </p>
      <button
        v-on:click="flip"
        class="card-button"
      >
        Next
      </button>
    </div>
    <div v-on:click="flip" class="card-side back">
      <p class="card-paragraph">
        Each card shows a photo taken by a camera trap in China. Select the name of the animal from the three choices.
      </p>
      <p class="card-paragraph">
        A panda will keep score, but don't worry if you choose incorrectly: You can try again. The game randomly selects from dozens of images, so you'll get to learn something new each time!
      </p>
      <button
        v-on:click="startGame"
        class="card-button"
      >
        Start
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StarterCard',
  props: ['cardData'],
  data () {
    return {
      isFlipped: false,
      correct: false,
      slideOut: false
    }
  },
  methods: {
    flip: function () {
      this.isFlipped = !this.isFlipped
    },
    startGame: function () {
      this.$emit('startGame')
    }
  }
}
</script>

<style lang="scss" scoped>
  $card-width: 28vw;
  $card-container-height: 90vh;
  $card-offset-x: -50%;
  $card-offset-y: -50%;
  .card {
    width: $card-width;
    height: 8/5 * $card-width;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX($card-offset-x) translateY($card-offset-y);

    border-radius: 2em;
    box-shadow: 10px 20px 40px #24383A;

    .card-side {
      border-radius: 2em;
      width: 100%;
      height: 100%;
      box-shadow: 0px 0px 0px 1.6em #DD5F5B inset;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      backface-visibility: hidden;

      .card-header {
        font-size: 3.2rem;
        margin-bottom: 1rem;
      }

      .card-paragraph {
        font-size: 1.8rem;
        padding-left: 3rem;
        padding-right: 3rem;
        margin-top: 0;
      }

      .card-button {
        padding-left: 1.8em;
        padding-right: 1.8em;
        padding-top: 0.6em;
        padding-bottom: 0.6em;
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

  .slide-out {
    transform: translateX(calc(50vw - 50%)) translateY(calc(#{$card-container-height} / 2 - 50%));
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
    box-shadow: 10px 20px 40px #24383A;
  }
</style>
