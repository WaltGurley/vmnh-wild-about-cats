<template>
  <transition>
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
      <aside class="image-zoom-callout">
        <p class="image-zoom-text">Touch to zoom</p>
        <TouchIcon/>
      </aside>
    </div>
   </transition>
</template>

<script>
import TouchIcon from '../assets/touchIcon2.svg'

export default {
  name: 'ReferenceCard',
  components: {
    TouchIcon
  },
  props: ['cardData', 'referenceAnimal', 'zooming'],
  data () {
    return {
      leftOrRightSlide: 'slide-right'
    }
  },
  methods: {

  },
  mounted () {
    this.zooming.listen('.img-zoomable')
    console.log(this.cardData.animalName)
  }
}
</script>

<style lang="scss" scoped>
$card-height: 85vh;
$card-width: 5 / 8 * $card-height;
$card-offset-x: -50%;
$card-offset-y: -50%;
.reference-image-holder {
  width: $card-width;
  position: absolute;
  top: 25%;
  right: 2%;
  transform: translateY($card-offset-y);

  .image-zoom-callout {
    position: absolute;
    display: flex;
    align-items: flex-end;
    pointer-events: none;
    height: 6%;
    top: 5%;
    right: 1%;
    // transform: translateX(50%);
    color: #FFFFFF;

    svg {
      height: 2.6rem;
    }

    .image-zoom-text {
      font-size: 1.4rem;
      line-height: 1.1em;
      // margin: 0;
      filter: drop-shadow(2px 2px 2px #000000);
    }
  }

  .reference-image {
    width: 100%;
    position: relative;
    box-shadow: 10px 20px 40px #24383A;

    &.full-border-radius {
      border-bottom-right-radius: 1.1rem;
      border-bottom-left-radius: 1.1rem;
      border-top-right-radius: 1.1rem;
      border-top-left-radius: 1.1rem;

      border-width: 4px;
      border-color: #DD5F5B;
    }

    &.top-border-radius {
      border-top-right-radius: 1.1rem;
      border-top-left-radius: 1.1rem;
    }
  }
}

.slide-up {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.25, -0.5, 0.25, 1.25);
}

.slide-up-enter {
  transform: translateX(50vw) translateY($card-offset-y);
}

.slide-up-leave-to {
  transform: translateX(100vw) translateY($card-offset-y) rotateY(180deg);
}

.slide-up-leave-active, .slide-up-enter-active {
  transition-duration: 1.2s;
}
</style>
