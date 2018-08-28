<template>
  <div class="card flippable slidable"
    v-bind:class="{ flipped: isFlipped, 'slide-in': slideIn }"
  >
    <div class="card-side front">
      <h1 class="card-header">Under the Umbrella</h1>
      <p class="card-paragraph">
        Test your ability to identify other animals that share the giant panda habitat.
      </p>
      <ol class="card-list card-paragraph start-card-paragraph">
        <li class="card-list-item">Each card shows a photo taken by a camera trap in China.</li>
        <li class="card-list-item">Select the name of the animal from the three choices.</li>
      </ol>
      <button
        v-on:click="flipped('')"
        class="card-button start-card-button"
      >
        Next
      </button>
    </div>
    <div v-on:click="flip" class="card-side back">
      <h1>BACK</h1>
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
      slideIn: true
    }
  },
  methods: {
    flip: function (choice) {
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
      }

      .card-paragraph {
        font-size: 2rem;
        padding-left: 3rem;
        padding-right: 3rem;
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
    transform: translateX(calc(50vw - 50%)) translateY(calc(#{$card-container-height} / 2 - 50%));
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
