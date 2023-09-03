<template>
  <form class="open-report" @submit.prevent="submit">
    <label for="report-file-upload">Open report file</label>
    <input ref="file" id="report-file-upload" type="file" accept=".json,application/json" />
    <button>Open</button>
  </form>
</template>

<script>
export default {
  emits: ["loaded"],
  methods: {
    submit() {
      if (this.$refs.file.files[0]) {
        var reader = new FileReader();
        reader.onload = (event) => {
          var obj = JSON.parse(event.target.result);
          this.$emit("loaded", obj);
        };
        reader.readAsText(this.$refs.file.files[0]);
      }
    }
  }
}
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
