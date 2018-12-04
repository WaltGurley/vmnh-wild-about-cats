<template>
  <transition
    name="slide-top-center"
  >
  <div class="card">
    <div class="card-side">
        <h1 class="card-header">About Under the Umbrella</h1>
        <p class="card-paragraph">Under the Umbrella was developed at the NCSU Libraries. Photographs are supplied from camera traps operated by eMammal (emammal.si.edu) and depict animals that live in the same habitat and range as the giant panda.</p>
        <p class="card-paragraph">For information on the Smithsonian Institution’s Privacy Statement and Terms of Use, please visit www.si.edu/privacy and www.si.edu/termsofuse.</p>
        <button
          v-on:click="$emit('removeInfoCard')"
          class="card-button"
        >
          Close
        </button>
    </div>
  </div>
  </transition>
</template>

<script>
export default {
  name: 'infoCard'
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
  z-index: 999;

  border-style: solid;
  border-width: 8px;
  border-radius: 2em;
  border-color: #FFFFFF;
  box-shadow: 10px 20px 40px #24383A;

  .card-side {
    border-radius: 1.6em;
    width: 100%;
    height: 100%;
    background-color: #FFFFFF;
    box-shadow: 0px 0px 0px 8px #ff3920 inset;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    .card-header {
      font-size: 2.4rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 0;
      margin-top: 2.4rem;
    }

    .card-paragraph {
      font-size: 2.2rem;
      font-weight: 400;
      padding-left: 2.8rem;
      padding-right: 2.8rem;
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
}

.slide-top-center-enter-active, .slide-top-center-leave-active {
  transition-duration: 1.2s;
  transform-origin: left;
}

.slide-top-center-enter, .slide-top-center-leave-to {
    transform: translateY(calc(-100vh - #{$card-width})) translateX(-$card-width)  rotateZ(90deg);
}
</style>
translateX(-100%) translateY(-100vh) rotateZ(90deg);