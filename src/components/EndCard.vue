<template>
  <div class="card slidable"
    v-bind:class="[slideType]"
  >
    <div class="card-side front">
      <img src="../assets/WildAboutCats2019Logo_trim.png" alt="Wild About Cats Logo" class="wild-about-cats-logo">
      <div class="text-group">
        <h1 class="card-header">{{ endtext[correctAnswers].greet }}</h1>
        <p class="card-subheader">
          You got <span class="bolded">{{ correctAnswers }}</span> out of <span class="bolded">{{ totalNumberCards }}</span> correct.
        </p>
        <p class="card-subheader bolded">
          {{ endtext[correctAnswers].say }}
        </p>
      </div>
      <p class="card-subheader bottom bolded">
        Press Play Again to start another round
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EndCard',
  props: ['userData', 'totalNumberCards', 'showEndCard'],
  data () {
    return {
      isFlipped: false,
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
          say: 'Some of these cats are tricky to identify'
        },
        {
          greet: 'Not bad!',
          say: 'These are some unusual cats'
        },
        {
          greet: 'Well done!',
          say: `You've got an eye for cats!`
        },
        {
          greet: 'Congratulations!',
          say: `You're a cat identification expert!`
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
$card-height: 85vh;
$card-width: 5 / 8 * $card-height;
$card-offset-x: -50%;
$card-offset-y: -50%;
.card {
  width: $card-width;
  height: $card-height;
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
    box-shadow: 0px 0px 0px 8px #ff3920 inset;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    backface-visibility: hidden;

    .card-header {
      font-size: 3.2rem;
      text-align: center;
      margin-bottom: 0;
      margin-top: 0;
    }

    .wild-about-cats-logo {
      margin-top: 3rem;
      width: 375px;
    }

    .card-subheader {
      font-size: 2.4em;
      text-align: center;
      padding-left: 3rem;
      padding-right: 3rem;
      margin-top: 1rem;
      margin-bottom: 0;

      &.bottom {
        margin-bottom: 2.4rem;
      }
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
  transition-duration: 1.6s;
  transition-timing-function: cubic-bezier(0.25, -0.5, 0.25, 1.25);
  transform-origin: left;

  &.slide-in-out-from-bottom-right {
    transform: rotateZ(90deg) translateY($card-offset-y) translateX(calc(7.5vh + 40px));
  }
}
</style>