<template>
  <div class="card slidable"
    v-bind:class="[slideType]"
  >
    <div class="card-side front">
      <div class="text-group">
        <h1 class="card-header">{{ endtext[correctAnswers].greet }}</h1>
        <p class="card-subheader">
          You got {{ correctAnswers }} out of {{ totalAnswers }} correct.
        </p>
        <p class="card-paragraph">
          {{ endtext[correctAnswers].say }}
        </p>
      </div>
      <div class="panda-icon-holder">
        <PandaIcon class="panda-icon"/>
      </div>
      <button
        class="card-button"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import PandaIcon from '../assets/panda.svg'
export default {
  name: 'EndCard',
  components: {
    PandaIcon
  },
  props: ['userData', 'showEndCard'],
  data () {
    return {
      isFlipped: false,
      totalAnswers: this.userData.length,
      endtext: [
        {
          greet: 'Whoops',
          say: 'Do you want to try again?'
        },
        {
          greet: 'Nice Try',
          say: 'Do you want to play again?'
        },
        {
          greet: 'Good job!',
          say: 'These animals are tricky to identify.'
        },
        {
          greet: 'Not bad!',
          say: 'These are unusual animals.'
        },
        {
          greet: 'Well done!',
          say: `You've got an eye for wildlife!`
        },
        {
          greet: 'Congratulations!',
          say: `You're an ecosystem expert!`
        }
      ]
    }
  },
  methods: {
    startGame: function () {
      this.$emit('startGame')
      this.slideOut = true
    }
  },
  computed: {
    correctAnswers: function () {
      const correct = this.userData.filter(d => d.identified).length
      return correct
    },
    slideType: function () {
      // This function toggles the position and animation of the end card
      const slideType = this.showEndCard ? '' :
        'slide-in-out-from-bottom-right'
      return slideType
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

    border-style: solid;
    border-width: 8px;
    border-radius: 2em;
    border-color: #FFFFFF;
    box-shadow: 10px 20px 40px #24383A;

    .card-side {
      border-radius: 1.6em;
      width: 100%;
      height: 100%;
      box-shadow: 0px 0px 0px 8px #DD5F5B inset;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      backface-visibility: hidden;

      .card-header {
        font-size: 3.2rem;
        margin-top: 2.4rem;
        text-align: center;
        margin-bottom: 0;
      }

      .card-subheader {
        font-size: 2.2em;
        font-weight: 700;
        // font-style: italic;
        text-align: center;
        padding-left: 3rem;
        padding-right: 3rem;
      }

      .card-paragraph {
        font-size: 2.2em;
        font-weight: 400;
        padding-left: 3rem;
        padding-right: 3rem;
        margin-top: 1rem;
        margin-bottom: 0;
      }

      .card-button {
        padding-left: 1.8rem;
        padding-right: 1.8rem;
        padding-top: 0.6rem;
        padding-bottom: 0.6rem;
        margin-bottom: 3.2rem;
      }
    }

    .front {
      background-color: #FFFFFF;
    }
  }

  .slidable {
    transition-property: transform;
    transition-duration: 1.2s;
    transition-timing-function: cubic-bezier(0.25, -0.5, 0.25, 1.25);

    &.slide-in-out-from-bottom-right {
      transform-origin: left;
      transform: rotateZ(90deg) translateY($card-offset-y);
    }
  }
</style>