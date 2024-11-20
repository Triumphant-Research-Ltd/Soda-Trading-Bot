<script setup lang="ts">

const gotoTwitter = () => {
  window.open("https://twitter.com/@soda_finance");
};
const gotoHome = () => {
  window.location.href = "/";
};
const gotoCopyTrade = () => {
  window.location.href = "/copytrade";
};
const gotoSniper = () => {
  window.location.href = "/sniper";
};
</script>

<template>
  <div class="notfound">
    <span class="title">Oops, something went wrong.</span>
    <span class="desc">It looks like something went wrong on our end.If the issue persists,please shoot us a note so we can help out.</span>
    <div class="line"></div>
    <div class="buttons">
      <div class="button green" @click="gotoHome">{{ $t('Home001') }}</div>
    </div>

  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.notfound {
  @include box($direction: column, $gap: 24px);
  padding: 42px 86px !important;
  color: $textColor1;
  border: $border1;
  @include font(14px, 500);

  .title {
    @include font(32px, 500);
  }

  .desc {
    @include font(24px, 500);
  }

  .line {
  }

  .buttons {
    @include box($direction: row, $gap: 24px, $padding: 12px);
  }

  .button {
    @include box($width: fit-content, $height: 32px, $padding: 8px);
    @include font(16px, 500);
    color: $textColor1;
    border: $border1;
    cursor: pointer;
    border-radius: 2px;
    min-width: 110px;

    &.blue {
      background-color: $blue1;
    }

    &.green {
      background-color: $green1;
    }

    &.yellow {
      background-color: $yellow1;
      color: #000;
    }
  }
}

</style>
