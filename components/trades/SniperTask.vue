<template>
  <div class="column gap-24">
    <WalletAddress v-if="store.hasWallet" :chain-id="store.chainId" :address="store.walletAddress"></WalletAddress>
    <div class="row flex-start" v-if="!loading">
      <Switch :state="hideStopped" :text="$t('Trades004', { name: $t('Trades006') })" @change="onSwitchChange">
      </Switch>
    </div>
    <div class="table">
      <div class="table-header">
        <div class="table-th table-column-1">{{ $t("Trade013") }}</div>
        <div class="table-th table-column-2">{{ $t("Trade011") }}</div>
        <div class="table-th table-column-3">{{ $t("Trade012") }}</div>
        <div class="table-th table-column-4">{{ $t("Name088") }}</div>
        <div class="table-th table-column-5">
          <Image :chain="store.chainId" :width="20" :height="20" :disabled="true"/>
          <span>{{ $t("Trade024") }}</span>
        </div>
        <div class="table-th table-column-6">{{ $t("Trade025") }}</div>
        <div class="table-th expanded flex-end">{{ $t("Trade026") }}</div>
      </div>
      <div class="column" v-if="loading">
        <Loading></Loading>
      </div>
      <EmptyData v-else-if="total == 0"></EmptyData>
      <div class="table-body" v-else>
        <div class="column" v-for="task in dataList" :key="task.id">
          <div class="table-row hover-effect" :id="elementId(task)">
            <div class="table-td table-column-1 gap-4">
              <Image :icon="snipTaskStatusIcon(task.status,task.sellState)" :width="20" :height="20"
                     :disabled="true"></Image>
              <span class="defaultText">{{
                  $t(snipTaskStatusString(store.chainId, task.status, task.sellState))
                }}</span>
            </div>
            <div class="table-td table-column-2">
              <div class="row auto gap-8 defaultText">
                <el-tooltip effect="dark" trigger="hover" :content="task.description" placement="top">
                  <span class="task-name">{{ task.description }}</span>
                </el-tooltip>
                <Image icon="icon-edit" :width="20" :height="20" :button="true"
                       @click="() => editTaskName(task.address, task.description)"></Image>
              </div>
            </div>
            <div class="table-td table-column-3">
              <div class="row auto defaultText " v-if="isTaskTime(task.timestamp)">
                {{ formatTaskTime(task.timestamp) }}
              </div>
            </div>
            <div class="table-td table-column-4">
              <TokenAddress :address="task.address" :chain-id="store.chainId" linkable
                            v-if="isAddress(task.address)"></TokenAddress>
              <span v-else>-</span>
            </div>
            <div class="table-td table-column-5">
              <div class="row auto defaultText">
                {{ formatTokenAmount(task.amount, true) }}{{ nativeToken(store.chainId) }}
              </div>
            </div>
            <div class="table-td table-column-6">
              <div class="row auto" v-if="isTaskTime(task.activeTimestamp)">
                <el-tooltip trigger="hover" effect="dark" :content="timestamp(task.activeTimestamp)" placement="top">{{
                    $t("TimeUnit000", {time: formatTime(task.activeTimestamp, timeUnits())})
                  }}
                </el-tooltip>
              </div>
              <div class="row auto" v-else> -</div>
            </div>
            <div class="table-td expanded">
              <div class="row gap-8 flex-end">
                <!--stop task-->
                <div class="row auto" v-if="task.status==TaskStatus.Running">
                  <div class="task-action red" @click="() => stopTask(task)" v-if="canStopTask(task)">{{
                      $t("Trade028")
                    }}
                  </div>
                  <div class="task-action blank" v-else></div>
                </div>
                <!--start task-->
                <div class="row auto" v-else>
                  <div class="task-action blank" v-if="task.source!=0"></div>
                  <div class="task-action green" v-else @click="() => startTask(task)">{{ $t("Trade027") }}</div>
                </div>
                <div class="task-action-toggle" @click="()=>toggleTaskExpand(task)">
                  <span class="action-text" v-if="task.expand">{{ $t("Trade030") }}</span>
                  <span class="action-text" v-else>{{ $t("Trade029") }}</span>
                  <Image icon="icon-task-expand" :width="20" :height="20" :disabled="true"
                         :class-name="task.expand?'collapse':'expand'"></Image>
                </div>
              </div>
            </div>
          </div>
          <SniperTradeTaskConfig v-if="task.expand" :order="task.order"
                                 @edit="onTaskEditSubmit"></SniperTradeTaskConfig>
        </div>
      </div>
    </div>
    <Pagination v-if="total > 0" :total="total" :page-size="PageSize" :page="page"
                @change="onPageChange"></Pagination>
  </div>
  <TaskNameEdit type="sniper" :address="taskAddress" :visible="editingTaskName" :name="taskName"
                @submit="onTaskNameEdited"></TaskNameEdit>
</template>
<script setup lang="ts">

