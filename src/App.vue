<template>
  <header>
    <Logo class="logo" />
    <div class="report-info" v-if="report">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 32">
        <Banner :x="0" :y="0" :flag="report.MyBanner()" :scale="1" />
      </svg>
      <div class="report-info-empire">{{ report.MyKingdom() }},</div>
      <div class="report-info-turn">turn {{ report.turn }}</div>
    </div>
    <button class="icon" @click="upload" title="Open report file">
      <GetTurnIcon />
    </button>
    <button class="icon" @click="sendturn" title="Send turn file">
      <SendTurnIcon />
    </button>
  </header>
  <main :class="{ noreport: !report }">
    <Report v-if="report" :report="report" @updated="SaveLocalChanges" />
  </main>
  <Dialog ref="uploadReportDialogOpen">
    <OpenReport @loaded="loaded" />
  </Dialog>
  <svg style="position: absolute; height: 0; width: 0; opacity: 0">
    <filter id="wavy">
      <feTurbulence x="0" y="0" baseFrequency="0.02" numOctaves="5" seed="1" />
      <feDisplacementMap in="SourceGraphic" scale="6" />
    </filter>
  </svg>
</template>

<script>
import Report from "./components/Report.vue";
import OpenReport from "./components/OpenReport.vue";
import Logo from "./assets/emissary.svg";
import GetTurnIcon from "./assets/icons/getturn.svg";
import SendTurnIcon from "./assets/icons/sendturn.svg";
import ReportClass from "@/libs/Report.js";
import Banner from "./components/Banner.vue";
import Dialog from "./components/Dialog.vue";

export default {
  data() {
    return {
      report: null,
    };
  },
  components: {
    Logo,
    GetTurnIcon,
    SendTurnIcon,
    Report,
    OpenReport,
    Banner,
    Dialog,
  },
  methods: {
    upload() {
      this.$refs.uploadReportDialogOpen.open();
    },
    sendturn() {
      console.log("sendturn");
      const orders = this.report.CreateOrders();
      console.log("orders", orders);

      const a = document.createElement("a");
      const file = new Blob([orders], { type: "text/plain" });
      a.setAttribute("href", URL.createObjectURL(file));
      a.setAttribute(
        "download",
        `turn.${this.report.Me()}.${this.report.turn}.json`,
      );
      a.click();
      URL.revokeObjectURL(a.getAttribute("href"));
    },
    loaded(data) {
      this.$refs.uploadReportDialogOpen.close();
      if (data.map && data.my_kingdom && data.kingdoms) {
        this.CreateReport(data);
        localStorage.setItem("report", JSON.stringify(data));
      }
    },
    SaveLocalChanges(data) {
      if (data.map && data.my_kingdom && data.kingdoms) {      
        localStorage.setItem("report", JSON.stringify(data));
      }
    },
    CreateReport(rpt) {
      this.report = new ReportClass(rpt);
    },
  },
  mounted() {
    let report = localStorage.getItem("report");
    if (report) this.CreateReport(JSON.parse(report));
  },
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
      content: "";
      background-image: url("./assets/bg.webp");
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
