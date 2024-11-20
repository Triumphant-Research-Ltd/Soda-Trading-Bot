<template>
  <div class="column padding gap-64">
    <div class="row flex-start">
      <HomeTradeButton :type="buttonType()" @click="gotoPage"></HomeTradeButton>
    </div>
    <div class="column gap-24">
      <TabBar :tabs="tabs()" :selected-tab="selectedTab" @change="onTabChange" :placeholder="$t('TabBar006')"
              @search="onSearch"></TabBar>
      <CopyTrade v-if="selectedTab === UserTab.CopyTradeOrders" :type="OrderDetailType.Following"/>
      <CopyTradeTask v-else-if="selectedTab === UserTab.CopyTradeTask"/>
      <SniperTrade v-else-if="selectedTab === UserTab.SniperOrders" :type="OrderDetailType.Snip"/>
      <SniperTask v-else-if="selectedTab === UserTab.SniperTask"/>
      <SniperTrade v-else-if="selectedTab === UserTab.FlashOrders" :type="OrderDetailType.Snip"/>
      <SniperTask v-else-if="selectedTab === UserTab.FlashTask"/>
      <Wallet v-else/>
    </div>
  </div>
</template>
<script setup lang="ts">
import TabBar from "~/components/base/TabBar.vue";
import {UserPageTab, UserTab} from "~/utils/constant";
import CopyTrade from "~/components/trades/CopyTrade.vue";
import CopyTradeTask from "~/components/trades/CopyTradeTask.vue";
import SniperTrade from "~/components/trades/SniperTrade.vue";
import SniperTask from "~/components/trades/SniperTask.vue";
import Wallet from "~/components/trades/Wallet.vue";
import {useAppStore, useNuxtApp} from "#imports";

const store = useAppStore();
const {t} = useI18n({useScope: 'global'});

interface TradesProps {
  page: UserPageTab
}

const getTabFromQuery = (): UserTab => {
  let routeTab = query.t;
  if (routeTab == null) {
    return UserTab.CopyTradeOrders;
  } else if (Array.isArray(routeTab)) {
    let item = routeTab[0];
    if (item == null) {
      return UserTab.CopyTradeOrders
    } else {
      let value = item.toLowerCase();
      if (!isValidTab(value)) {
        return UserTab.CopyTradeOrders;
      }
      return value as UserTab
    }
  } else {
    let value = routeTab.toLowerCase();
    if (!isValidTab(value)) {
      return UserTab.CopyTradeOrders;
    }
    return value as UserTab
  }

}
const props = defineProps<TradesProps>()
const query = useRoute().query;
const {$bus} = useNuxtApp();
const selectedTab = ref<UserTab>(getTabFromQuery());
const searchTerm = ref<string>('');


const tabs = () => {
  if (props.page == UserPageTab.Trade) {
    return [UserTab.CopyTradeOrders, UserTab.CopyTradeTask, UserTab.Wallet]
  } else if (props.page == UserPageTab.Sniper) {
    return [UserTab.SniperOrders, UserTab.SniperTask, UserTab.Wallet];
  } else if (props.page == UserPageTab.Flash) {
    return [UserTab.FlashOrders, UserTab.FlashTask, UserTab.Wallet];
  }
  return [UserTab.CopyTradeOrders, UserTab.CopyTradeTask, UserTab.Wallet];
}

const gotoPage = (page: UserPageTab) => {
  if (page == UserPageTab.Trade) {
    if (store.chainId == 'solana') {
      store.showMessageBox(t("HomeFeature004"), t("Message043"));
      return;
    }
    window.location.pathname = 'copytrade';
  } else {
    let url = new URL(window.location.href);
    url.pathname = 'sniper';
    if (props.page == "sniper") {
      url.searchParams.set("t", "sniper")
    } else if (props.page == "flash") {
      url.searchParams.set("t", "flash")
    }
    window.location.href = url.href;
  }

}
const buttonType = () => {
  let text = props.page;
  return text.toString();
}
const onSearch = (term: string) => {
  searchTerm.value = term;
  $bus.dispatch(AppEvent.TokenSearch, term);
}

const onTabChange = (tab: UserTab) => {
  selectedTab.value = tab;
}

watch(selectedTab, (newVal) => {
  let url = new URL(window.location.href)
  url.searchParams.set("t", newVal.toString());
  window.history.replaceState({}, "", url.href);
});

</script>

<style scoped lang="scss">
.padding {
  padding: 42px 86px 42px 86px
}


</style>
