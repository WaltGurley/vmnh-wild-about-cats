<template>
  <transition name="slide-up">
    <div
      class="reference-image-holder"
      v-show="cardData.animalName === referenceAnimal"
    >
      <img
        v-bind:src="cardData.src" 
        v-bind:alt="cardData.altText"
        class="reference-image full-border-radius img-zoomable"
        data-action="zoom"
      >
      <aside class="image-zoom-callout reference-image-callout">
        <p class="image-zoom-text">Touch photo to zoom</p>
        <TouchIcon/>
      </aside>
    </div>
   </transition>
</template>

<script>
import TouchIcon from '../assets/touchIcon2.svg'

export default {
  name: 'ReferenceImage',
  components: {
    TouchIcon
  },
  props: ['cardData', 'referenceAnimal', 'zooming'],
  data () {
    return {
      leftOrRightSlide: 'slide-right'
    }
  },
  mounted () {
    this.zooming.listen('.img-zoomable')
  }
}
</script>

<style lang="scss" scoped>
$card-height: 0.85 * 1080px;
$card-width: 5 / 8 * $card-height;
$card-offset-x: -50%;
$card-offset-y: -50%;
$dark-brown: #3a2c24;
.reference-image-holder {
  width: $card-width;
  height: auto;
  position: absolute;
  top: (1080px - $card-height) / 2;
  right: 2%;

  .image-zoom-callout {
    position: absolute;
    display: flex;
    align-items: flex-end;
    pointer-events: none;
    height: $card-height * 0.06;
    top: 0.5%;
    right: 2.5%;
    color: #FFFFFF;

    svg {
      height: 2.58rem;
    }

    .image-zoom-text {
      font-size: 1.4rem;
      line-height: 1.1em;
      filter: drop-shadow(2px 2px 2px #000000);
    }
  }

  .reference-image {
    max-width: 100%;
    max-height: 60vh;
    position: relative;
    float: right;
    top: 0;
    box-shadow: 6px 16px 40px $dark-brown;

    &.full-border-radius {
      border-bottom-right-radius: 1.1rem;
      border-bottom-left-radius: 1.1rem;
      border-top-right-radius: 1.1rem;
      border-top-left-radius: 1.1rem;
    }
  }
}

.slide-up {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.25, -0.5, 0.25, 1.25);
}

.slide-up-enter, .slide-up-leave-to {
  transform: translateY(calc(-100% - (1080px - #{$card-height} + 40px))) rotateZ(90deg);
}

.slide-up-leave-active, .slide-up-enter-active {
  transition-duration: 1.2s;
}
</style>
