<template>
  <transition>
    <div
      class="card"
      v-show="this.cardData.id === this.currentCardID"
    >
      <div class="card-side front">
        <img
          v-bind:src="cardData.src" 
          v-bind:alt="cardData.altText"
          class="card-image top-border-radius img-zoomable"
          data-action="zoom"
        >
        <aside class="image-zoom-callout">
          <p class="image-zoom-text">Touch to zoom</p>
          <TouchIcon/>
        </aside>
        <p class="card-paragraph">For reference, here's an example of a</p>
        <p class="card-paragraph">{{ cardData.animalName }}</p>
      </div>
    </div>
   </transition>
</template>

<script>
import TouchIcon from '../assets/touchIcon2.svg'
// import Zooming for image zoom
import Zooming from 'zooming'

const zooming = new Zooming({
  bgOpacity: 0,
  enableGrab: false,
  scaleBase: 0.9,
  // Add border radius to bottom of image when zoomed
  onBeforeOpen: () => {
    document.querySelectorAll('.img-zoomable').forEach(img =>
      img.classList.add('full-border-radius')
    )
    document.querySelectorAll('.next-card-button').forEach(d =>
      d.setAttribute('disabled', true)
    )
  },
  // Remove border radius from bottom of image when back to card
  onClose: () => {
    document.querySelectorAll('.img-zoomable').forEach(img =>
      img.classList.remove('full-border-radius')
    )
    document.querySelectorAll('.next-card-button').forEach(d =>
      d.removeAttribute('disabled')
    )
  }
})

export default {
  name: 'ReferenceCard',
  components: {
    TouchIcon
  },
  props: ['cardData', 'currentCardID'],
  data () {
    return {
      correct: false,
      leftOrRightSlide: 'slide-right'
    }
  },
  methods: {

  },
  mounted: function () {
    zooming.listen('.img-zoomable')
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

    .image-zoom-callout {
      position: absolute;
      display: flex;
      align-items: flex-end;
      pointer-events: none;
      height: 6%;
      top: 0.5%;
      right: 2.5%;
      // transform: translateX(50%);
      color: #FFFFFF;

      svg {
        height: 75%;
      }

      .image-zoom-text {
        font-size: 1.4rem;
        line-height: 1.1em;
        filter: drop-shadow(2px 2px 2px #000000);
      }
    }

    .card-image {
      width: calc(100% - 16px);
      margin-top: 8px;
      position: relative;

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

    .card-header {
      font-size: 2.2rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 0;
    }

    .card-subheader {
      font-size: 1.9rem;
      font-weight: 400;
      text-align: center;
      margin-top: 0;
      margin-bottom: 0;
    }

    .card-paragraph {
      font-size: 1.9rem;
      font-weight: 400;
      padding-left: 3rem;
      padding-right: 3rem;
      margin-top: 1rem;
      margin-bottom: 0;
    }
  }

  .front {
    background-color: #FFFFFF;
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
