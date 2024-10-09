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
        <Banner :flag="flag" :scale="1" @click="handleBannerClick(flag)" />
        <text x="20" y="50" text-anchor="middle" font-size="14">
          {{ flag }}
        </text>
      </g>
    </svg>
  </div>
</template>

<script>
import Banner from '@/components/Banner.vue';
import BannerMasks from '@/components/BannerMasks.vue';

export default {
  components: {
    Banner,
    BannerMasks,
  },
  data() {
    return {
      bannerFlags: [],
      bannerWidth: 100,
      bannerHeight: 75,
      columnsCount: 16
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
      //   '76733',
      //   '47123',
      //   '51097',
      //   '01234',
      //   '12345',
      //   '23456',
      //   '34567',
      //   '45678',
      //   '56789',
      //   '67890',
      //   '78901',
      //   '89012',
      //   '91234',
      //   '82345',
      //   '73456',
      //   '64567',
      //   '55678',
      //   '46789',
      //   '37890',
      //   '28901',
      //   '19012',
      //   '06964',
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
