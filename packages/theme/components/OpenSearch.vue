<template>
  <client-only>
    <div>
      <div class="open-search header-top-space">
        <h3>
          Open <br />
          Commerce
        </h3>
        <h4>for All</h4>

        <p>
          A global marketplace to discover and buy anything you need. Just type
          what you want to buy and we'll take care of the rest.
        </p>
        <div class="open-search-input">
          <input
            v-on:keyup.enter="openSearch"
            v-model="message"
            :valid="false"
            errorMessage="errer"
            type="text"
            placeholder="Search for anything"
            :disabled="
              !selectedLocation.latitude || !selectedLocation.longitude
            "
            v-e2e="'home-search-input'"
          />
          <SfButton
            class="button-pos sf-button--pure color-primary"
            :class="{
              'is-disabled--button':
                !selectedLocation.latitude || !selectedLocation.longitude
            }"
            @click="openSearch"
            :disabled="
              !selectedLocation.latitude || !selectedLocation.longitude
            "
            v-e2e="'home-search-button'"
          >
            <span class="sf-search-bar__icon">
              <SfIcon color="var(--c-text)" size="18px" icon="search" />
            </span>
          </SfButton>
        </div>
        <div v-if="errorMsg" class="error-msg">Please fill out this field.</div>
      </div>
      <div>
        <ModalSlide :visible="openTrekModal" @close="isOpenTrekModal">
          <div class="modal-heading">Imported Order</div>
          <div>
            <hr class="sf-divider" />
          </div>

          <div class="modal-body">
            <div>
              <div
                style="display: flex; justify-content: flex-start; align-items: center; width: 100%; "
              >
                <SfImage
                  style="width: 100%;"
                  :width="328"
                  :height="142"
                  alt=""
                  class="empty-cart__image trek-item-image"
                  :src="
                    importedOrderObject !== null
                      ? importedOrderObject.message.order.item[0].descriptor
                          .images[0]
                      : ''
                  "
                />
              </div>

              <br />
              <div class="support-text">
                You appear to have placed an order for "{{
                  importedOrderObject !== null
                    ? importedOrderObject.message.order.item[0].descriptor.name
                    : ''
                }}"
                <br />
                <div class="scrollable-div">
                  <div style="display:flex; justify-content: space-between; ">
                    <div>
                      <span class="trektittle">
                        {{
                          importedOrderObject !== null
                            ? importedOrderObject.message.order.item[0]
                                .descriptor.name
                            : ''
                        }}</span
                      >
                    </div>
                    <div>
                      <span class="trektittle">Order ID:</span>
                      <span
                        style="    text-overflow: ellipsis;
    overflow: hidden;
    width: 100px;
    display: block;"
                        >{{
                          importedOrderObject !== null
                            ? importedOrderObject.message.order.id
                            : ''
                        }}</span
                      >
                    </div>
                  </div>
                  <div>
                    <P style="text-align: center;">
                      <!-- <span class="trektittle">The Orchad Greens Resort & SPA,</span>
                      <br />

                      Log Huts Area Rd, Old Manali, Manali, Himachal Pradesh
                      175131 -->
                      {{
                        importedOrderObject !== null
                          ? importedOrderObject.message.order.item[0].descriptor
                              .short_desc
                          : ''
                      }}
                    </P>
                  </div>
                  <!-- <div style="display:flex; justify-content: space-between; ">
                  <div>
                    <span class="trektittle"> Booked on</span>
                  </div>
                  <div>
                    <span>21st Jun 2021, 12:21pm</span>
                  </div>
                </div> -->
                  <div style="display:flex; justify-content: space-between; ">
                    <div>
                      <span class="trektittle">No.of Travellers</span>
                    </div>
                    <div>
                      <span>01 </span>
                    </div>
                  </div>
                  <div style="display:flex; justify-content: space-between; ">
                    <div>
                      <span class="trektittle"> Total Price</span>
                    </div>
                    <div>
                      <span
                        >€
                        {{
                          formatPrice(
                            importedOrderObject !== null
                              ? importedOrderObject.message.order.item[0].price
                                  .value
                              : ''
                          )
                        }}</span
                      >
                    </div>
                  </div>

                  <!-- Your content goes here -->
                </div>

                Would you like to shop for items related to this order?
              </div>

              <div>
                <SfButton
                  class="support-btns"
                  aria-label="Close modal"
                  type="button"
                  @click="himalayan"
                  >Yes! Show me the list</SfButton
                >
              </div>

              <div @click="isOpenTrekModal" class="btn">
                No, I have everything I need
              </div>
            </div>
          </div>
        </ModalSlide>
        <ModalSlide
          class="fetch-GPT-modal"
          :visible="enableLoader"
          @close="enableLoader = false"
        >
          <div style="height: 375px;">
            <div class="modal-heading">Imported Order</div>
            <div>
              <hr class="sf-divider" />
            </div>

            <div>
              <LoadingCircle
                :customHeadertext="'Please wait,'"
                :customText="
                  'while we connect to ChatGPT to create a shopping list for you!'
                "
                :enable="enableLoader"
                key="loding-cir"
              />
            </div>

            <div class="powered-by-container-texts">
              <span class="powered-up-text">Powered by</span>

              <SfImage
                alt="chat-gpt-icon"
                class="chat-gpt-icon"
                src="/icons/chatgpt.png"
                width="52px"
                height="10px"
              />
            </div>
          </div>
        </ModalSlide>

        <ModalSlide
          :visible="shopinglist"
          @close="
            shopinglist = false;
            selectedTrackingId = null;
          "
        >
          <div class="modal-heading">Shopping List</div>
          <div>
            <hr class="sf-divider" />
          </div>
          <div class="modal-body">
            <div class="support-text">
              <b>The best thing about a vacation, is planning it!</b>
              <br />

              <vue-typer
                @completed="onComplete"
                :repeat="0"
                text="Here are some essential items you may need:"
              ></vue-typer>
            </div>

            <div v-if="isRenderShoppingItems" class="shopping-container">
              <label
                v-for="(item, idx) in shopinglistArray"
                :key="idx"
                class="container"
              >
                <vue-typer :repeat="0" :text="item"></vue-typer>
                <input
                  type="checkbox"
                  checked="checked"
                  :value="item"
                  v-model="selectedLocations"
                />
                <span class="checkmark"></span>
              </label>
            </div>

            <div
              style="display: flex; align-items: center; justify-content: center;"
            >
              <span class="gpt">Powered by</span>
              <div style="margin-left: 4px;">
                <SfImage
                  alt="copypast"
                  class="empty-cart__image"
                  src="/icons/chatgpt.png"
                  width="52px"
                  height="10px"
                />
              </div>
            </div>

            <div>
              <SfButton
                :disabled="!selectedLocations.length > 0"
                class="support-btns"
                aria-label="Close modal"
                type="button"
                @click="
                  adresslist = true;
                  shopinglist = false;
                "
              >
                Select Delivery Location
              </SfButton>
            </div>
            <div
              @click="shopinglist = false"
              style="text-align: center;padding: 05px; color: coral; color: rgba(255, 85, 82, 1);"
            >
              cancel
            </div>
          </div>
        </ModalSlide>

        <ModalSlide
          :visible="adresslist"
          @close="
            adresslist = false;
            selectedTrackingId = null;
          "
        >
          <div class="modal-heading">Select delivery location</div>
          <div>
            <hr class="sf-divider" />
          </div>
          <div class="modal-body">
            <div
              class="support-text"
              style="font-weight: 700; font-size: 16px;"
            >
              Select a delivery location. We’ll connect you to the local
              suppliers for a seamless delivery:

              <br />
              <br />
              <div>
                <p v-show="selectedLocation.address">
                  <input type="radio" id="test1" name="radio-group" checked />
                  <label
                    for="test1"
                    style="font-weight: 500; font-size: 16px;"
                    >{{ selectedLocation.address }}</label
                  >
                </p>
                <p>
                  <input type="radio" id="test2" name="radio-group" />
                  <label
                    for="test2"
                    style="font-weight: 500;
                                                                                                                                                                            font-size: 16px;"
                  >
                    {{ endLocationOfTheTravel }}</label
                  >
                </p>
              </div>
              <br />
            </div>

            <div>
              <SfButton
                class="support-btns"
                aria-label="Close modal"
                type="button"
                @click="openSearch"
                >Search Items
              </SfButton>
            </div>
            <div
              @click="adresslist = false"
              style="text-align: center;padding: 5px; color: rgba(255, 85, 82, 1);"
            >
              cancel
            </div>
          </div>
        </ModalSlide>
      </div>
      <div class="sf-footer">
        <SfFooter class="footer">
          <!-- <p><span>By</span> <img src="../assets/images/p-b-phonepe.png" alt="" /> </p> -->
          <p>
            <span class="powered-by">Powered by</span>
            <img src="../assets/images/beckn-logo.png" alt="" />
          </p>
        </SfFooter>
      </div>
    </div>
  </client-only>
