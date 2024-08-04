<template>
  <div
    class="map"
    @mousemove="mousemove"
    @mousedown="mousedown"
    @mouseup="mouseup"
    @wheel="wheel">
    <div class="parchment"></div>
    <svg v-if="mounted" xmlns="http://www.w3.org/2000/svg" :viewBox="viewBox">
      <defs>
        <BannerMasks></BannerMasks>
        <BannerSymbols
          :v-if="report.isLoaded"
          :kingdoms="report.Kingdoms"></BannerSymbols>
      </defs>

      <Hexagon
        v-for="hex in mapHexagons"
        :key="hex.key"
        :data="hex"
        :terrain="hex.terrain"
        :coord="`${hex.x},${hex.y}`"
        :points="hex.points"
        :fill="hex.fill"
        stroke-width="1"
        :stroke="hex.stroke"
        :desaturate="hex.desaturate"
        @mouseenter="hexHighlight"
        @mouseleave="hexUnhighlight"
        @click="SelectHexagon(hex)" />
      <path
        v-for="border in mapBorders"
        :key="border.key"
        :d="border.path"
        :stroke-width="6"
        :stroke="border.stroke"
        fill="none"
        stroke-dasharray="10,15"
        stroke-linecap="round"
        :filter="border.filter" />

      <Hexagon
        v-if="hoveredHex"
        terrain="hovered"
        :coord="`${hoveredHex.x},${hoveredHex.y}`"
        :points="hoveredHex.points"
        fill="none"
        stroke-width="4"
        stroke="white" />
      <Hexagon
        v-if="selectedHex"
        terrain="selected"
        :coord="`${selectedHex.x},${selectedHex.y}`"
        :center="selectedHex.center"
        :points="selectedHex.points"
        fill="none"
        stroke-width="6"
        stroke="white"
        stroke-dash-array="12,4" />

      <g
        v-for="banner in ownedHexBanners"
        :key="'banner-' + banner.key"
        :transform="`translate(${banner.x}, ${banner.y}) scale(${ownedHexBannerScale})`"
        @click="SelectHexagon(banner.hex)"
        @mouseenter="bannerHighlight(banner)"
        @mouseleave="bannerUnhighlight(banner)">
        <g :class="OwnedBannerClass(banner)">
          <use :href="banner.href" />
        </g>
      </g>

      <AreaItems
        v-for="items in mapItems"
        :key="'items-' + items.key"
        :items="items"
        :hexagon-size="hexagonSize" />

      <text
        v-for="label in mapLabels"
        :key="label.key"
        :x="label.x"
        :y="label.y"
        :fill="label.fill"
        :class="label.class"
        :filter="label.filter">
        {{ label.text }}
      </text>
    </svg>
    <!-- {{ JSON.stringify(map) }} -->
  </div>
</template>

/**
 * The `Map` component is responsible for rendering the game map, including hexagonal tiles, owned banners, and various map items and labels.
 * It uses several child components to handle the rendering of specific elements, such as `Hexagon`, `BannerMasks`, `BannerSymbols`, and `AreaItems`.
 * The component also handles user interactions, such as zooming, panning, and selecting hexagons.
 * It uses the `ReportStore` to manage the state of the map and related data.
 */
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import BannerMasks from './BannerMasks.vue';
import Hexagon from './Hexagon.vue';
import BannerSymbols from './BannerSymbols.vue';
import AreaItems from './AreaItems.vue';
import { Corners, Center, AdjacentCoords, SameCoord } from '../libs/HexUtils';
import { useReportStore } from '@/stores/ReportStore';

const report = useReportStore();

const props = defineProps({
  hexagonSize: {
    type: Number,
    default: 32,
  },
  terrainColours: {
    type: Object,
    default: () => ({
      peak: 'dimgray',
      ocean: '#3D59AB',
      mountain: 'slategray',
      lowland: '#65b240',
      forest: '#316e44',
      desert: 'goldenrod',
      town: 'Sienna',
      city: 'Sienna',
      unknown: '#4c84d7',
    }),
  },
});

const ownedHexBannerScale = ref(1.6);
const mounted = ref(false);
const focusX = ref(0);
const focusY = ref(0);
const clientX = ref(null);
const clientY = ref(null);
const scales = [
  0.3, 0.4, 0.5, 0.63, 0.75, 0.85, 1, 1.2, 1.4, 1.6, 1.8, 2, 2.4, 2.8, 3.2, 3.8,
  4.4, 5, 5.8, 6.6, 7.4, 8.4, 9.4, 10.4, 13,
];
const scaleIndex = ref(10);
const mouseDown = ref(false);
const scrollSpeed = 5;
const hoveredBanner = ref(null);
const clientHeight = ref(0);
const clientWidth = ref(0);

