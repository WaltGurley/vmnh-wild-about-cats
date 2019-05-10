<template>
  <transition
    name="slide-bottom-left"
    v-on:leave="onCardLeave"
  >
    <div class="card flippable"
      v-show="showStartCard"
      v-bind:class="{ flipped: isFlipped }"
    >
      <div class="card-side front">
        <img src="../assets/WildAboutCats2019Logo_small.png" alt="Wild About Cats Logo" class="wild-about-cats-logo">
        <div class="text-group">
          <p class="card-subheader bolded">
            Do you know your cats?
          </p>
          <p class="card-paragraph">
            See if you can identify a variety of cats from around the world in this collection of camera trap pictures from the eMammal research archive.
          </p>
        </div>
        <button
          v-on:click="flip"
          class="card-button"
        >
          Next
        </button>
      </div>
      <div class="card-side back">
        <div class="text-group">
          <h1 class="card-header">How to play</h1>
          <p class="card-paragraph">
            Each card shows a picture of a cat in the wild taken with a camera trap.
          </p>
          <p class="card-paragraph">
            Select the correct name of the cat in the picture from the three choices.
          </p>
          <p class="card-paragraph">
            There are five pictures in a round. Can you identify all five? Keep track of your score!
          </p>
          <p class="card-paragraph">
            It's okay if you choose incorrectly-You can try again in another round. The game randomly selects from dozens of pictures, so you'll get to learn something new each time!
          </p>
        </div>
        <h2 class="card-subheader bolded">
          Press Start to begin
        </h2>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'StartCard',
  props: ['showStartCard', 'cardsPerRound', 'gameIsReseting'],
  data () {
    return {
      isFlipped: false
    }
  },
  methods: {
    flip: function () {
      this.isFlipped = !this.isFlipped
      this.$emit('readyStartGame')
    },
    onCardLeave: function () {
      // Must remove the flipped transform for leave transition to work
      this.isFlipped = false
    }
  },
  watch: {
    // Flip the start card to front if flipped and change occurs during reset
    gameIsReseting: function (isResetting) {
      if (this.isFlipped && isResetting) {
        this.isFlipped = false;
      }
    }
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
  height: $card-height;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX($card-offset-x) translateY($card-offset-y);

  border-style: solid;
  border-width: 8px;
  border-radius: 2em;
  border-color: #FFFFFF;
  box-shadow: 10px 20px 40px $dark-brown;

  .card-side {
    border-radius: 1.6em;
    width: 100%;
    height: 100%;
    box-shadow: 0px 0px 0px 8px $light-brown inset;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    backface-visibility: hidden;

    .card-header {
      font-size: 3.6rem;
      text-align: center;
      margin-top: 0;
      margin-bottom: 1rem;
    }

    .card-subheader {
      font-size: 2.6rem;
      font-weight: 400;
      text-align: center;
      margin-top: 0;
      margin-bottom: 2.4rem;
    }

    .wild-about-cats-logo {
      margin-top: 3rem;
      width: 375px;
    }

    .card-paragraph {
      font-size: 2.0rem;
      font-weight: 400;
      padding-left: 2.8rem;
      padding-right: 2.8rem;
      margin-top: 1.8rem;
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

  .back {
    background-color: #FFFFFF;
    position: relative;
    top: -100%;
    left: 0;
    transform: rotateY(180deg);

    .card-header {
      margin-top: 2.4rem;
    }

    .card-paragraph {
      margin-bottom: 2.7rem;
    }
  }
}

.slide-bottom-left {
  transition-property: transform;
  transition-duration: 1.6s;
  transition-timing-function: cubic-bezier(0.25, -0.5, 0.25, 1.25);
  transform-origin: left;
}

// card slide animation
.slide-bottom-left-active {
  transition-delay: 0.6s;
  transition-duration: 1.2s;
}

// card slide enter animation starting position
.slide-bottom-left-enter {
  transform: rotateZ(-90deg) translateX(calc(#{-$card-width} - 7.5vh - 48px)) translateY($card-offset-y);
}

// card slide exit animation final position
.slide-bottom-left-leave-to {
  transform: rotateX(180deg) rotateZ(-90deg) translateX(calc(7.5vh + 40px)) translateY($card-offset-y);
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
