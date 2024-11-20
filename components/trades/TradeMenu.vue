<script setup lang="ts">
import Image from "~/components/base/Image.vue";
import {TradeMenuKeys} from "~/utils/constant"

type MenuItemData = {
  icon?: string,
  platform: boolean,
  label?: string,
  i18n: boolean,
  key: TradeMenuKeys
}

interface TradeMenuProps {
  state: { [key: TradeMenuKeys]: boolean }
}

const emit = defineEmits(['select'])
const props = defineProps<TradeMenuProps>()
const store = useAppStore();

const platform: { [key: string]: string } = {
  '0x1': 'HomeTradeMenu007',
  '0x38': 'HomeTradeMenu008',
  '0x2105': 'HomeTradeMenu009',
  'solana': 'HomeTradeMenu012'

}
const getMenuState = (key: TradeMenuKeys) => {
  return props.state[key];
}
const getPlatform = () => {
  return platform[store.chainId];
}
const platformIcon: { [key: string]: string } = {
  '0x1': 'icon-menu-etherscan',
  '0x38': 'icon-menu-etherscan',
  '0x2105': 'icon-menu-etherscan',
  'solana': 'icon-menu-solana'

}

const getItemIcon = (item: MenuItemData) => {
  if (item.platform) {
    return platformIcon[store.chainId];
  }
  return item.icon;

}

const items: MenuItemData[] = [
  {
    icon: "icon-menu-details",
    label: "HomeTradeMenu001",
    key: TradeMenuKeys.Details,
    platform: false,
  }, {
    label: "HomeTradeMenu002",
    key: TradeMenuKeys.Wallet,
    i18n: true,
    platform: true,
  }, {
    platform: true,
    label: "HomeTradeMenu003",
    i18n: true,
    key: TradeMenuKeys.Tx
  }, {
    icon: "icon-menu-pool",
    label: "HomeTradeMenu004",
    key: TradeMenuKeys.Pool
  }, {
    icon: "icon-menu-pool",
    label: "HomeTradeMenu006",
    key: TradeMenuKeys.PoolSmartMoney
  }, {
    icon: "icon-menu-share",
    label: "HomeTradeMenu010",
    key: TradeMenuKeys.Share
  }, {
    icon: "icon-menu-share",
    label: "HomeTradeMenu011",
    key: TradeMenuKeys.ProfitImage2
  }
];
const selectMenu = (key: TradeMenuKeys) => {
  let disabled = getMenuState(key);
  if (!disabled) {
    emit('select', key);
  }
}
const menuItemClass = (item: MenuItemData) => {
  return {
    'trade-menu-item': true,
    'left': true,
    disabled: getMenuState(item.key),
  }
}
</script>

<template>
  <div class="trade-menu">
    <div :class="menuItemClass(item)" v-for="(item,index) in items" :key="item.key" @click="()=>selectMenu(item.key)">
      <Image :icon="getItemIcon(item)" :width="16" :height="16"></Image>
      <span v-if="item.i18n">{{ $t(item.label, {platform: $t(getPlatform())}) }}</span>
      <span v-else>{{ $t(item.label) }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "assets/scss/base" as *;
@use "assets/scss/global.variable" as *;


</style>
