<template>
  <div v-show="enable" class="sf-loader">
    <transition name="sf-fade" mode="out-in">
      <div class="sf-loader__overlay">
        <div class="loader-text-container">
          <div class="custom-text">
            <span class="custom-header-text">{{ customHeadertext }}</span>
          </div>
          <div class="custom-text">
            <span>{{ customText }}</span>
          </div>
        </div>
        <svg class="sf-loader__spinner" role="img" width="38" height="38" viewBox="0 0 38 38"
          xmlns="http://www.w3.org/2000/svg">
          <title>Loading...</title>
          <g fill="none" fill-rule="evenodd">
            <g transform="translate(1 1)" stroke-width="2">
              <circle stroke-opacity=".5" cx="18" cy="18" r="18" />
              <path d="M36 18c0-9.94-8.06-18-18-18">
                <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s"
                  repeatCount="indefinite" />
              </path>
            </g>
          </g>
        </svg>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'LoadingBar',
  props: {
    enable: {
      type: Boolean,
      default: false
    },
    customText: {
      type: String,
      default: ''
    },
    customHeadertext: {
      type: String,
      default: ''
    }
  }
};
</script>
<style lang="scss" scoped>
.sf-loader__overlay {
  display: flex;
  flex-direction: column-reverse;
}

.custom-text {
  text-align: center;
}

.loader-text-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 28px;
}

.custom-header-text {
  font-weight: 900;
  color: #7C7C7C;
}
</style>
