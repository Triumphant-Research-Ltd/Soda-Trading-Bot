<template>
  <div class="column gap-24">
    <WalletAddress v-if="store.hasWallet" :chain-id="store.chainId" :address="store.walletAddress"></WalletAddress>
    <div class="row flex-start" v-if="!loading">
      <Switch :state="hideStopped" :text="$t('Trades004', { name: $t('Trades003') })" @change="onSwitchChange"></Switch>
    </div>
    <div class="table">
      <div class="table-header">
        <div class="table-th table-column-1">{{ $t("Trade013") }}</div>
        <div class="table-th table-column-2">{{ $t("Trade011") }}</div>
        <div class="table-th table-column-3">{{ $t("Trade012") }}</div>
        <div class="table-th table-column-4">{{ $t("Trade023") }}</div>
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
              <Image :icon="taskStatusIcon(task.status)" :width="20" :height="20" :disabled="true"></Image>
              <span class="defaultText">{{ $t(taskStatusString(task.status)) }}</span>
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
              <TokenAddress :address="task.address" :chain-id="store.chainId"
                            :linkable="isAddress(task.address)"></TokenAddress>
            </div>
            <div class="table-td table-column-5">
              <div class="row auto defaultText">
                {{ formatTokenAmount(task.amount, true) }}{{ nativeToken(store.chainId) }}
              </div>
            </div>
            <div class="table-td table-column-6">
              <div class="row auto" v-if="isTaskTime(task.activeTimestamp)">
                <el-tooltip trigger="hover" effect="dark" :content="timestamp(task.activeTimestamp)" placement="top">
                    <span>
                      {{ $t("TimeUnit000", {time: formatTime(task.activeTimestamp, timeUnits())}) }}
                    </span>
                </el-tooltip>
              </div>
              <div class="row auto" v-else> - </div>
            </div>
            <div class="table-td expanded">
              <div class="row gap-8 flex-end">
                <div class="row auto" v-if="task.status==TaskStatus.Running||task.status==TaskStatus.Stopped">
                  <div class="task-action red" v-if="task.status == TaskStatus.Running"
                       @click="() => stopTask(task)">{{ $t("Trade028") }}
                  </div>
                  <div class="task-action green" v-else @click="() => startTask(task)">{{ $t("Trade027") }}</div>
                </div>
                <div class="row auto" v-else>
                  <div class="task-action blank"></div>
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
          <CopyTradeTaskConfig v-if="task.expand" :order="task.order" @edit="onTaskEdit"></CopyTradeTaskConfig>
        </div>
      </div>
    </div>
    <Pagination v-if="total > 0" :total="total" :page-size="PageSize" :page="page"
                @change="onPageChange"></Pagination>
  </div>
  <TaskNameEdit type="copytrade" :address="taskAddress" :visible="editingTaskName" :name="taskName"
                @submit="onTaskNameEdited"></TaskNameEdit>
</template>
<script setup lang="ts">

import Switch from "~/components/base/Switch.vue";
import Loading from "~/components/base/Loading.vue";
import {SwitchState, TaskStatus} from "~/utils/constant";
import {taskStatusIcon} from "~/utils/resource";
import Pagination from "~/components/base/Pagination.vue";
import {PageSize} from "~/utils/common";
import {formatTaskTime, formatTokenAmount, nativeToken, pageableList, sort} from "~/utils/util";
import Image from "~/components/base/Image.vue";
import {taskStatusString, timeUnitKeys} from "~/utils/i18n";
import WalletAddress from "./components/WalletAddress.vue";
import {Task} from "~/models/Task";
import EmptyData from "~/components/base/EmptyData.vue";
import TokenAddress from "~/components/base/TokenAddress.vue";
import CopyTradeTaskConfig from "~/components/trades/components/CopyTradeTaskConfig.vue";
import {useNuxtApp} from "#imports";
import {Result} from "~/models/Result";
import TaskNameEdit from "~/components/base/TaskNameEdit.vue";
import {TaskSettings} from "~/models/TaskSettings";


let taskList: Array<Task> = [];
const {t} = useI18n({useScope: 'global'});
const {$api, $bus} = useNuxtApp();
const store = useAppStore();
const page = ref<number>(1);
const total = ref<number>(0);
const editingTaskName = ref(false);
const taskName = ref('');
const taskAddress = ref('');


const loading = ref<boolean>(true);

const hideStopped = ref<SwitchState>(SwitchState.off);

const dataList = ref<Task[]>([]);


const term = ref('');

const parseTaskList = (result: Result) => {
  if (result.code == 0) {
    let data = result.data;
    if (data) {
      if (Array.isArray(data)) {
        taskList.length = 0;
        for (let taskInfo of data) {
          let task = new Task();
          task.valueOf(taskInfo);
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
const loadTaskList = () => {
  loading.value = true;
  setTimeout(async () => {
    try {
      let result: Result = await $api.taskList();
      parseTaskList(result);
    } catch (e: any) {
    } finally {
      loading.value = false;
    }
  }, 500);

}
const elementId = (task: Task) => {
  return task.address.replace("0x", "");
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
const sortTask = (a: Task, b: Task) => {
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
const reloadData = (term: string, page: number, pageSize: number, filterComplete: SwitchState) => {
  let searchTerm = term.trim();
  if (searchTerm.length > 0) {
    if (store.chainId != "solana") {
      searchTerm = searchTerm.toLowerCase();
    }
  }
  let items = getFilterData(taskList, searchTerm, filterComplete);
  items.sort(sortTask);
  total.value = items.length;
  dataList.value = pageableList(items, page, pageSize);
}

const onTaskEdit = (settings: TaskSettings) => {
  for (let task of taskList) {
    if (task.address == settings.address) {
      task.updateSettings(settings);
    }
  }
  reloadData(term.value, page.value, PageSize, hideStopped.value);
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
const startTask = (task: Task) => {
  $api.startTask(task).then(r => {
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

const stopTask = (task: Task) => {
  $api.stopTask(task).then(r => {
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

const toggleTaskExpand = (targetTask: Task) => {
  for (let task of taskList) {
    if (task.id == targetTask.id) {
      task.expand = !task.expand;
    } else {
      task.expand = false;
    }
  }
  let currentTaskList = dataList.value;
  dataList.value = [...currentTaskList];
}

const onTokenSearch = (searchTerm: string) => {
  term.value = searchTerm;
  reloadData(searchTerm, 1, PageSize, hideCompleted.value);
  page.value = 1;
}

const onChainChange = () => {
  loadTaskList();
}
const onLogin = () => {
  loadTaskList();
}
const onLogout = () => {
  taskList.length = 0;
  reloadData(term.value, 1, PageSize, hideStopped.value);
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
  loadTaskList();
})
onUnmounted(() => {
  $bus.off(AppEvent.Login, onLogin);
  $bus.off(AppEvent.Logout, onLogout);
  $bus.off(AppEvent.TokenSearch, onTokenSearch);
  $bus.off(AppEvent.ChainChange, onChainChange);
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

  &.blank {
    cursor: auto;
    pointer-events: none;
  }

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
