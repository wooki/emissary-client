<template>
  <g>
    <!-- <rect :x="x" :y="y" :width="width" :height="height" stroke="red" fill="transparent" /> -->
    <!-- <rect v-for="(position, positionIndex) in positions" :key="positionIndex" :x="position.x" :y="position.y" :width="positionSize" :height="positionSize" stroke="blue" fill="transparent" /> -->
    <g class="xxx"
      v-for="(position, positionIndex) in positions"
      :key="positionIndex"
      :transform="transform(position)">
      <use
        :transform="`scale(${positionSize / displayItems[positionIndex].height}) translate(${offsetX + displayItems[positionIndex].offsetX},${offsetY + displayItems[positionIndex].offsetY})`"
        :width="displayItems[positionIndex].width"
        :height="displayItems[positionIndex].height"
        mask="url(#agent_mask)"
        :href="displayItems[positionIndex].href" />        
    </g>
  </g>
</template>

<script>
export default {
  props: {
    items: {
      type: Object,
      required: true,
    },
    hexagonSize: {
      type: Number,
      required: true,
    },
  },
  computed: {
    x() {
      return this.items.center.x - this.hexagonSize * 0.8;
    },
    y() {
      return this.items.center.y - this.hexagonSize * 0.4;
    },
    height() {
      return this.hexagonSize * 1.15;
    },
    width() {
      return this.hexagonSize * 1.6;
    },
    displayItems() {
      // work out what we have from the area and return as an array
      let list = [];

      Object.keys(this.items?.area?.agents).forEach((key) => {
        let agent = this.items.area.agents[key];
        let item = Object.assign(
          {
            href: `#agent-${agent.owner ?? 'unknown'}`,
            type: 'agent',
            height: 16,
            width: 16,
            offsetX: 0,
            offsetY: 0
          },
          agent,
        );
        list.push(item); 
      });

      // Object.keys(this.items?.area?.armies).forEach((key) => {
      //   let army = this.items.area.armies[key];
      //   let item = Object.assign(
      //     {
      //       href: `#army-${agent.owner ?? 'unknown'}`,
      //       type: 'army',
      //       height: 22,
      //       width: 16,
      //       offsetX: 3,
      //       offsetY: 0
      //     },
      //     army,
      //   );
      //   list.push(item); 
      // });

      return list;
    },
    displayItemsCount() {
      return this.displayItems ? this.displayItems.length : 0;
    },
    positionSize() {
      return this.calculatePostionSize(0);
    },
    positions() {
      let rows = Math.floor(this.height / this.positionSize);
      let cols = Math.floor(this.width / this.positionSize);

      if (rows < 1) rows = 1;
      if (cols < 1) cols = 1;

      const positions = [];

      // center horizontally
      let startX = 0;
      const colsWidth = cols * this.positionSize;
      if (colsWidth < this.width) {
        startX = Math.round((this.width - colsWidth) / 2);
      }

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (positions.length >= this.displayItemsCount) {
            break;
          }

          positions.push({
            x: this.x + startX + j * this.positionSize,
            y: this.y + i * this.positionSize,
          });
        }
      }
      return positions;
    },
    offsetX() {
      return 0;
    },
    offsetY() {
      return 0;
    }
  },
  methods: {
    transform(position) {
      return `translate(${position.x},${position.y})`;
    },
    calculatePostionSize(trySize) {
      let size = trySize;
      if (!size)
        size = Math.sqrt((this.width * this.height) / this.displayItemsCount);
      if (size > this.width && size < this.height) return this.width;
      if (size > this.height && size < this.width) return this.height;

      // check we can fit all of our items
      let rows = Math.floor(this.height / size);
      let cols = Math.floor(this.width / size);
      if (rows * cols < this.displayItemsCount) {
        return this.calculatePostionSize(size * 0.99);
      }

      return size;
    },
  },
};
</script>

<style scoped>
g {
  pointer-events: none;
}
</style>
