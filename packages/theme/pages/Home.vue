<template>
  <div id="home">
    <div v-if="enableLoader" key="loadingCircle" class="loader-circle">
      <LoadingCircle :customText="'Importing order from Travelio'" :enable="enableLoader" />
    </div>

    <OpenSearch v-else />
    <div @click="openCart"></div>
  </div>
</template>
<script>
import OpenSearch from '../components/OpenSearch';
import { useUiState } from '~/composables';
import LoadingCircle from '~/components/LoadingCircle';
import { onBeforeMount, onMounted, ref } from '@vue/composition-api';
import helpers from '../helpers/helpers';
import * as sa from 'superagent';
import { useCart } from '@vue-storefront/beckn';

const { toggleCartSidebar } = useUiState();
export default {
  name: 'Home',
  components: {
    OpenSearch,
    LoadingCircle
  },
  methods: {
    openCart() {
      toggleCartSidebar();
    }
  },
  setup() {
    const { load, clear } = useCart();
    const enableLoader = ref(true);

    onBeforeMount(() => {
      clear()
      localStorage.clear();

      let URL = window.location.href;

      if (URL.includes('?')) {
        let start = URL.indexOf('=') + 1;
        const orderObjectUrl = decodeURIComponent(URL.substring(start));

        sa.get(orderObjectUrl).then(res => {
          localStorage.setItem('importedOrderObject', res.text
          )
          enableLoader.value = false
        }
        ).catch(e => console.error(e))
      }
    })



    onMounted(() => {
      // fetch('')
      setTimeout(() => {
        enableLoader.value = false
      }, 2000);

      if (localStorage.getItem('cartData')) {
        const cartData = JSON.parse(localStorage.getItem('cartData'));
        const days = helpers.calculateDays(cartData.cartTime, new Date());
        if (days > 7) {
          localStorage.removeItem('cartData');
          localStorage.removeItem('transactionId');
        }
      }
      load();
    });

    return {
      enableLoader
    };
  }
};
</script>

<style lang="scss" scoped>
.loader-circle {
  width: 100%;
  position: fixed;
  z-index: 1;
  // top: 130px;
  left: 0;
  height: 95vh;
}
</style>