import Switch from "~/components/base/Switch.vue";
import Loading from "~/components/base/Loading.vue";
import {SnipTaskStep, SortDirection, SwitchState, TaskStatus} from "~/utils/constant";
import {snipTaskStatusIcon} from "~/utils/resource";
import Pagination from "~/components/base/Pagination.vue";
import {PageSize} from "~/utils/common";
import {formatTaskTime, formatTime, formatTokenAmount, nativeToken, pageableList} from "~/utils/util";
import Image from "~/components/base/Image.vue";
import {snipTaskStatusString, timeUnitKeys} from "~/utils/i18n";
import WalletAddress from "./components/WalletAddress.vue";
import {Task} from "~/models/Task";
import EmptyData from "~/components/base/EmptyData.vue";
import TokenAddress from "~/components/base/TokenAddress.vue";
import {SniperTask} from "~/models/SniperTask";
import SniperTradeTaskConfig from "~/components/trades/components/SniperTradeTaskConfig.vue";
import {Result} from "~/models/Result";
import {useNuxtApp} from "#imports";
import TaskNameEdit from "~/components/base/TaskNameEdit.vue";
import {v4 as uuid} from 'uuid';
import {SniperTaskSettings} from "~/models/SniperTaskSettings";

let taskList: Array<SniperTask> = [];
const {$api, $bus} = useNuxtApp();
const {t} = useI18n({useScope: 'global'})
const store = useAppStore();
const page = ref<number>(1);
const total = ref<number>(0);
const editingTaskName = ref(false);
const taskName = ref('');
const taskAddress = ref('');

const loading = ref<boolean>(false);

const hideStopped = ref<SwitchState>(SwitchState.off);

const dataList = ref<SniperTask[]>([]);

const term = ref('');

const canStopTask = (task: SniperTask) => {
  return task.source == 0 ? true : (task.step == SnipTaskStep.CheckSell || task.step == SnipTaskStep.CheckBuy);
}
const parseTaskList = (result: Result) => {
  if (result.code == 0) {
    let data = result.data;
    if (data) {
      if (Array.isArray(data)) {
        taskList.length = 0;
        for (let taskInfo of data) {
          let task = new SniperTask();
          task.valueOf(taskInfo);
          if (task.id.length == 0) {
            task.id = uuid();
          }
          taskList.push(task);
        }
        page.value = 1;
        reloadData(term.value, 1, PageSize, hideStopped.value);
      }

    }
  } else {
    taskList.length = 0;
    dataList.value = [];
    total.value = 0;
    page.value = 1;
  }
}

const loadSniperTaskList = () => {
  loading.value = true;
  setTimeout(async () => {
    try {
      let result: Result = await $api.snipTaskList();
      parseTaskList(result);
    } catch (e: any) {
    } finally {
      loading.value = false;
    }
  }, 500);
}

const getFilterData = (orderList: Array<Task>, term: string, filterStopped: SwitchState) => {
  return orderList.filter((item) => {
    let ok1 = item.description.toLowerCase().includes(term.toLowerCase());
    let ok2 = item.address.includes(term);
    let ok4 = true;
    if (filterStopped == SwitchState.on) {
      ok4 = item.status == TaskStatus.Running || item.status == TaskStatus.Stopping;
    }
    return (ok1 || ok2) && ok4;
  });
}

const sortTask = (a: SnipTask, b: SnipTask) => {
  let a1 = parseInt(a.status);
  let a2 = parseInt(b.status);
  if (isNaN(a1) && isNaN(a2)) {
    return sort(a.timestamp, b.timestamp, SortDirection.Desc);
  } else if (!isNaN(a1) && !isNaN(a2)) {
    if (a1 == a2) {
      return sort(a.timestamp, b.timestamp, SortDirection.Desc);
    }
    return a1 - a2;
  } else {
    if (isNaN(a1)) {
      return 1;
    }
    return -1;
  }
}

const reloadData = (term: string, page: number, pageSize: number, hideStopped: SwitchState) => {
  let searchTerm = term.trim();
  if (searchTerm.length > 0) {
    if (store.chainId != "solana") {
      searchTerm = searchTerm.toLowerCase();
    }
  }
  let items = getFilterData(taskList, searchTerm, hideStopped);
  items.sort(sortTask)
  total.value = items.length;
  dataList.value = pageableList(items, page, pageSize);
}
const elementId = (task: SniperTask) => {
  return task.address.replace("0x", "");
}
const onSwitchChange = (current: SwitchState) => {
  hideStopped.value = current;
}

const onPageChange = (p: number, ps: number) => {
  reloadData(term.value, p, ps, hideStopped.value);
  page.value = p;
}


const isTaskTime = (timestamp: string) => {
  return isPositiveInteger(timestamp)
}

const timeUnits = () => {
  let i18nKeys = timeUnitKeys();
  return {
    seconds: t(i18nKeys.seconds),
    minutes: t(i18nKeys.minutes),
    hours: t(i18nKeys.hours),
    days: t(i18nKeys.days),
    second: t(i18nKeys.second),
    minute: t(i18nKeys.minute),
    hour: t(i18nKeys.hour),
    day: t(i18nKeys.day),
  }
}
const timestamp = (timestamp: string) => {
  return formatTaskTime(timestamp)
}