</template>
<script>
import { SfButton, SfImage, SfIcon, SfCheckbox } from '@storefront-ui/vue';
import { useUiState } from '~/composables';
import { SfFooter } from '@storefront-ui/vue';
import { onBeforeMount, ref, watch } from '@vue/composition-api';
import ModalSlide from '~/components/ModalSlide.vue';
import Card from '~/components/Card.vue';
import CardContent from '~/components/CardContent.vue';
import LoadingCircle from '~/components/LoadingCircle';
import { onMounted, toRefs } from '@vue/composition-api';
// import { VueTyper } from 'vue-typer'
import SuperAgent from 'superagent';

const {
  selectedLocation,
  openmodal,
  isopenmodal,
  openTrekModal,
  isOpenTrekModal,
  pastedOrderObject
} = useUiState();

export default {
  components: {
    SfButton,
    SfIcon,
    SfFooter,
    SfImage,
    ModalSlide,
    SfCheckbox,
    Card,
    LoadingCircle,
    CardContent
  },
  props: {
    pastedData: {
      default: null
    }
  },

  setup(props, context) {
    const message = ref('');
    const errorMsg = ref(false);
    const selectedLocations = ref([]);
    const enableLoader = ref(false);
    const shopinglist = ref(false);
    const isRenderShoppingItems = ref(false);
    const adresslist = ref(false);
    const shopinglistArray = ref([]);
    const importedOrderObject = ref(null);
    const endLocationOfTheTravel = ref('');

    const modals = () => {
      shopinglist.value = true;
      openSearch();
    };

    const { pastedData } = toRefs(props);

    function renderItemsWithDelay(shopinglistArray, res) {
      let delay = 1000; // 1 second delay between rendering each item
      res.forEach((item, idx) => {
        setTimeout(() => {
          // Push the item into selectedLocations
          shopinglistArray.value.push(item);
        }, delay * idx); // Increase delay for each item to render
      });
    }

    const onComplete = () => {
      isRenderShoppingItems.value = true;
    };

    const himalayan = async () => {
      isOpenTrekModal();
      enableLoader.value = true;
      SuperAgent.post('https://api.experience-gpt.becknprotocol.io/v2/search')
        .set('Content-Type', 'application/json')
        .send({
          context: {
            action: 'search',
            domain: 'mobility'
          },
          message: {
            prompt_type: 'PARIS',
            searchQuery: JSON.parse(localStorage.getItem('importedOrderObject'))
              .message.order.item[0].descriptor.name
          }
        })
        .then((res) => {
          enableLoader.value = false;
          setTimeout(() => {
            renderItemsWithDelay(shopinglistArray, res.body.item);
          }, 3000);
          shopinglist.value = true;
        })
        .catch((e) => {
          console.log(e);
        });
    };

    onBeforeMount(() => {
      let URL = window.location.href;

      // if (URL.includes('?')) {
      //   const encodedOrderObject = URL.slice(URL.indexOf('?') + 1);
      //   const decodedOrderObject = JSON.parse(window.atob(encodedOrderObject));
      //   localStorage.setItem(
      //     'decodedOrderObject',
      //     JSON.stringify(decodedOrderObject)
      //   );
      // }
    });

    onMounted(() => {
      console.log(
        'ajhsdjahsdh',
        JSON.parse(localStorage.getItem('importedOrderObject'))
      );
      if (localStorage.getItem('importedOrderObject')) {
        isOpenTrekModal();
        importedOrderObject.value = JSON.parse(
          localStorage.getItem('importedOrderObject')
        );
        const geoCodeService = new window.google.maps.Geocoder();

        const fulfillment_end_loc =
          importedOrderObject.value.message.order.item[0].tags
            .fulfillment_end_loc;
        const [latStr, longStr] = fulfillment_end_loc.split('/');

        const lat = parseFloat(latStr);
        const long = parseFloat(longStr);

        const latlng = { lat: lat, lng: long };
        geoCodeService.geocode({ location: latlng }, (results, status) => {
          if (status === 'OK') {
            if (results[0]) {
              endLocationOfTheTravel.value = results[0].formatted_address;
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
      }
    });

    const openSearch = () => {
      console.log('message.value', message.value);
      if (message.value) {
        if (errorMsg.value) errorMsg.value = false;
        context.root.$router.push({
          name: 'Search',
          params: {
            searchKey: message.value
          }
        });
      } else if (selectedLocations.value) {
        const items = selectedLocations.value.join(' ');
        console.log('items in the search', items);
        if (errorMsg.value) errorMsg.value = false;
        context.root.$router.push({
          name: 'Search',
          params: {
            searchKey: items
          }
        });
      } else {
        errorMsg.value = true;
      }
    };

    return {
      selectedLocation,
      message,
      errorMsg,
      openSearch,
      enableLoader,
      shopinglist,
      adresslist,
      isopenmodal,
      openmodal,
      openTrekModal,
      isOpenTrekModal,
      himalayan,
      modals,
      shopinglistArray,
      selectedLocations,
      pastedOrderObject,
      importedOrderObject,
      renderItemsWithDelay,
      onComplete,
      isRenderShoppingItems,
      endLocationOfTheTravel
    };
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
.sf-loader {
  position: absolute;
  // z-index: -1;
  height: 70%;
}

.powered-up-text {
  font-size: 11px;
}

.powered-by-container-texts {
  position: absolute;
  bottom: 9%;
  left: 29%;
}

@media (min-width: 820px) {
  .powered-by-container-texts {
    position: absolute;
    bottom: 25%;
    left: 39%;
  }
}

@media (min-width: 1280px) {
  .powered-by-container-texts {
    position: absolute;
    bottom: 25%;
    left: 42%;
  }
}

.trektittle {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 600 !important;
  font-size: 14px !important;
  line-height: 22px !important;
  color: #37474f;
}

.scrollable-div {
  border: 0.2px solid rgba(217, 209, 209, 0.5);
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  padding: 5px;
  border-radius: 4px;
  margin-top: 15px;
  margin-bottom: 15px;
  height: 150px;
  /* set the desired height */
  overflow-y: scroll;
  /* enable vertical scrolling */
}

.open-search {
  @media (min-width: 560px) {
    padding-top: 40px;
    width: 50%;
    margin: auto;
  }

  padding: 40px 20px;

  h3 {
    font-size: 40px;
    font-weight: 700;
    color: #f37a20;
    line-height: 45px;
  }

  h4 {
    font-size: 27px;
    font-weight: 700;
    line-height: 30px;
  }

  p {
    font-size: 15px;
    font-weight: 400;
    line-height: 20px;
    color: #7c7c7c;
    margin-bottom: 30px;
  }

  .open-search-input {
    display: flex;
    margin-bottom: 8px;
    position: relative;

    &.disable {
      input {
        border: 1px solid #fff;
      }

      button {
        background: #bfbfbf;

        .sf-icon {
          --icon-color: #fff !important;
        }
      }
    }

    input {
      box-shadow: 0px 10px 24px rgba(0, 0, 0, 0.1);
      border-radius: 6px;
      border: 1px solid transparent;
      padding: 22px 10px;
      width: calc(100% - 22px);
      font-size: 15px;
      font-weight: 700;

      &::placeholder {
        font-size: 14px;
        line-height: 17px;
        color: #dbdbdc;
      }

      &:focus {
        border: 1px solid #f37a20 !important;
      }
    }

    button {
      position: absolute;
      padding: 17px;
      height: 63px;
      top: 0;
      // background: #F37A20;
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
      right: 0;

      .sf-icon {
        --icon-color: #fff !important;
      }
    }

    // .search-placeholder {
    //   padding-left: 85px;
    // }
  }

  .address-bar-icon {
    margin: 10px 10px 1px 10px;
  }

  .error-msg {
    font-size: 14px;
    color: #d12727;
  }
}

.lodertext {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 17px;
  line-height: 25px;
  /* or 147% */

  display: flex;
  align-items: center;
  text-align: center;

  color: #7c7c7c;
}

.sf-footer {
  text-align: center;
  background: #fbfcff !important;
  position: fixed;
  bottom: 0px;
  width: 100%;
  padding: 0;

  p {
    margin: 0;

    span {
      font-size: 17px;
      position: relative;
      top: -6px;

      &.powered-by {
        font-size: 10px;
        top: -1px !important;
      }
    }
  }
}

.modal-heading {
  margin: 20px;
  font-size: 20px;
  font-weight: 500;
}

.modal-body {
  overflow: scroll;
  // padding: 28px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 5px;

  .support-text {
    font-size: 15px;
    //text-align: center;
  }

  .btn {
    display: flex;
    justify-content: center;
    height: 57px;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    margin-top: 10px;
    border-radius: 3px;

    color: rgba(243, 122, 32, 1);
    border: 2px solid rgba(243, 122, 32, 1);
    text-align: center;
    align-items: center;
    height: 48px;
  }

  .support-btns {
    margin-top: 20px;
    width: 100%;
    text-transform: inherit;
    border-radius: 3px;
    height: 48px;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
  }

  .gpt {
    font-style: normal;
    font-weight: 400;
    font-size: 10px;
    line-height: 21px;
    /* or 210% */

    color: #37474f;
  }

  .shopping-container {
    background: #ffffff;
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    padding: 5px;
    box-sizing: border-box;
    margin: 10px;
  }
}

.dropdown-button {
  position: absolute;
  border-right: 1px solid #d9d9d9;
  height: 100%;
  padding: 10px;
  width: 75px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  color: #f37a20;
  box-sizing: border-box;
  font-weight: 700;
  cursor: pointer;
}

.container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 22px;
  margin: 10px;
  /* identical to box height, or 183% */

  color: #37474f;
}

/* Hide the browser's default checkbox */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 14px;
  width: 13px;
  background: white;
  border: 2px solid rgba(243, 122, 32, 1);
}

/* When the checkbox is checked, add a blue background */
.container input:checked ~ .checkmark {
  background: rgba(243, 122, 32, 1);
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: '';
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  left: 3px;
  //top: 5px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

[type='radio']:checked,
[type='radio']:not(:checked) {
  position: absolute;
  left: -9999px;
}

[type='radio']:checked + label,
[type='radio']:not(:checked) + label {
  position: relative;
  padding-left: 28px;
  cursor: pointer;
  line-height: 20px;
  display: inline-block;
  color: #666;
}

[type='radio']:checked + label:before,
[type='radio']:not(:checked) + label:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 18px;
  height: 18px;
  border: 1px solid #ddd;
  border-radius: 100%;
  background: #fff;
}

[type='radio']:checked + label:after,
[type='radio']:not(:checked) + label:after {
  content: '';
  width: 12px;
  height: 12px;
  background: rgba(243, 122, 32, 1);
  position: absolute;
  top: 4px;
  left: 4px;
  border-radius: 100%;
  -webkit-transition: all 0.2s ease;
  transition: all 0.2s ease;
}

[type='radio']:not(:checked) + label:after {
  opacity: 0;
  -webkit-transform: scale(0);
  transform: scale(0);
}

[type='radio']:checked + label:after {
  opacity: 1;
  -webkit-transform: scale(1);
  transform: scale(1);
}

// .dowpdown {
//   background: #ffffff;
//   box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.3);
//   border-radius: 6px;
//   padding: 0 7px;
//   position: absolute;
//   width: 342px;
//   z-index: 1;
//   .dowpdown-item {
//     display: flex;
//     align-items: center;
//     padding: 8px 0;
//     cursor: pointer;
//   }
//   .border {
//     border-bottom: 1px solid rgba(226, 226, 226, 0.7);
//   }
//   .color-text {
//     color: #f37a20;
//     cursor: pointer;
//   }
// }

// .search-by-icon {
//   padding-right: 20px;
//   padding-left: 8px;
// }

// .dropdown-disabled {
//   opacity: 0.4;
//   color: #e0e0e1 !important;

//   .sf-icon {
//     --icon-color: #e0e0e1 !important;
//   }
// }
</style>
