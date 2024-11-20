<template>
  <div class="column gap-24">
    <WalletBulkSell v-if="isAddress(store.walletAddress)  && !loading"
                    :state="bulkState"
                    :time="bulkTime"
                    @cancel="cancelBulkSelect"
                    @confirm="confirmBulkSelect"
                    @start="startBulkSelect">
    </WalletBulkSell>
    <div class="row flex-start" v-if="isAddress(store.walletAddress)  && !loading">
      <Switch :state="hideAirdropToken" :text="$t('Trades007')"
              @change="onSwitchChange"></Switch>
    </div>
    <WalletLink v-else></WalletLink>
    <div class="column">
      <WalletTokenGroup v-if="isAddress(store.walletAddress) && !loading"
                        :groups="groups"
                        @select-group="selectGroup"
                        @add-group="addGroup"
                        @close-group="closeGroup"
                        :selected="selectedGroup"></WalletTokenGroup>
      <div class="table token-table">
        <div class="table-header">
          <div class="table-th table-column-1">{{ $t("Name005") }}</div>
          <div class="table-th table-column-2">{{ $t("Name012") }}</div>
          <div class="table-th table-column-3">{{ $t("Trade069") }}</div>
          <div class="table-th table-column-4">{{ $t("Trade070") }}</div>
          <div class="table-th expanded flex-end">{{ $t("Trade026") }}</div>
        </div>
        <div class="column" v-if="loading">
          <Loading></Loading>
        </div>
        <EmptyData v-else-if="total == 0"></EmptyData>
        <div class="table-body" v-else>
          <div class="table-row" v-for="token in dataList" :key="token.id">
            <div class="table-td table-column-1 gap-4">
              <Checkbox :state="token.selected?SwitchState.on:SwitchState.off"
                        v-if="bulkState==BatchSellRunState.selecting"
                        @change="(state)=>selectToken(token,state)"></Checkbox>
              <Image :token="token.tokenAddress" :chain="store.chainId" :width="20" :height="20"
                     :disabled="true"></Image>
              <div class="token-color">
                <el-tooltip effect="dark" :content="token.tokenSymbol" placement="bottom">
                  {{ token.tokenSymbol }}
                </el-tooltip>
              </div>
            </div>
            <div class="table-td table-column-2 token-color">
              <div class="row auto gap-8 token-amount">
                <TokenAddress :address="token.tokenAddress" :chain-id="store.chainId" :copyable="true"
                              address-type="address"></TokenAddress>
                <Image icon="icon-menu-pool" :button="true" @click="()=>gotoDex(token)" :width="20" :height="20"
                       v-if="showDexIcon(token)"></Image>
              </div>
            </div>
            <div class="table-td table-column-3">
              <div class="row auto token-color">
                {{ isPositiveNumber(token.tokenQuantity) ? token.tokenQuantity : '-' }}
              </div>
            </div>
            <div class="table-td table-column-4">
              <div class="row auto token-color">
                <div class="token-group">{{ token.groupName.length > 0 ? token.groupName : $t("Name086") }}</div>
                <el-popover placement="bottom" trigger="hover" :width="184" effect="dark"
                            popper-class="popover" :show-arrow="false">
                  <template #reference>
                    <div class="token-group-button">{{
                        $t("Trade075")
                      }}
                    </div>
                  </template>
                  <div class="banner-menu">
                    <div class="menu-item token-group" @click="()=>changeGroup(token.tokenAddress,'')">
                      {{ $t("Trade068") }}
                    </div>
                    <div class="menu-item token-group"
                         @click="()=>changeGroup(token.tokenAddress,group.entry)"
                         v-for="group in groups" :key="group.entry">{{ group.name }}
                    </div>
                  </div>
                </el-popover>
              </div>
            </div>
            <div class="table-td end expanded">
              <div class="row flex-end gap-8">
                <div class="button blue" @click="()=>{openTokenWithdraw(token)}">{{
                    $t("Name076")
                  }}
                </div>
                <div :class="tokenButtonClass(token,false)" @click="()=>{openTokenSell(token)}">{{
                    $t("Name077")
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="sep"></div>
      <Pagination v-if="total>0" :total="total" :page-size="PageSize" :page="page"
                  @change="onPageChange"></Pagination>
    </div>
    <NewTokenGroup :visible="openNewTokenGroupDialog" @submit="onNewTokenGroup"></NewTokenGroup>
  </div>

</template>
<script setup lang="ts">
import Switch from "~/components/base/Switch.vue";
import {SwitchState} from "~/utils/constant";
import WalletLink from "~/components/trades/components/WalletLink.vue";
import WalletTokenGroup from "~/components/trades/components/WalletTokenGroup.vue";
import {TokenGroup} from "~/models/TokenGroup";
import {useAppStore} from "~/stores/appstore";
import {isAddress, routeSource} from "~/utils/util";
import {defaultSolToken, defaultToken, PageSize} from "~/utils/common";
import Image from "~/components/base/Image.vue";
import Pagination from "~/components/base/Pagination.vue";
import Loading from "~/components/base/Loading.vue";
import EmptyData from "~/components/base/EmptyData.vue";
import {Token} from "~/models/Token";
import WalletBulkSell from "~/components/trades/components/WalletBulkSell.vue";
import TokenAddress from "~/components/base/TokenAddress.vue";
import NewTokenGroup from "~/components/trades/components/NewTokenGroup.vue";
import {Result} from "~/models/Result";
import {useNuxtApp} from "#imports";
import Checkbox from "~/components/base/Checkbox.vue";
import {sortTokenList} from "~/utils/sort";

const route = useRoute();
const routePath = route.path
let source = routeSource(routePath);

const {$api, $bus} = useNuxtApp();
const {t} = useI18n({useScope: 'global'});
let airdropTokens: Record<string, string> = {};
let tokenGroup: Array<TokenGroup> = [];
let tokenList: Array<Token> = [];
const dataList = ref<Array<Token>>([]);
let groupList: Array<TokenGroup> = [];
const groups = ref<Array<TokenGroup>>([]);

const loading = ref<boolean>(false);
const total = ref<number>(0);
const page = ref<number>(1);

const store = useAppStore();
const hideAirdropToken = ref<SwitchState>(SwitchState.on);
const bulkState = ref<BatchSellRunState>(BatchSellRunState.ready);
const bulkTime = ref<number>(0);
const openNewTokenGroupDialog = ref<boolean>(false);
const selectedGroup = ref<string>('');

const term = ref('');

const sortField = ref<SortField>(SortField.tokenQuantity)
const sortDirection = ref<SortDirection>(SortDirection.Desc)

const selectToken = (token: Token, state: SwitchState) => {
  token.selected = state == SwitchState.on
  let list = dataList.value;
  dataList.value = [...list];
}
const showDexIcon = (token: Token) => {
  return token && token.tokenAddress != defaultToken && token.tokenAddress != defaultSolToken;
}
const gotoDex = (token: Token) => {
  let link = dexLink(store.chainId, token.tokenAddress, store.walletAddress);
  window.open(link, "_blank");
}
const parseTokenList = (result: Result) => {
  if (result.code == 0) {
    let data = result.data;
    if (data) {
      let airdrop = data.airdrop;
      if (Array.isArray(airdrop)) {
        airdropTokens = {};
        for (let token of airdrop) {
          airdropTokens[token] = token;
        }
      }
      let group = data.tokenGroup
      for (let [key, value] of Object.entries(group)) {
        let g = value as TokenGroup;
        tokenGroup.push(g);
        groupList.push(g);
      }
      tokenGroup = tokenGroup.sort((a, b) => {
        return a.order - b.order;
      });
      groups.value = tokenGroup;
      let tokens = data.tokenList;
      if (Array.isArray(tokens)) {
        tokenList.length = 0;
        for (let orderInfo of tokens) {
          let order = new Token();
          order.valueOf(orderInfo);
          tokenList.push(order);
        }
        page.value = 1;
        reloadData(term.value, 1, PageSize, hideAirdropToken.value);
      }

    }
  } else {
    tokenList.length = 0;
    tokenGroup.length = 0;
    dataList.value = [];
    groups.value = [];
    total.value = 0;
    page.value = 1;
  }
}
const loadTokenList = async () => {
  loading.value = true;
  setTimeout(async () => {
    try {
      let result: Result = await $api.tokenList();
      parseTokenList(result);
    } catch (e: any) {
    } finally {
      loading.value = false;
    }
  }, 500);

}

const getFilterData = (orderList: Array<Token>, term: string, filterAirdrop: SwitchState) => {
  return tokenList.filter((item: Token) => {
    let ok1 = item.tokenName.toLowerCase().includes(term.toLowerCase());
    let ok2 = item.tokenAddress.includes(term);
    let ok3 = item.tokenSymbol.includes(term);
    let ok4 = true;
    if (filterAirdrop == SwitchState.on) {
      ok4 = airdropTokens[item.tokenAddress] != undefined;
    }
    let ok5 = item.groupNameEntry == selectedGroup.value;

    return (ok1 || ok2 || ok3) && ok4 && ok5;
  });
}
const reloadData = (term: string, page: number, pageSize: number, filterAirdrop: SwitchState) => {
  let searchTerm = term.trim();
  if (searchTerm.length > 0) {
    if (store.chainId != "solana") {
      searchTerm = searchTerm.toLowerCase();
    }
  }
  let items = getFilterData(tokenList, searchTerm, filterAirdrop);
  items = sortTokenList(items, sortField.value, sortDirection.value)
  total.value = items.length;
  dataList.value = pageableList(items, page, pageSize);
}
const loadBatchSellState = () => {
  $api.loadBatchSellState().then(result => {
    let ok = analyzeBatchSellState(result);
    if (!ok) {
      return
    }
    bulkState.value = BatchSellRunState.unknown;
    bulkTime.value = 0;
  }).catch(e => {
    bulkState.value = BatchSellRunState.unknown;
    bulkTime.value = 0;
  }).finally(() => {
  });
}
const onSwitchChange = (current: SwitchState) => {
  hideAirdropToken.value = current;
}

const onPageChange = (p: number, ps: number) => {
  reloadData(term.value, p, ps, hideAirdropToken.value);
  page.value = p;
}
const cancelBulkSelect = () => {
  bulkState.value = BatchSellRunState.ready;
}
const analyzeBatchSellState = (r: Result) => {
  if (r.code == 0) {
    let state = r.data?.state || "unknown";
    if (state == "running" || state == "done") {
      bulkTime.value = r.data?.ttl || 0;
      bulkState.value = BatchSellRunState.running;
    }
    return false;
  } else if (r.code == 3049) {
    bulkState.value = BatchSellRunState.ready;
    bulkTime.value = 0;
    return false;
  } else if (r.code == 4008) {
    bulkTime.value = r.data?.ttl || 0;
    bulkState.value = BatchSellRunState.running;
    return false;
  }
  return true
}
const confirmBulkSelect = () => {
  bulkState.value = BatchSellRunState.beforeRunning;

  let items: Array<string> = [];
  for (let token of tokenList) {
    if (token.selected) {
      items.push(token.tokenAddress);
    }
  }
  $api.startBatchSell(items).then((result: Result) => {
    let r = analyzeBatchSellState(result);
    if (r) {
      let ok = analyzeBatchSellState(result);
      if (!ok) {
        return
      }
      store.showMessageBox(t("Trade072"), t("Message015"))
      bulkState.value = BatchSellRunState.ready;
      bulkTime.value = 0;
    }
  })

}
const startBulkSelect = () => {
  bulkState.value = BatchSellRunState.selecting;
  for (let token: Token of tokenList) {
    if (token.tokenAddress == defaultToken || token.tokenAddress == defaultSolToken) {
      token.selected = false;
      continue;
    }
    token.selected = token.groupNameEntry == selectedGroup.value;
  }
  reloadData(term.value, page.value, PageSize, hideAirdropToken.value);
}

const selectGroup = (group: string) => {
  selectedGroup.value = group;
  page.value = 1;
  reloadData(term.value, 1, PageSize, hideAirdropToken.value);
}
const openTokenWithdraw = (token: Token) => {
  store.showTransferDialog("transfer", token.tokenAddress, token.tokenSymbol,source)
}
const openTokenSell = (token: Token) => {
  store.showTransferDialog("sell", token.tokenAddress, token.tokenSymbol,source)
}
const addGroup = () => {
  openNewTokenGroupDialog.value = true;
}
const onNewTokenGroup = (groupName: string) => {
  openNewTokenGroupDialog.value = false;
  if (groupName.trim().length == 0) {
    return;
  }
  $api.addTokenGroup(groupName).then((result: Result) => {
    if (result.code == 0) {
      let data = result.data;
      if (data) {
        let entry = data.entry;
        let order = data.order;
        let text = groupName.trim();
        if (text.length == 0) {
          return;
        }
        if (groupList.length < 3) {
          let group: TokenGroup = {
            order: order,
            name: groupName,
            entry: entry,
          }
          groupList.push(group);
          let list = [...groupList];
          list = list.sort((a, b) => {
            return a.order - b.order;
          })
          groups.value = list;
        }
      }

    } else {
      store.showMessageBox(t("Trade070"), t("Message016"));
    }

  }).catch(err => {
    store.showMessageBox(t("Trade070"), t("Message016"));
  })


}
const closeGroup = (group: string) => {
  $api.deleteTokenGroup(group).then((result: Result) => {
    if (result.code == 0) {
      let index = groupList.indexOf(selectedGroup.value)
      for (let i = 0; i < groupList.length; i++) {
        if (groupList[i].entry == group) {
          groupList.splice(i, 1);
          break;
        }
      }
      groups.value = [...groupList];
      for (let token of tokenList) {
        if (token.groupNameEntry == group) {
          token.groupNameEntry = "";
          token.groupName = "";
        }
      }

      if (index > groupList.length - 1) {
        index = groupList.length - 1;
      }
      let nextGroup: string

      if (index < 0) {
        nextGroup = "";
      } else {
        nextGroup = groupList[index];
      }
      selectGroup(nextGroup);
    } else {
      store.showMessageBox(t("Trade070"), t("Message017"));
    }

  }).catch(e => {
    store.showMessageBox(t("Trade070"), t("Message017"));
  })

}

const getTokenGroupByEntry = (entry: string) => {
  for (let group of groupList) {
    if (group.entry == entry) {
      return group;
    }
  }
  return undefined;
}
const changeGroup = (tokenAddress: string, newGroup: string) => {
  $api.setTokenGroup(tokenAddress, newGroup).then((result: Result) => {
    if (result.code == 0) {
      for (let i = 0; i < tokenList.length; i++) {
        let token = tokenList[i];
        if (token.tokenAddress == tokenAddress) {
          if (newGroup == "") {
            token.groupName = "";
            token.groupNameEntry = newGroup;
          } else {
            let group = getTokenGroupByEntry(newGroup);
            if (group) {
              token.groupName = group.name;
              token.groupNameEntry = group.entry;
            }
          }
          break;
        }
      }
      
      page.value = 1;
      reloadData(term.value, 1, PageSize, hideAirdropToken.value);
    } else {
      store.showMessageBox(t("Trade070"), t("Message017"));
    }
  }).catch(e => {
    store.showMessageBox(t("Trade070"), t("Message017"));
  })

}


const onChainChange = () => {
  loadBatchSellState();
  loadTokenList();
}

const tokenButtonClass = (token: Token, blue: boolean) => {
  let nativeToken = token.tokenAddress == defaultToken || token.tokenAddress == defaultSolToken;
  return {
    button: true,
    blue: blue,
    disabled: nativeToken
  }
}
const onTokenSearch = (term: string) => {
  page.value = 1;
  reloadData(term, 1, PageSize, hideAirdropToken.value);
}
const onLogout = () => {
  tokenList.length = 0;
  reloadData(term.value, 1, PageSize, hideAirdropToken.value);
}
const onLogin = () => {
  loadBatchSellState();
  loadTokenList();
}
watch(() => hideAirdropToken.value, (newVal) => {
  reloadData(term.value, 1, PageSize, newVal);
  page.value = 1;
}, {deep: true});

onMounted(() => {
  let ok = store.isLogin && store.hasWallet;
  if (!ok) {
    loading.value = false;
  }
  $bus.on(AppEvent.Login, onLogin);
  $bus.on(AppEvent.Logout, onLogout);
  $bus.on(AppEvent.TokenSearch, onTokenSearch)
  $bus.on(AppEvent.ChainChange, onChainChange)
  loadBatchSellState();
  loadTokenList();
})
onUnmounted(() => {
  $bus.off(AppEvent.Login, onLogin);
  $bus.off(AppEvent.Logout, onLogout);
  $bus.off(AppEvent.TokenSearch, onTokenSearch)
  $bus.off(AppEvent.ChainChange, onChainChange)
})
</script>

<style scoped lang="scss">
@use "@/assets/scss/base.scss" as *;
@use "@/assets/scss/global.variable" as *;

.token-table {
  border-top-left-radius: 0 !important;
}

.table-column-1 {
  width: 261px !important;
}

.table-column-2 {
  width: 261px !important;
}

.table-column-3 {
  width: 261px !important;
}

.table-column-4 {
  width: 261px !important;
}

.token-color {
  color: $textColor1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: auto;
  min-width: 80px;
}

.token-group {
  @include box($width: 120px, $gap: 4px);
  color: $textColor1;
}

.token-group-button {
  @include box($width: auto, $height: 28px, $padding: 8px);
  cursor: pointer;
  color: $textColor1;
  border-radius: 2px;
  background-color: $blue1;
}

.button {
  @include box($width: 70px, $height: 28px);
  cursor: pointer;
  border-radius: 2px;
  border: $border1;
  color: $textColor1;

  &.blue {
    background-color: $blue1;
    border: none;
  }

  &.disabled {
    color: $textColor2;
    background-color: $backgroundColor3;
    cursor: not-allowed;
    pointer-events: none;
  }
}

.sep {
  height: 32px;
  width: 100%;
}
</style>
