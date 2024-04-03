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

    <div v-else class="area-panel-reports-container area-panel-items">
      <div
        tabindex="0"
        @click="SelectItem(itemIndex)"
        @keypress.enter="SelectItem(itemIndex)"
        v-for="(item, itemIndex) in items"
        :key="itemIndex"
        class="area-panel-report has-details area-panel-item"
        :class="`area-panel-${item.type}`"
      >        
        <svg v-if="item.owner">
          <use :mask="`url(#${item.type}_mask)`" :href="`#banner-${item.owner}`"></use>
        </svg>
        <div class="item-summary">
          <div class="item-summary-title">{{ item.type }}</div>
          <div v-if="item.owner" class="field">for {{ EmpireName(item.owner) }}</div>
          <div class="field" v-if="item.skill">{{ item.range ?? '-' }}/{{ item.depth ?? '-' }}/{{ item.skill ?? '-' }}</div>
        </div>
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
      const items = [];

      // get from area
      Object.keys(this.area.agents).forEach((agentId) => {
        items.push(Object.assign({
          type: 'agent',
        }, this.area.agents[agentId]));
      });

      // look in this.area.agents (object keyed with unique id)
      // TODO: look for armies?, structures?, church? etc.
      
      return items;
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
    EmpireName(owner) {
      if (!owner) return "Unowned";
      if (this.OwnedByMe(owner)) return `${this.report.MyKingdom()}`;
      return this.report.kingdoms[owner].name;
    },
    OwnedByMe(owner) {
      return (owner == this.report.Me());
    },     
  },
};
</script>

<style scoped></style>
