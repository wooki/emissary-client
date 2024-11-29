<template>
  <div class="banner-test-page">
    <svg
      class="banner-grid"
      :width="gridWidth"
      :height="gridHeight"
      :viewBox="`0 0 ${gridWidth} ${gridHeight}`">
      <BannerMasks />
      <g
        v-for="(flag, index) in bannerFlags"
        :key="index"
        :transform="`translate(${(index % columnsCount) * bannerWidth}, ${Math.floor(index / columnsCount) * bannerHeight})`">
        <BannerSvg
          mask="banner"
          :flag="flag"
          :scale="1"
          @click="handleBannerClick(flag)" />
        <text x="20" y="50" text-anchor="middle" font-size="14">
          {{ flag }}
        </text>
      </g>
    </svg>
  </div>
</template>

<script>
import BannerSvg from '@/components/BannerSvg.vue';
import BannerMasks from '@/components/BannerMasks.vue';

export default {
  components: {
    BannerSvg,
    BannerMasks,
  },
  data() {
    return {
      bannerFlags: [],
      bannerWidth: 100,
      bannerHeight: 75,
      columnsCount: 10,
    };
  },
  computed: {
    gridWidth() {
      return this.columnsCount * this.bannerWidth;
    },
    gridHeight() {
      const rowsCount = Math.ceil(this.bannerFlags.length / this.columnsCount);
      return rowsCount * this.bannerHeight;
    },
  },
  created() {
    this.generateBannerFlags();
  },
  methods: {
    generateBannerFlags() {
      const candidates = [];

      for (let i = 0; i < 100000; i++) {
        if (i % 10 === 0 || i % 10 === 1 || i % 10 === 2) {
          candidates.push(i.toString().padStart(5, '0'));
        }
      }

      const isUnique = (flag, selectedFlags) => {
        for (const selectedFlag of selectedFlags) {
          let sharedDigits = 0;
          for (let i = 0; i < 5; i++) {
            if (flag[i] === selectedFlag[i]) {
              sharedDigits++;
            }
          }
          if (sharedDigits > 2) {
            return false;
          }
        }
        return true;
      };

      let selectedFlags = [];
      while (selectedFlags.length < 200 && candidates.length > 0) {
        const randomIndex = Math.floor(Math.random() * candidates.length);
        const candidate = candidates[randomIndex];
        if (isUnique(candidate, selectedFlags)) {
          selectedFlags.push(candidate);
        }
        candidates.splice(randomIndex, 1);
      }

      // selectedFlags = [
      // '00742',
      // '01742',
      // '02742',
      // '03742',
      // '04742',
      // '05742',
      // '06742',
      // '07742',
      // '08742',
      // '09742',

      // '10850',
      // '11850',
      // '12850',
      // '13850',
      // '14850',
      // '15850',
      // '16850',
      // '17850',
      // '18850',
      // '19850',

      // '30902',
      // '31902',
      // '32902',
      // '33902',
      // '34902',
      // '35902',
      // '36902',
      // '37902',
      // '38902',
      // '39902',
      // ];
      this.bannerFlags = selectedFlags;
    },
    handleBannerClick(flag) {
      console.log(`Banner clicked: ${flag}`);
    },
  },
};
</script>

<style scoped>
.banner-test-page {
  padding: 20px;
}

.banner-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 20px;
}

.banner-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
