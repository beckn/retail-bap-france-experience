<template>
  <client-only>
    <div class="location-blk d-flex w-100">
      <SfCircleIcon class="sf-circle-icon--large left-pos" aria-label="marker" icon="marker" icon-size="18px" />
      <div class="layout-container">
        <div class="location-content">
          <client-only>
            <div class="location-icon">
              <slot>
                <div>
                  <p>{{ locationText }}</p>
                </div>
                <div @click="toggleIsShow" v-e2e="'app-header-location-input-div'">
                  <template>
                    <SfButton class="button-pos sf-button--pure">
                      <span class="sf-search-bar__icon">
                        <SfIcon color="var(--c-text)" size="18px" icon="chevron_down" />
                      </span>
                    </SfButton>
                  </template>
                </div>
              </slot>
            </div>
            <div v-if="isLocationSelected">
              <input v-model="location" type="text" aria-label="Select Location" class="
                            sf-header__search
                            sf-search-bar
                            sf-header__search
                            be-search-location
                          " disabled="isActive" v-e2e="'app-header-location-input'" />
            </div>
          </client-only>
          <template>
            <div id="location" class="location-drop">
              <SfSidebar :visible="!!isLocationdropOpen" :button="false" title="My Location" @close="toggleLocationDrop"
                class="sidebar sf-sidebar--right">
                <transition name="fade">
                  <client-only>
                    <LocationSearchBar @locationSelected="locationSelected" @toggleLocationDrop="toggleLocationDrop"
                      v-e2e="'app-location-sidebar'" />
                  </client-only>
                </transition>
              </SfSidebar>
            </div>
          </template>
          <div class="popover-blk">
            <template>
              <div v-if="!!isShow" @click="toggleIsShow">
                <ModalComponent @toggleLocationDrop="toggleLocationDrop" class="modalclass"
                  v-e2e="'app-header-location-modal'" />
              </div>
            </template>
          </div>
        </div>
        <div class="user-cart-content">
          <div class="import-icon-container cart-content">
            <div class="dropdown">
              <SfImage alt="importOrderIcon" class="empty-cart__image" src="/icons/importOrderIcon.svg" width="21px"
                height="21px" />

              <div class="dropdown-content">
                <div style="display: flex; align-items: center;">
                  <SfImage alt="importOrderIcon" class="empty-cart__image" src="/icons/importOrderIcon.svg" width="10px"
                    height="11px" />
                  <span @click="isOpenTrekModal" class="gpt">Paste Order</span>
                </div>
                <div style="display: flex; align-items: center;">
                  <SfImage alt="copypast" class="empty-cart__image" src="/icons/scan.png" width="10px" height="11px" />
                  <span @click="isopenmodal" class="gpt">Scan QR</span>
                </div>
              </div>
            </div>
          </div>
          <div class="cart-content">
            <nuxt-link :to="localePath('/cart')">
              <SfButton class="button-pos sf-button--pure">
                <!-- <SfIcon icon="empty_cart" /> -->
                <SfImage alt="copypast" class="empty-cart__image" src="/icons/cart.png" width="27px" />
              </SfButton>
            </nuxt-link>
          </div>
          <div class="user-content">

            <div>
              <div>
                <SfButton class="button-pos sf-button--pure">
                  <!-- <SfIcon icon="profile" /> -->
                  <SfImage alt="copypast" class="empty-cart__image" src="/icons/profile.png" width="27px" />
                  <!-- <SfIcon
                          v-if="openHamburger"
                          icon="chevron_up"
                          size="xxs"
                        />
                        <SfIcon
                          v-if="!openHamburger"
                          icon="chevron_down"
                          size="xxs"
                        /> -->
                </SfButton>
              </div>

            </div>


          </div>
        </div>
      </div>
    </div>
  </client-only>
