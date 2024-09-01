<template>
  <header>
    <Logo class="logo" />
    <div v-if="report.isLoaded" class="report-info">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 8 16 16"
        height="16"
        width="16">
        <Banner :x="0" :y="0" :flag="report.MyBanner" :scale="1" />
      </svg>
      <div class="report-info-empire">{{ report.MyKingdom.name }},</div>
      <div class="report-info-turn">turn {{ report.Turn }}</div>
    </div>
    <button class="icon" title="Open report file" @click="upload">
      <GetTurnIcon />
    </button>
    <button class="icon" title="Send turn file" @click="sendturn">
      <SendTurnIcon />
    </button>
  </header>
  <main :class="{ noreport: !report }">
    <Report v-if="report.isLoaded" />
  </main>
  <DialogBox ref="uploadReportDialogOpen">
    <OpenReport @loaded="loaded" />
  </DialogBox>
  <svg style="position: absolute; height: 0; width: 0; opacity: 0">
    <filter id="wavy">
      <feTurbulence x="0" y="0" baseFrequency="0.02" numOctaves="5" seed="1" />
      <feDisplacementMap in="SourceGraphic" scale="6" />
    </filter>
    <filter id="desaturate">
      <feColorMatrix
        in="SourceGraphic"
        type="matrix"
        values="0.66 0 0 0 0
              0 0.66 0 0 0
              0 0 0.66 0 0
              0 0 0 0.33 0" />
    </filter>
  </svg>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Report from '@/components/Report.vue';
import OpenReport from '@/components/OpenReport.vue';
import Logo from '@/assets/emissary.svg';
import GetTurnIcon from '@/assets/icons/getturn.svg';
import SendTurnIcon from '@/assets/icons/sendturn.svg';
import Banner from '@/components/Banner.vue';
import DialogBox from '@/components/Dialog.vue';
import { useReportStore } from '@/stores/ReportStore';

const uploadReportDialogOpen = ref(null);
const report = useReportStore();

onMounted(() => {
  report.LoadReport();
});

const upload = () => {
  uploadReportDialogOpen.value.open();
};

const sendturn = () => {
  const orders = report.Orders;
  console.log('sendturn', orders);

  const a = document.createElement('a');
  const file = new Blob([JSON.stringify(orders, null, '\t')], {
    type: 'text/plain',
  });
  a.setAttribute('href', URL.createObjectURL(file));
  a.setAttribute('download', `turn.${report.Me}.${report.Turn}.json`);
  a.click();
  URL.revokeObjectURL(a.getAttribute('href'));
};

const loaded = (data) => {
  uploadReportDialogOpen.value.close();
  if (data.map && data.my_kingdom && data.kingdoms) {
    report.SetReport(data);
    report.ClearOrders();
    report.SaveReport();
  }
};
</script>

<style>
header {
  height: var(--header-height);
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
  background-color: var(--color-dark-bg);
  color: var(--color-dark-bg-text);
  padding: 5px;

  .logo {
    flex: 0 1 auto;
    fill: currentColor;
    margin-right: auto;
    height: 36px;
    width: auto;
  }

  .report-info {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 36px;
    margin-right: auto;
    gap: 0.3em;
    font-size: 16px;
    color: var(--color-dark-bg-text);

    svg {
      height: 32px;
      width: 16px;
      margin: 0 5px 0 0;
    }

    .report-info-empire {
      text-transform: uppercase;
      font-weight: bold;
    }
    .report-info-turn {
      font-size: 14px;
    }
  }

  button {
    flex: 0 1 auto;
  }
}

main {
  background-size: cover;
  min-height: calc(100vh - var(--header-height));
  background-color: var(--color-dark-bg);
  color: var(--color-dark-bg-text);

  &.noreport {
    &:before {
      opacity: 0.66;
      content: '';
      background-image: url('./assets/bg.webp');
      background-size: cover;
      display: block;
      min-height: calc(100vh - var(--header-height));
    }
  }
}

@media (min-aspect-ratio: 1.2/1) {
  header {
    padding: 5px 12px;
  }
}
</style>
