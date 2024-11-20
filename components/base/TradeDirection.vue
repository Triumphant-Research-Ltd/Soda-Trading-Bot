<template>
  <div :class="className">
    {{ $t(text) }}
  </div>
</template>
<script setup lang="ts">
import {OrderDirection} from "~/utils/constant";

interface TradeDirectionProps {
  direction: OrderDirection,
}

const props = defineProps<TradeDirectionProps>();
const className = computed(() => {
  switch (props.direction) {
    case OrderDirection.Sell:
      return ["trade-direction red"]
    case OrderDirection.Buy:
      return ["trade-direction green"]
    case OrderDirection.Authorize:
      return ["trade-direction green"]
    case OrderDirection.Withdraw:
      return ["trade-direction green"]
    case OrderDirection.Unknown:
      return ["trade-direction green"]
    default:
      return ["trade-direction", "gray"]
  }
});

const text = computed(() => {
  switch (props.direction) {
    case OrderDirection.Sell:
      return "Trade014"
    case OrderDirection.Buy:
      return "Trade015"
    case OrderDirection.Authorize:
      return "Trade017"
    case OrderDirection.Withdraw:
      return "Trade016"
    case OrderDirection.Unknown:
      return "Trade018"
  }
})
</script>
<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.trade-direction {
  @include box($width: 80px, $padding: 4px, $height: 26px);
  color: $textColor1;
  border-radius: 2px;
  &.red {
    background-color: $red1;
  }

  &.green {
    background-color: $green1;
  }

  &.gray {
    background-color: rgba($backgroundColor2, 0.4);
  }
}
</style>