onMounted(() => {
  mounted.value = true;
  clientWidth.value = document.querySelector('.map').clientWidth;
  clientHeight.value = document.querySelector('.map').clientHeight;
  const resizeObserver = new ResizeObserver(() => {
    clientWidth.value = document.querySelector('.map').clientWidth;
    clientHeight.value = document.querySelector('.map').clientHeight;
  });
  resizeObserver.observe(document.querySelector('.map'));
});

onBeforeUnmount(() => {
  mounted.value = false;
  this.resizeObserver.unobserve(this.$el);
});

const wheel = (e) => {
  if (e.deltaY > 0 && scaleIndex.value > 0) {
    scaleIndex.value--;
  } else if (e.deltaY < 0 && scaleIndex.value < scales.length - 1) {
    scaleIndex.value++;
  }
};

const mousedown = (e) => {
  mouseDown.value = true;
  clientX.value = e.clientX;
  clientY.value = e.clientY;
};

const mouseup = () => {
  mouseDown.value = false;
  clientX.value = null;
  clientY.value = null;
};

const mousemove = (e) => {
  if (mouseDown.value && clientX.value && clientY.value) {
    let scale = scales[scaleIndex.value];

    focusX.value += Math.round(
      ((clientX.value - e.clientX) * scrollSpeed) / scale,
    );
    focusY.value += Math.round(
      ((clientY.value - e.clientY) * scrollSpeed) / scale,
    );

    clientX.value = e.clientX;
    clientY.value = e.clientY;
  }
};

const hexHighlight = (hex) => {
  report.HighlightHex(hex);
};

const hexUnhighlight = () => {
  report.HighlightHex(null);
};

const bannerHighlight = (banner) => {
  report.HighlightBanner(banner);
};

const bannerUnhighlight = () => {
  report.HighlightBanner(null);
};

const SelectHexagon = (hex) => {
  report.SelectHex(hex);
};

const OwnedBannerClass = (banner) => {
  let classes = ['owned-banner'];
  if (
    report.selectedHex &&
    report.selectedHex.x == banner.hex.x &&
    report.selectedHex.y == banner.hex.y
  ) {
    classes.push('owned-banner-selected');
  } else if (
    report.highlightedHex &&
    report.highlightedHex.x == banner.hex.x &&
    report.highlightedHex.y == banner.hex.y
  ) {
    classes.push('owned-banner-hover');
  } else if (hoveredBanner.value?.key == banner.key) {
    classes.push('owned-banner-hover');
  }
  return classes.join(' ');
};

const mapBounds = computed(() => getMapBounds());

const viewBox = computed(() => {
  if (!mounted.value) return '0 0 0 0';

  let scale = scales[scaleIndex.value];
  let ratio = clientWidth.value / clientHeight.value;

  let centerX =
    mapBounds.value.min.x +
    Math.round((mapBounds.value.max.x - mapBounds.value.min.x) / 2);
  let centerY =
    mapBounds.value.min.y +
    Math.round((mapBounds.value.max.y - mapBounds.value.min.y) / 2);
  let displayWidth = Math.round(
    ((mapBounds.value.max.x - mapBounds.value.min.x) / scale) * ratio,
  );
  let displayHeight = Math.round(
    (mapBounds.value.max.y - mapBounds.value.min.y) / scale,
  );
  let displayX = centerX - Math.round(displayWidth / 2);
  let displayY = centerY - Math.round(displayHeight / 2);
  displayX = displayX + focusX.value;
  displayY = displayY + focusY.value;

  if (displayWidth > displayHeight) displayHeight = displayWidth;
  if (displayHeight > displayWidth) displayWidth = displayHeight;

  if (
    displayX == Infinity ||
    displayX == -Infinity ||
    displayY == Infinity ||
    displayY == -Infinity
  ) {
    return '0 0 0 0';
  }

  return `${displayX} ${displayY} ${displayWidth * ratio} ${displayHeight}`;
});

const mapHexagons = computed(() =>
  Object.values(report.Map).map((hex) => GetMapHexFromArea(hex)),
);

const ownedHexBanners = computed(() =>
  Object.values(report.Map)
    .filter((area) => area.owner)
    .map((area) => GetMapBannerFromArea(area)),
);

const mapItems = computed(() =>
  Object.values(report.Map)
    .filter((area) => Object.keys(area.agents).length > 0)
    .map((area) => GetMapItemsFromArea(area)),
);

const mapLabels = computed(() => {
  return mapSettlements.value.map((hex) => {
    const center = Center(hex.x, hex.y, props.hexagonSize, 0, 0);
    const points = Corners(center.x, center.y, props.hexagonSize);

    let xOffset = 0;
    let yOffset = 0;
    if (hex.owner) {
      xOffset = props.hexagonSize / 2;
      yOffset = props.hexagonSize / 10;
    }

    const labelData = {
      x: points[0].x + xOffset,
      y: points[0].y + yOffset,
      key: `${hex.x},${hex.y}`,
      text: hex.name,
      fill: '#000000',
      class: `label label-${hex.terrain}`,
      filter: hex.report_level == 0 ? `url('#desaturate')` : '',
    };

    if (hex.owner == report.Me) {
      labelData.class = `label label-${hex.terrain} label-me`;
    }

    return labelData;
  });
});

