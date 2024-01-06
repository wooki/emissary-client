<template>
  <header>
    <Logo class="logo" />
    <button class="icon" @click="upload" title="Upload report file"><UploadIcon /></button>
  </header>
  <main :class="{noreport: !report}">
    <Report v-if="report" :report="report" />
  </main>
  <sl-dialog ref="uploadReportDialogOpen" label="Load Report">
    <OpenReport @loaded="loaded"/>
  </sl-dialog>  
  <svg style="position: absolute; height: 0; width: 0; opacity: 0;">
    <filter id="wavy">
    <feTurbulence x="0" y="0" baseFrequency="0.02" numOctaves="5" seed="1" />
    <feDisplacementMap in="SourceGraphic" scale="6" />    
  </filter>  
</svg>
</template>

<script>
import Report from './components/Report.vue'
import OpenReport from './components/OpenReport.vue'
import Logo from './assets/emissary.svg'
import UploadIcon from './assets/icons/upload.svg'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import ReportClass from '@/libs/Report.js';

export default {
  data() {
    return {
      report: null
    }
  },
  components: {
    Logo,
    UploadIcon,
    Report,
    OpenReport
  },
  methods: {
    upload() {
      this.$refs.uploadReportDialogOpen.show();
    },
    loaded(data) {
      this.$refs.uploadReportDialogOpen.hide();
      if (data.map && data.my_kingdom && data.kingdoms) {
        this.CreateReport(data);
        localStorage.setItem("report", JSON.stringify(data));
      }
    },
    CreateReport(rpt) {
      this.report = new ReportClass(rpt);
    }
  },
  mounted() {
    let report = localStorage.getItem("report");
    if (report) this.CreateReport(JSON.parse(report));
  }
}
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
