<template>
  <div class="s-footer">
    <div class="f-price-container">
      <div class="holder">
        <div class="f-total">Total</div>
        <div>
          <span class="f-p-total">₹ {{ formatPrice(totalPrice) }} </span><span class="f-items">{{ totalItem }}
            Articles</span>
        </div>
      </div>
    </div>
    <button v-e2e="'footer-button'" :value="buttonText" class="sf-button f-button" :class="{
      'color-primary ': buttonEnable,
      'is-disabled--button': !buttonEnable
    }" :disabled="!buttonEnable" link="" @click="$emit('buttonClick')">
      <!-- button icon template  -->
      <slot name="buttonIcon" />
      <div class="f-btn-text">{{ buttonText }}</div>
      <SfIcon icon="chevron_right" color="white" :coverage="1" size="xxs" />
    </button>
  </div>
</template>
<script>
import { SfIcon } from '@storefront-ui/vue';

export default {
  name: 'Footer',
  components: {
    SfIcon
  },
  props: {
    totalPrice: { type: Number },
    totalItem: { type: Number, default: 0 },
    footerEnable: { type: Boolean, default: true },
    buttonEnable: { type: Boolean, default: true },
    buttonText: { type: String, default: '' }
  },
  setup() {
    return {};
  },
  methods: {
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(',', '.');
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  }
};
</script>
<style lang="scss" scoped>
.color-def {
  background: #cacaca;
}
</style>