const editTaskName = (id: string, name: string) => {
  taskName.value = name;
  taskAddress.value = id;
  editingTaskName.value = true;
}
const onTaskNameEdited = (id: string, name: string) => {
  editingTaskName.value = false;
  taskName.value = "";
  taskAddress.value = "";
  if (name.length == 0) {
    return;
  }
  for (let task of taskList) {
    if (task.address == id) {
      task.description = name;
    }
  }
  reloadData(term.value, page.value, PageSize, hideStopped.value);
}
const startTask = (task: SniperTask) => {
  $api.startSniperTask(task).then(r => {
    if (r.code == 0) {
      for (let taskInfo of taskList) {
        if (taskInfo.address == task.address) {
          task.status = TaskStatus.Running;
        }
      }
      reloadData(term.value, page.value, PageSize, hideStopped.value);
      store.showMessageBox(t("Trade027"), t("Message021"))
    } else {
      store.showMessageBox(t("Trade027"), t("Message022"))
    }
  }).catch(e => {
    store.showMessageBox(t("Name087"), t("Message022"))
  }).finally(() => {

  });
}
const stopTask = (task: SniperTask) => {
  $api.stopSniperTask(task).then(r => {
    if (r.code == 0) {
      for (let taskInfo of taskList) {
        if (taskInfo.address == task.address) {
          task.status = TaskStatus.Stopping;
        }
      }
      reloadData(term.value, page.value, PageSize, hideStopped.value);
      store.showMessageBox(t("Trade028"), t("Message023"))
    } else {
      store.showMessageBox(t("Trade028"), t("Message024"))
    }
  }).catch(e => {
    store.showMessageBox(t("Name087"), t("Message024"))
  }).finally(() => {

  });
}
const toggleTaskExpand = (targetTask: SniperTask) => {

  for (let task of taskList) {
    if (task.id == targetTask.id) {
      task.expand = !task.expand;
    } else {
      task.expand = false;
    }
  }
  reloadData(term.value, page.value, PageSize, hideStopped.value);
}
const onTokenSearch = (searchTerm: string) => {
  term.value = searchTerm;
  reloadData(searchTerm, 1, PageSize, hideCompleted.value);
  page.value = 1;
}
const onChainChange = () => {
  loadSniperTaskList();
}
const onLogin = () => {
  loadSniperTaskList();
}
const onLogout = () => {
  taskList.length = 0;
  reloadData(term.value, 1, PageSize, hideStopped.value);
}
const onTaskEditSubmit = (task: SniperTaskSettings) => {
  for (let ts of taskList) {
    if (ts.address == task.address) {
      ts.valueOf(task.inner());
    }
  }
  reloadData(term.value, page.value, PageSize, hideStopped.value);
}
watch(() => hideStopped.value, (newVal) => {
  reloadData(term.value, 1, PageSize, newVal);
  page.value = 1;
});

onMounted(() => {
  let ok = store.isLogin && store.hasWallet;
  if (!ok) {
    loading.value = false;
  }
  $bus.on(AppEvent.Login, onLogin);
  $bus.on(AppEvent.Logout, onLogout);
  $bus.on(AppEvent.TokenSearch, onTokenSearch);
  $bus.on(AppEvent.ChainChange, onChainChange);
  loadSniperTaskList();
});
onUnmounted(() => {
  $bus.off(AppEvent.Login, onLogin);
  $bus.off(AppEvent.Logout, onLogout);
  $bus.off(AppEvent.TokenSearch, onTokenSearch);
  $bus.off(AppEvent.ChainChange, onChainChange)
})
</script>

<style scoped lang="scss">
@use "@/assets/scss/global.variable" as *;
@use "@/assets/scss/base" as *;

.table-column-1 {
  width: 196px !important;
}

.table-column-2 {
  width: 156px !important;
}

.table-column-3 {
  width: 196px !important;
}

.table-column-4 {
  width: 196px !important;
}

.table-column-5 {
  width: 168px !important;
}

.table-column-6 {
  width: 151px !important;
}

.button {
  cursor: pointer;
}

.token-price {
  color: $textColor2;
}


.task-name {
  width: 80px !important;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}


.task-action {
  @include box($width: 60px, $height: 28px);
  border-radius: 2px;
  color: $textColor1;
  cursor: pointer;

  &.red {
    background-color: $red1;
  }

  &.green {
    background-color: $green1;
  }
}

.task-action-toggle {
  @include box($width: 100px, $height: 28px, $gap: 4px, $padding: 0 8px);
  border: $border1;
  border-radius: 2px;
  background-color: transparent;
  cursor: pointer;

  .action-text {
    flex: 1;
    color: $textColor1;
  }
}

.expand {
  transform: rotate(180deg);
}

.collapse {
  transform: rotate(0deg);
}
</style>