const mapSettlements = computed(() => {
  return Object.values(report.Map).filter((hex) =>
    ['city', 'town'].includes(hex.terrain),
  );
});

const mapBorders = computed(() => {
  return mapSettlements.value.map((settlement) => {
    let stroke = '#000';

    // find all edges of this province
    let edgePointPairs = [];
    settlement.borders.forEach((border) => {
      stroke = '#000';

      // check adjacent in each direction and add points for that
      // edge of it is not
      let adjacent = AdjacentCoords(border);

      adjacent.forEach((neighbour, index) => {
        let neighbourHex = GetMapHexFromCoord(neighbour);

        if (
          neighbourHex &&
          !SameCoord(neighbourHex, settlement) &&
          !SameCoord(neighbourHex.area.province, settlement)
        ) {
          let p1 = neighbourHex.points[(index + 3) % 6];
          let p2 = neighbourHex.points[(index + 4) % 6];
          edgePointPairs.push([p1, p2]);
        }
      });
    });
    let path = '';
    edgePointPairs.forEach((edgePointPair) => {
      path += ` M ${edgePointPair[0].x},${edgePointPair[0].y} L ${edgePointPair[1].x},${edgePointPair[1].y}`;
    });

    return {
      key: `border-${settlement.name}`,
      path: path,
      stroke: stroke,
      filter: settlement.report_level == 0 ? `url('#desaturate')` : '',
    };
  });
});


const getMapBounds = () => {
  let min = { x: Infinity, y: Infinity };
  let max = { x: 0, y: 0 };
  mapHexagons.value.forEach((hex) => {
    if (hex.min.x < min.x) min.x = Math.floor(hex.min.x);
    if (hex.min.y < min.y) min.y = Math.floor(hex.min.y);
    if (hex.max.x > max.x) max.x = Math.ceil(hex.max.x);
    if (hex.max.y > max.y) max.y = Math.ceil(hex.max.y);
  });

  return { min, max };
};

const selectedHex = computed(() => {
  if (report.selectedHex) {
    return GetMapHexFromArea(report.selectedHex);
  }
  return null;
});
const hoveredHex = computed(() => {
  if (report.highlightedHex) {
    return GetMapHexFromArea(report.highlightedHex);
  }
  return null;
});

const GetMapHexFromArea = (hex) => {
  const center = Center(hex.x, hex.y, props.hexagonSize, 0, 0);
  const points = Corners(center.x, center.y, props.hexagonSize);

  return {
    x: hex.x,
    y: hex.y,
    key: `${hex.x},${hex.y}`,
    terrain: hex.terrain,
    points: points,
    center: center,
    min: { x: points[5].x, y: points[0].y },
    max: { x: points[1].x, y: points[3].y },
    fill: props.terrainColours[hex.terrain],
    stroke: '#00000099',
    area: hex,
    desaturate: hex.terrain != 'ocean' && hex.report_level == 0,
  };
};

const GetMapHexFromCoord = (coord) => {
  if (report.Map[`${coord.x},${coord.y}`]) {
    return GetMapHexFromArea(report.Map[`${coord.x},${coord.y}`]);
  }
  return null;
};

const GetMapBannerFromArea = (area) => {
  if (!area.owner) return null;
  const center = Center(area.x, area.y, props.hexagonSize, 0, 0);

  const xOffset = 1.6 * 8.0;
  const yOffset = props.hexagonSize / 3 + 1.6 * 32.0;

  return {
    x: center.x - xOffset,
    y: center.y - yOffset,
    key: `${area.x},${area.y}`,
    center: center,
    area: area,
    href: `#banner-${area.owner}`,
    hex: area,
  };
};

const GetMapItemsFromArea = (area) => {
  const center = Center(area.x, area.y, props.hexagonSize, 0, 0);

  return {
    x: center.x,
    y: center.y,
    key: `${area.x},${area.y}`,
    center: center,
    area: area,
  };
};

</script>

<style scoped>
.map {
  /* width: calc(100vh - 60px);
    height: calc(100vh - 60px); */
  position: relative;
  overflow: hidden;
  max-width: 100%;
  max-height: 100%;
}
svg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: inherit;
  width: inherit;
  max-width: 100%;
  max-height: 100%;
  /* border: 4px solid black; */
  /* background-color: var(--color-background);         */
}
text.label {
  font-size: 38px;
  font-weight: bold;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.8);
  user-select: none;
  pointer-events: none;
}
.parchment {
  z-index: unset;
}
.owned-banner {
  transform-origin: 8px 35px;
  scale: 1;
  transition: scale 100ms ease-in-out;
}
.owned-banner-hover {
  scale: 1.2;
}
.owned-banner-selected {
  scale: 1.4;
}
</style>
