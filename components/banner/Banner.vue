<template>
  <div class="banner">
    <Image icon="icon-logo" :icon-set="iconSet('icon-logo')" extension="png" :button="true" @click="gotoHome"/>
    <div class="head-sep"></div>
    <div class="nav">
      <!--TRENDING-->
      <div class="nav-item" @click="gotoTrending()">{{ $t("Home039") }}</div>
      <!--TRADE-->
      <el-popover placement="bottom" trigger="hover" :width="184" :show-arrow="false" effect="dark"
                  popper-class="popover">
        <template #reference>
          <div class="nav-item effect">{{ $t("Home041") }}
            <Image icon="icon-chevron-down" :disabled="true"></Image>
          </div>
        </template>
        <div class="banner-menu">
          <div class="menu-item" @click="gotoFlashTrade()">{{ $t("Home042") }}</div>
          <div class="menu-item" @click="gotoCopyTrade()">{{ $t("Home002") }}</div>
          <div class="menu-item" @click="gotoSniperTrade()">{{ $t("Home043") }}</div>
        </div>
      </el-popover>
       <!--SMART MONEY-->
      <el-popover placement="bottom" trigger="hover" :width="184" :show-arrow="false" effect="dark"
                  popper-class="popover">
        <template #reference>
          <div class="nav-item effect">{{ $t("Home003") }}
            <Image icon="icon-chevron-down" :disabled="true"></Image>
          </div>
        </template>
        <div class="banner-menu">
          <div class="menu-item" @click="gotoSmartMoney()">{{ $t("Home040") }}</div>
          <div class="menu-item" @click="gotoBackTesting()">{{ $t("Home005") }}</div>
        </div>
      </el-popover>
      <!--COMMUNITY-->
      <el-popover placement="bottom" trigger="hover" :width="330" :show-arrow="false" effect="dark"
                  popper-class="popover">
        <template #reference>
          <div class="nav-item effect">{{ $t("Home009") }}
            <Image icon="icon-chevron-down" :disabled="true"></Image>
          </div>
        </template>
        <div class="banner-menu community">
          <div class="community-row menu-item-one">
            <span> {{ $t("Home045") }}</span>
            <div class="flex"></div>
          </div>
          <div class="community-row menu-item-two" @click="openTelegram">
            <Image icon="icon-community-telegram" :disabled="true" :width="20" :height="20"></Image>
            <span> https://t.me/SodaBotAnn</span>
          </div>
          <div class="community-row menu-item-two" @click="openX">
            <Image icon="icon-community-twitter" :disabled="true" :width="20" :height="20"></Image>
            <span> https://x.com/SodaBotHQ</span>
          </div>
          <div class="community-row menu-item-two" @click="openDiscord">
            <Image icon="icon-community-discord" :disabled="true" :width="20" :height="20"></Image>
            <span> https://discord.gg/G5MQ2gQFma</span>
          </div>
          <div class="community-row menu-item-one">
            <span> {{ $t("Home046") }}</span>
            <div class="flex"></div>
          </div>
          <div class="community-row menu-item-two" @click="()=>openChannel('0x1')">
            <Image chain="0x1" :disabled="true" :width="20" :height="20"></Image>
            <span> @sodaboteth</span>
          </div>
          <div class="community-row menu-item-two" @click="()=>openChannel('solana')">
            <Image chain="solana" :disabled="true" :width="20" :height="20"></Image>
            <span> @sodabotsolana</span>
          </div>
          <div class="community-row menu-item-two" @click="()=>openChannel('0x2105')">
            <Image chain="0x2105" :disabled="true" :width="20" :height="20"></Image>
            <span> @sodabotbase</span>
          </div>
          <div class="community-row menu-item-two" @click="()=>openChannel('0x38')">
            <Image chain="0x38" :disabled="true" :width="20" :height="20"></Image>
            <span> @sodabotbsc</span>
          </div>
        </div>
      </el-popover>
      <!--RANKING-->
      <div class="nav-item" @click="gotoRanking()">{{ $t("Home004") }}</div>
       <!--DOCS-->
      <div class="nav-item" @click="gotoDocs()">{{ $t("Home047") }}</div>

    </div>
    <div class="flex"></div>
    <div class="nav gap-8">
      <!--gas price-->
      <ChainGas></ChainGas>
      <div class="sep"></div>
      
      <el-popover placement="bottom" trigger="hover" :width="200" :show-arrow="false" effect="dark"
                  popper-class="popover">
        <template #reference>
          <Image class-name="x" :chain="store.chainId" :width="24" :height="24" :button="true"></Image>
        </template>
        <div class="banner-menu">
          <div class="menu-item user" @click="switchToEthereum">
            <Image chain="0x1" :disabled="true" :width="20" :height="20"></Image>
            {{ $t("Home012") }}
          </div>
          <div class="menu-item user" @click="switchToBsc">
            <Image chain="0x38" :disabled="true" :width="20" :height="20"></Image>
            {{ $t("Home013") }}
          </div>
          <div class="menu-item user" @click="switchToBase">
            <Image chain="0x2105" :disabled="true" :width="20" :height="20"></Image>
            {{ $t("Home014") }}
          </div>
          <div class="menu-item user" @click="switchToSolana">
            <Image chain="solana" :disabled="true" :width="20" :height="20"></Image>
            {{ $t("Home015") }}
          </div>
        </div>
      </el-popover>
      
      <UserMenu v-if="store.isLogin" @click="navigateTo"></UserMenu>
      
      <WalletConnect v-else @click="userLogin"></WalletConnect>
    </div>
  </div>
