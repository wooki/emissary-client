<template>
  <div class="area-panel-reports area-panel-items">
    <div class="parchment"></div>

    <div v-if="selectedItem" class="area-panel-details">
      <button class="icon" @click="SelectItem(null)"><BackIcon /></button>
      <div class="area-panel-report-title">{{ selectedItem.type }}</div>
      <div class="area-panel-report-details">        
        SELECTED ITEM DATA
      </div>
    </div>

    <div v-else class="area-panel-reports-container">
      <div
        tabindex="0"
        @click="selectItem(itemIndex)"
        @keypress.enter="selectItem(itemIndex)"
        v-for="(item, itemIndex) in items"
        :key="itemIndex"
        class="area-panel-report has-details"
      >
        ITEM TITLE and ICON
      </div>
    </div>
  </div>

</template>

<script>
import { AddFloats } from "@/libs/SafeMath.js";
import BackIcon from "@/assets/icons/back.svg";
import TextEndingWithLink from "./TextEndingWithLink.vue";
import OrderIcon from "../assets/icons/order.svg";

export default {
  props: {
    report: {
      type: Object,
      required: true,
    },
    area: {
      type: Object,
      required: true,
    },
  },
  data: function () {
    return {
      selectedItemIndex: null
    };
  },
  emits: ["select", "updated", "highlight"],
  components: {
    BackIcon,
    TextEndingWithLink,
    OrderIcon
  },
  computed: {
    selectedItem() {
      if (this.selectedItemIndex == null) return null;
      return this.items[this.selectedItemIndex];
    },    
    items() {
      // get from area
      console.log("GET ITEMS:", this.area);

      // look in this.area.agents (object keyed with unique id)
      // TODO: look for armies?, structures?, church? etc.
      return [];
    }
  },
  methods: {
    HighlightArea(area) {
      this.$emit("highlight", area);
    },
    UnhighlightArea(area) {
      this.$emit("highlight", null);
    },
    Updated(area) {
      this.$emit("updated", area);
    },  
    SelectArea(area) {
      this.SelectReport(null);
      this.$emit("select", area);
    },
    SelectItem(index) {
      if (this.selectedItemIndex == index) {
        this.selectedItemIndex = null;
      } else {
        this.selectedItemIndex = index;
      }
    },    
  },
};
</script>

<style scoped></style>