</template>
<script>
import {
  SfCircleIcon,
  SfButton,
  SfSidebar,
  SfIcon,
  SfImage
} from '@storefront-ui/vue';
import { ref } from '@vue/composition-api';
import LocationSearchBar from './LocationSearchBar.vue';
import ModalComponent from './ModalComponent.vue';
import { useUiState } from '~/composables';
import Dropdown from '../components/Dropdown.vue';
import DropdownContent from '../components/DropdownContent.vue';

export default {
  name: 'Location',
  components: {
    SfCircleIcon,
    SfButton,
    SfSidebar,
    SfIcon,
    LocationSearchBar,
    ModalComponent,
    Dropdown,
    DropdownContent,
    SfImage
  },

  props: {
    isDisabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isActive: false
    };
  },
  setup(props, { root }) {
    const {
      selectedLocation,
      updateLocation,
      isopenmodal,
      isOpenTrekModal
    } = useUiState();
    const isLocationdropOpen = ref(false);
    const isShow = ref(false);
    const location = ref(selectedLocation?.value?.address);
    const currentUser = root.$store.$fire.auth.currentUser;
    const isopenmodal1 = isopenmodal();

    const toggleLocationDrop = () => {
      isLocationdropOpen.value = !isLocationdropOpen.value;
    };

    const toggleIsShow = () => {
      isShow.value = !isShow.value;
    };

    const openHamburger = false;

    const locationSelected = (latitude, longitude, address) => {
      location.value = address;
      toggleLocationDrop();
      updateLocation({
        latitude: latitude,
        longitude: longitude,
        address: address
      });
    };

    return {
      isLocationdropOpen,
      toggleLocationDrop,
      isShow,
      toggleIsShow,
      location,
      locationSelected,
      currentUser,
      openHamburger,
      isopenmodal,
      isOpenTrekModal
    };
  },
  computed: {
    isLocationSelected() {
      return this.location !== '';
    },
    locationText() {
      return this.location !== '' ? 'Your location' : 'Set location';
    },
    isAuthenticatedUser() {
      return this.currentUser !== null;
    }
  }
};
</script>

<style lang="scss" scoped>
.sf-circle-icon {
  --icon-color: #f37a20;
}

.import-icon-container {
  margin-top: 3px;
}

.layout-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

.notShown {
  visibility: hidden !important;
  position: absolute;
}

.button-pos {
  display: flex;
  align-items: center;
  height: 5px;
  padding-left: 5px;
}

.location-icon {
  display: flex;
  width: 125px;
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: 13px;
  letter-spacing: 0em;
  text-align: left;
}

.sign-in-text {
  color: #f37a20;
}

.userIcon {
  background-color: #f37a20;
}

.user-cart-content {
  display: flex;
  justify-content: space-between;
  width: 8rem;
  align-items: center;
}

.profile-tooltip {
  position: relative;
}

p {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
}

.gpt {
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #000000;
  margin: 5px;
}

.profile-tooltip::before,
.profile-tooltip::after {
  --scale: 0;
  --arrow-size: 10px;
  --tooltip-color: #333;

  position: absolute;
  top: -0.25rem;
  left: 50%;
  transform: translateX(-50%) translateY(var(--translate-y, 0)) scale(var(--scale));
  transition: 150ms transform;
  transform-origin: bottom center;
}

.profile-tooltip::before {
  --translate-y: calc(-100% - var(--arrow-size));

  content: attr(data-tooltip);
  color: white;
  padding: 0.5rem;
  border-radius: 0.3rem;
  text-align: center;
  width: max-content;
  margin-left: -2rem;
  background: var(--tooltip-color);
}

.profile-tooltip:hover::before,
.profile-tooltip:hover::after {
  --scale: 1;
}

.profile-tooltip::after {
  --translate-y: calc(-1 * var(--arrow-size));

  content: '';
  border: var(--arrow-size) solid transparent;
  border-top-color: var(--tooltip-color);
  transform-origin: top center;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  padding: 12px 16px;
  z-index: 1;
}

.dropdown:hover .dropdown-content {
  display: block;
}
</style>
