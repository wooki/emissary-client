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
</template>

<script>
import Report from './components/Report.vue'
import OpenReport from './components/OpenReport.vue'
import Logo from './assets/emissary.svg'
import UploadIcon from './assets/icons/upload.svg'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';

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
        this.report = data;
        localStorage.setItem("report", JSON.stringify(data));
      }
    }
  },
  mounted() {
    let report = localStorage.getItem("report");
    if (report) this.report = JSON.parse(report);
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
    height: 40px;
    width: auto;
  }

  button {
    flex: 0 1 auto;
  }
}

main {
  background-size: cover;
  min-height: calc(100vh - var(--header-height));

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
</style>