</template>
<script setup lang="ts">
import Image from "@/components/base/Image.vue";
import {iconSet} from "@/utils/resource";
import {NavigationRoute} from "@/utils/constant";
import ChainGas from "@/components/banner/ChainGas.vue";
import WalletConnect from "@/components/banner/WalletConnect.vue";
import UserMenu from "@/components/banner/UserMenu.vue";
import {useNuxtApp} from "#imports";

const props = defineProps();
const emit = defineEmits(['navigate']);
const store = useAppStore();
const {$i18n, $api} = useNuxtApp();
const {t} = useI18n({useScope: 'global'});

const userLogin = () => {
  navigateTo(NavigationRoute.Login, "0x1")
}

const navigateTo = (route: NavigationRoute, data: any = null) => {
  emit('navigate', route, data);
}
const switchToEthereum = () => {
  if (store.chainId != "0x1") {
    navigateTo(NavigationRoute.SwitchChain, "0x1");
  }

}
const switchToBsc = () => {
  if (store.chainId != "0x38") {
    navigateTo(NavigationRoute.SwitchChain, "0x38");
  }

}
const switchToBase = () => {
  if (store.chainId != "0x2105") {
    navigateTo(NavigationRoute.SwitchChain, "0x2105");
  }

}
const switchToSolana = () => {
  if (store.chainId != "solana") {
    navigateTo(NavigationRoute.SwitchChain, "solana");
  }

}
const openChannel = (chainId: string) => {
  navigateTo(NavigationRoute.TGChannel, chainId);
}

const switchToEnglish = () => {
  $i18n.setLocale('en');
  $i18n.setLocaleCookie('en');
  $api.setLanguage("en");
}
const switchToChinese = () => {
  $i18n.setLocale('cn');
  $i18n.setLocaleCookie('cn');
  $api.setLanguage("cn");

}
const openTelegram = () => {
  navigateTo(NavigationRoute.Telegram);
}
const openX = () => {
  navigateTo(NavigationRoute.Twitter);
}
const openDiscord = () => {
  navigateTo(NavigationRoute.Discord);
}

const gotoHome = () => {
  navigateTo(NavigationRoute.Home);
}

const gotoTrending = () => {
  navigateTo(NavigationRoute.Trending);
}
const gotoFlashTrade = () => {
  navigateTo(NavigationRoute.FlashTrade);
}
const gotoCopyTrade = () => {
  navigateTo(NavigationRoute.CopyTrade);
}
const gotoSniperTrade = () => {
  navigateTo(NavigationRoute.SniperTrade);
}
const gotoSmartMoney = () => {
  navigateTo(NavigationRoute.SmartMoney);
}
const gotoBackTesting = () => {
  navigateTo(NavigationRoute.BackTesting);
}
const gotoDocs = () => {
  navigateTo(NavigationRoute.Docs);
}
const gotoRanking = () => {
  navigateTo(NavigationRoute.Ranking);
}
</script>
<style scoped lang="scss">
@use "assets/scss/base" as *;
@use "assets/scss/global.variable" as *;

.banner {
  @include box($justify: space-between, $width: 100%, $height: 99px);
  padding: 20px 48px;

  &.blue {
    background-color: $blue3;
  }

  .head-sep {
    width: 63px;
  }

  .nav {
    @include box($justify: flex-start, $width: auto, $gap: 32px);
    height: 40px;

    .nav-item {
      @include box($gap: 4px);
      padding: 0 1px;
      @include font($fontWeight: 500);
      cursor: pointer;
      color: $primaryColor;
      white-space: nowrap;

      &.effect {
        &:hover {
          .image {
            transform: rotate(180deg);
          }
        }

      }
    }

    &.gap-8 {
      gap: 8px;
    }


  }

  .sep {
    width: 44px;
  }

  .x {
    width: 44px;
    height: 40px;
    padding: 8px 10px;
    background-color: transparent;
    border: 1px solid $textColor1;
    border-radius: 16px;
  }
}
</style>
