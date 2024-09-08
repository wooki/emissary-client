import { defineStore } from 'pinia';
import { Colors1, Colors2 } from '@/libs/BannerColors';
import { Coord } from '@/libs/HexUtils';
import { TradePolicies } from './data/TradePolicies';
import { toRaw } from 'vue';

export const useReportStore = defineStore('report', {
  state: () => ({
    report: null,
    orders: new Object(),
    selectedHex: null,
    highlightedBanner: null,
    tradePolicyOptions: TradePolicies,
    activeSummaryPanel: '',
  }),
  getters: {
    isLoaded: (state) => state.report !== null,
    Kingdoms: (state) => state.report.kingdoms,
    MyKingdom: (state) => state.report.my_kingdom,
    Me: (state) => state.report.my_kingdom.player,
    Turn: (state) => state.report.turn,
    MyBanner: (state) => state.report.my_kingdom.flag,
    Color1: (state) => {
      let flag = state.report.my_kingdom.flag.split('');
      if (flag[0] == 1) return Colors1[parseInt(flag[2])];
      return Colors1[parseInt(flag[3])];
    },
    Color2: (state) => {
      let flag = state.report.my_kingdom.flag.split('');
      if (flag[0] == 1) return Colors2[parseInt(flag[3])];
      return Colors2[parseInt(flag[4])];
    },
    Map: (state) => state.report.map,
    ExistingHexOrder: (state) => {
      return (hex, orderType) => {
        const coord = Coord(hex.x, hex.y);
        if (state.orders[coord] && state.orders[coord][orderType]) {
          return state.orders[coord][orderType];
        }
        return null;
      };
    },
    ExistingTradePolicy: (state) => {
      return (hex, resource) => {
        const orderValue = state.ExistingHexOrder(hex, 'set_trade_policy');
        return orderValue !== null ? orderValue[resource] : hex.trade_policy[resource];
      };
    },
    ExistingHireAgent: (state) => {
      return (hex) => {
        const orderValue = state.ExistingHexOrder(hex, 'hire_agent');
        return orderValue !== null ? orderValue.hire : false;
      };
    },
    ExistingAgentOrder: (state) => {
      return (hex, agentid, order) => {
        const coord = Coord(hex.x, hex.y);
         
        if (state.orders[coord] && state.orders[coord][agentid][order]) {
          return state.orders[coord][agentid][order];
        }
        
        return hex?.agents[agentid];
      };
    },
    Orders: (state) => {
      console.log('orders', state.orders);
      const orders = [];
      Object.keys(state.orders).forEach((areaKey) => {
        Object.keys(state.orders[areaKey]).forEach((orderKey) => {
          let order = {
            coord: areaKey,
            order: orderKey,
          };
          Object.keys(state.orders[areaKey][orderKey]).forEach(
            (orderParamKey) => {
              order[orderParamKey] =
                state.orders[areaKey][orderKey][orderParamKey];
            },
          );
          orders.push(order);
        });
      });
      console.log('orders=>', orders);
      return {
        player: state.Me,
        turn: state.Turn,
        orders: orders,
      };
    },
    Kingdom(state) {
      return (name) => {
        return state.Kingdoms[name];
      };
    },
  },
  actions: {
    SetActiveSummaryPanel(value) {
      this.activeSummaryPanel = value;
    },
    SetReport(data) {
      this.report = data;
    },
    SetOrders(orders) {
      this.orders = orders;
    },
    LoadReport() {
      let report = localStorage.getItem('report');
      if (report) {
        this.SetReport(JSON.parse(report));
        this.LoadOrders();
      }
    },
    LoadOrders() {
      let orders = localStorage.getItem('orders');
      if (orders) {
        this.SetOrders(JSON.parse(orders));
      }
    },
    ClearOrders() {
      this.orders = [];
    },
    SelectHex(hex) {
      if (hex.area) {
        this.SelectArea(hex.area);
      } else {
        this.selectedHex = hex;
      }
      this.SetActiveSummaryPanel('');
    },
    HighlightHex(hex) {
      this.highlightedHex = hex;
    },
    HighlightBanner(banner) {
      this.highlightedBanner = banner;
    },
    SelectArea(area) {
      const hex = this.Map[Coord(area.x, area.y)];
      this.SelectHex(hex);
    },
    AddAgentOrder(coord, agentid, order, data) {
      if (!this.orders[coord]) this.orders[coord] = new Object();
      if (!this.orders[coord][agentid]) this.orders[coord][agentid] = new Object();
      this.orders[coord][agentid][order] = data;            
      localStorage.setItem('orders', JSON.stringify(Object.assign({}, toRaw(this.orders))));
    },
    AddArmyOrder(coord, order, data) {
      console.log('TODO: add army order', coord, order, data);
    },
    AddHexOrder(coord, order, data) {
      if (!this.orders[coord]) this.orders[coord] = new Object();
      this.orders[coord][order] = data;
      localStorage.setItem('orders', JSON.stringify(Object.assign({}, toRaw(this.orders))));
    },
    SaveReport() {
      localStorage.setItem('report', JSON.stringify(Object.assign({}, toRaw(this.report))));
    },
  },
});
