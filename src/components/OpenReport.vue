<template>
  <sl-tab-group>
    <sl-tab slot="nav" panel="upload">Upload</sl-tab>
    <sl-tab slot="nav" panel="url">Url</sl-tab>

    <sl-tab-panel name="upload">
      <form class="open-report" @submit.prevent="uploadFile">
        <label for="report-file-upload">Open report file</label>
        <input
          id="report-file-upload"
          ref="file"
          type="file"
          accept=".json,application/json" />
        <button>Open</button>
      </form>
    </sl-tab-panel>
    <sl-tab-panel name="url">
      <form class="open-report" @submit.prevent="loadUrl">
        <label for="report-file-upload">Open report file</label>
        <input id="report-file-url" ref="url" v-model="url" type="url" />
        <button>Open</button>
      </form>
    </sl-tab-panel>
  </sl-tab-group>
</template>

<script>
import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';

export default {
  emits: ['loaded'],
  data() {
    return {
      url: '',
    };
  },
  methods: {
    uploadFile() {
      if (this.$refs.file.files[0]) {
        var reader = new FileReader();
        reader.onload = (event) => {
          var obj = JSON.parse(event.target.result);
          this.$emit('loaded', obj);
        };
        reader.readAsText(this.$refs.file.files[0]);
      }
    },
    loadUrl() {
      fetch(this.url, {
        headers: {
          Accept: 'application/json',
        },
      })
        .then((response) => {
          response.json().then((data) => {
            this.$emit('loaded', data);
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>

<style scoped>
.open-report {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
label {
  font-weight: bold;
  display: block;
  margin: 0 0 1em 0;
}
input {
  display: block;
  margin: 0 0 1em 0;
}
button {
  align-self: flex-end;
}
</style>
