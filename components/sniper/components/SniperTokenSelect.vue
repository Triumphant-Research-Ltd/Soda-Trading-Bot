<template>
  <el-dialog :width="496"
             :show-close="false"
             :align-center="true"
             v-model="open"
             :close-on-press-escape="false"
             :close-on-click-modal="false"
             @opened="onDialogOpened"
  >
    <div class="sniper-token-select">
      <div class="row">
        <span class="title-text">{{ $t("Sniper013") }}</span>
        <Image icon="icon-dialog-close" :width="24" :height="24" :button="true" @click="onClose"></Image>
      </div>
      <div class="column gap-8">
        <div :class="searchFieldClass">
          <Input ref="inputField"
                 :max-length="64"
                 :text="address"
                 :height="48"
                 type="text"
                 width="100%"
                 :placeholder="$t('Sniper014')"
                 @change="onTextChange"
                 @submit="onSubmit"></Input>
          <Image icon="icon-search" :button="true" @click="onSubmit"/>
        </div>
        <div class="address-history">
          <div class="history-title">{{ $t("Sniper018") }}</div>
          <Loading v-if="loading"></Loading>
          <div class="column" v-else>
            <div class="history" v-for="address in addressList" :key="address" @click="()=>selectAddress(address)">
              <Image :chain="store.chainId" :token="address" :width="28" :height="28" :disabled="true"></Image>
              <div class="row auto  flex-start address">{{ address }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import Loading from '~/components/base/Loading.vue';
import Image from "~/components/base/Image.vue";
import {useAppStore} from "~/stores/appstore";
import Input from "~/components/base/Input.vue";
import dayjs from "dayjs";
import {isEvmAddress, isSolanaAddress} from "~/utils/util";


interface SniperTokenSelectProps {
  visible: boolean
}

const inputField = ref(null);
const emit = defineEmits(['close']);
const store = useAppStore();
const {t} = useI18n({useScope: 'global'});
const props = defineProps<SniperTokenSelectProps>();
const loading = ref<boolean>(false);
const open = ref<boolean>(false);
const address = ref<string>('');
const error = ref<boolean>(false);
let dataList: Set<string> = new Set<string>();
const addressList = ref<string[]>([]);
const localForage = useLocalForage();
const saveHistory = async (tokenAddress: string) => {
  let list: any[] = [];
  try {
    let addr = tokenAddress.trim();
    if (store.chainId != 'solana') {
      addr = addr.toLowerCase();
    }
    dataList.add(addr);
    dataList.forEach((value) => {
      list.push({address: value, ts: dayjs().unix()})
    })
    let item = JSON.stringify(list);
    await localForage.setItem(store.chainId, item);
  } catch (e: any) {
    console.error(e);
  } finally {
    addressList.value = list.map((value) => value.address);
  }

}
const loadHistory = async () => {
  if (dataList.size == 0) {
    loading.value = true;
    setTimeout(async () => {
      let array: any[] = [];
      try {
        let now = dayjs().unix();
        let d = await localForage.getItem(store.chainId);
        let items = JSON.parse(d);
        if (Array.isArray(items)) {
          let historyList: any[] = items.sort((a, b) => b.ts - a.ts);
          let index = 0;
          for (let item of historyList) {
            let address = item.address;
            let ts = item.ts;
            if (address && ts) {
              let offset = now - ts;
              if (offset < 24 * 3600 * 3) {
                index += 1;
                array.push(item);
                if (index >= 10) {
                  break;
                }
              }
            }
          }

          localForage.setItem(store.chainId, JSON.stringify(array)).catch(console.error);
        }

      } catch (e: any) {
      } finally {
        loading.value = false;
        addressList.value = array.map((value) => value.address);
      }

    }, 500);

  }

}
const selectAddress = (address: string) => {
  if (store.chainId == 'solana') {
    if (isEvmAddress(address)) {
      store.showMessageBox(t("Home021"), t("Message042"));
      return;
    }
  } else {
    if (isSolanaAddress(address)) {
      store.showMessageBox(t("Home021"), t("Message042"));
      return;
    }
  }
  open.value = false;
  emit('close', address);
}
const searchFieldClass = computed(() => {
  return {
    "search-field": true,
    'error': error.value,
  }
});
const onSubmit = () => {
  let text = address.value.trim();
  if (store.chainId != "solana") {
    text = text.toLowerCase();
  }
  if (text.length == 0) {
    return;
  }
  if (!isAddress(text)) {
    error.value = true;
    store.showMessageBox(t("Home021"), t("Message013"));
    inputField.value?.focus();
    return;
  }
  if (store.chainId == 'solana') {
    if (isEvmAddress(text)) {
      store.showMessageBox(t("Home021"), t("Message042"));
      return;
    }
  } else {
    if (isSolanaAddress(text)) {
      store.showMessageBox(t("Home021"), t("Message042"));
      return;
    }
  }
  saveHistory(address.value).catch(console.error).finally(() => {
    emit('close', text);
  });

}
const onTextChange = (text: string) => {
  address.value = text;
  error.value = false;
}


const onClose = () => {
  emit('close', '');
}


const onDialogOpened = () => {
  loading.value = false;
  inputField.value?.focus();
  loadHistory();
}

watch(() => props.visible, (value) => open.value = value);

</script>

<style scoped lang="scss">
@use "@/assets/scss/global.variable" as *;
@use "@/assets/scss/base" as *;

.sniper-token-select {
  @include box($gap: 24px, $direction: column);

}


.title-text {
  @include box($justify: space-between, $height: 25px);
  @include font(16px, 600);
  color: $textColor1;
}


.search-field {
  @include box($gap: 8px, $padding: 0 20px);
  border-radius: 1000px;
  border: $border1 !important;
  height: 48px;

  &.error {
    border-color: $red1 !important;
  }
}

.history-title {
  @include box($justify: flex-start);
}

.address-history {
  @include box($direction: column, $gap: 2px);
}

.history {
  @include box($justify: flex-start, $gap: 8px, $height: 53px, $padding: 10px 8px);
  cursor: pointer;

  .address {
    @include font(12px, 400);
    color: $textColor2;
  }

  &:hover {
    background-color: $backgroundColor3;

  }
}
</style>
