<template>
  <div class="card flippable slidable"
    v-bind:class="[{ flipped: isFlipped }, slideType]"
  >
    <div class="card-side front">
        <h1 class="card-header">Under the Umbrella</h1>
        <div class="panda-icon-holder">
          <PandaIcon class="panda-icon"/>
        </div>

      <div class="text-group">
        <p class="card-subheader">
          How well do you know the animals in the mountains of China?
        </p>
        <p class="card-paragraph">
          Test your ability to identify some of the animals that share a habitat with the giant panda.
        </p>
      </div>
      <button
        v-on:click="flip"
        class="card-button"
      >
        Next
      </button>
    </div>
    <div v-on:click="flip" class="card-side back">
      <div class="text-group">
        <h1 class="card-header">Under the Umbrella</h1>
        <p class="card-paragraph">
          Each card shows a photo taken by a camera trap in China.
        </p>
        <p class="card-paragraph">
          Select the correct name of the animal in the photo from the three choices.
        </p>
        <p class="card-paragraph">
          A panda will keep track of your score.
        </p>
        <p class="card-paragraph">
          Don't worry if you choose incorrectly: You can try again. The game randomly selects from dozens of images, so you'll get to learn something new each time!
        </p>
      </div>
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
import PandaIcon from '../assets/panda.svg'
export default {
  name: 'StartCard',
  components: {
    PandaIcon
  },
  props: ['showStartCard'],
  data () {
    return {
      isFlipped: false
    }
  },
  methods: {
    flip: function () {
      this.isFlipped = !this.isFlipped
    },
    startGame: function () {
      this.$emit('startGame')
      this.slideOut = true
    }
  },
  computed: {
    slideType: function () {
      console.log(this.showStartCard)
      // This function toggles the position and animation of the start card
      const slideType = this.showStartCard ? '' :
        'slide-in-out-from-bottom-left'
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

      .panda-icon-holder {
        display: flex;
        justify-content: center;
        
        .panda-icon {
          width: 100%;
          height: 100%;
        }
      }

      .card-subheader {
        font-size: 1.9rem;
        font-weight: 400;
        padding-left: 3rem;
        padding-right: 3rem;
        margin-top: 0;
      }

      .card-paragraph {
        font-size: 1.9rem;
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

    &.slide-in-out-from-bottom-left {
    transform-origin: left;
      transform: rotateX(180deg) rotateZ(-90deg) translateX(7.5vh) translateY($card-offset-y);
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

<style lang="scss">

    @keyframes rollhead {
      0% {
        transform: rotateZ(0);
      }
      25% {
        transform: rotateZ(-1deg);
      }
      75% {
        transform: rotateZ(3deg);
      }
      100% {
        transform: rotateZ(0);
      }
    }

    @keyframes moveshadow {
      0% {
        transform: translateX(0);
      }
      25% {
        transform: translateX(2px);
      }
      75% {
        transform: translateX(-9px);
      }
      100% {
        transform: translateX(0);
      }
    }

    @keyframes blinkeyes {
      0% {
        transform: scaleY(1)
      }
      3% {
        transform: scaleY(0)
      }
      6% {
        transform: scaleY(1)
      }
    }

    @keyframes flapears {
      0% {
        transform: rotateX(0)
      }
      85% {
        transform: rotateX(0)
      }
      90% {
        transform: rotateX(-20deg)
      }
      95% {
        transform: rotateX(0deg)
      }
      100% {
        transform: rotateX(-20deg)
      }
    }

      .head {
        transform-origin: center;
        animation-duration: 5s;
        animation-name: rollhead;
        animation-iteration-count: infinite;
        animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }

      [data-name="head-shadow"] {
        transform-origin: center;
        animation-duration: 5s;
        animation-name: moveshadow;
        animation-iteration-count: infinite;
        animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }

      [data-name="ears"] {
        transform-origin: center;
        animation-duration: 6s;
        animation-name: flapears;
        animation-direction: alternate;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;
      }

      .eyes {
        transform-origin: center;
        animation-duration: 4s;
        animation-name: blinkeyes;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in;
      }
</style>
