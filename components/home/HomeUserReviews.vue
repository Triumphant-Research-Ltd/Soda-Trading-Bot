<template>
  <div class="row home-user-reviews">
    <div class="reviews">
      <div class="title">{{ $t("Home033") }}</div>
      <div class="sep"></div>
      <div class="column gap-16">
        <div class="row gap-8  flex-start">
          <div class="ball orange"></div>
          <div class="column auto align-items-left">
            <div class="name">Passionate</div>
            <div class="kol">KOL</div>
          </div>
        </div>
        <div class="desc">
          We are a team of passionate traders who grew up trading memecoins across multiple chains. Recognizing the gaps
          in the market, we took action. Soda swiftly gained popularity as the fastest, most reliable sniping tool. Now,
        </div>
        <div class="user-action">
          <Image icon="icon-user-reviews-arrow-left" :button="true"></Image>
          <Image icon="icon-user-reviews-arrow-right" :button="true"></Image>
        </div>
      </div>
      <div class="line">
        <div class="line-content"></div>
      </div>
      <div class="column gap-16">
        <div class="row gap-8  flex-start">
          <div class="ball blue"></div>
          <div class="column auto align-items-left">
            <div class="name">Passionate</div>
            <div class="kol">KOL</div>
          </div>
        </div>
        <div class="desc">
          We are a team of passionate traders who grew up trading memecoins across multiple chains. Recognizing the gaps
          in the market, we took action. Soda swiftly gained popularity as the fastest, most reliable sniping tool. Now,
        </div>
        <div class="user-action">
          <Image icon="icon-user-reviews-arrow-left" :button="true"></Image>
          <Image icon="icon-user-reviews-arrow-right" :button="true"></Image>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-deco">
        <Image icon="icon-user-reviews-decorate" :button="false"></Image>
      </div>
      <div class="column text">
        <div class="text1">POP YOUR SODA AND START TO TRADED</div>
        <div class="text2">We are a team of passionate traders who grew up trading memecoins across multiple chains.
          Recognizing the gaps in the market, we took action. Soda swiftly gained popularity as the fastest, most
          reliable sniping tool. Now, We are a team of passionate traders who grew up trading memecoins across multiple
          chains.
        </div>
        <div class="button" @click="onGetStarted">{{ $t("Home037") }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Image from "~/components/base/Image.vue";

const onGetStarted = () => {

}
</script>
<style scoped lang="scss">
@use "@/assets/scss/base" as *;
@use "@/assets/scss/global.variable" as *;

.home-user-reviews {
  height: 781px !important;
  padding: 166px 106px 192px 118px !important;
  background-image: url(imageUrl("icon-user-reviews-background"));
  background-position: bottom, center;
  background-color: #000;
  background-repeat: no-repeat;
  gap: 50px !important;

  .card {
    @include box($padding: 44px 44px 35px 0, $justify: space-between, $width: 615px, $height: 426px);
    background-color: $blue3;
    border-radius: 16px;

    .card-deco {
      @include box($width: auto, $height: auto);
      margin-top: -140px;
      transform: rotate(-35.55deg);
    }

    .text {
      @include box($direction: column, $gap: 8px, $height: 100%);
    }

    .text1 {
      @include font(24px, 900);
      color: $textColor1;
    }

    .text2 {
      @include box($width: auto, $direction: column);
      flex: 1;
      @include font(14px, 500);
      color: $textColor1;
    }

    .button {
      @include box($width: 271px, $height: 53px);
      background-color: $backgroundColor0;
      color: $textColor1;
      @include font(14px, 700);

      cursor: pointer;
      border-radius: 16px;

      &.blank {
        background-color: transparent;
        pointer-events: none;
      }
    }
  }

  .title {
    @include font(24px, 600);
    color: $textColor1;
  }

  .reviews {
    @include box($direction: column, $justify: flex-start, $height: 100%, $align: flex-start);
    flex: 1;

    .sep {
      height: 40px;
      width: 100%;
    }

    .line {
      @include box($height: 66px);

      .line-content {
        background-color: $textColor1;
        width: 100%;
        height: 1px;
      }

    }

    .name {
      color: $textColor1;
      @include font(18px, 500);
    }

    .kol {
      @include font(14px, 500);
      color: $textColor2;
    }

    .desc {
      color: $textColor2;
    }

    .user-action {
      @include box($justify: flex-start, $gap: 32px);
    }

    .ball {
      width: 42px;
      height: 42px;
      border-radius: 50%;

      &.orange {
        background-color: $orange1;
      }

      &.blue {
        background-color: $blue3;
      }
    }
  }

}

</style>
