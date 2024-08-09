import { defineStore } from 'pinia';
import { Colors1, Colors2 } from '@/libs/BannerColors';
import { Coord } from '@/libs/HexUtils';

export const useReportStore = defineStore('report', {
  state: () => ({
    report: null,
    orders: {},
    selectedHex: null,
    highlightedHex: null,
    highlightedBanner: null,
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
    TradePolicy: (state) => {
      return (hex, resource) => {
        const coord = Coord(hex.x, hex.y);
        if (state.orders[coord] && state.orders[coord]['set_trade_policy']) {
            return state.orders[coord]['set_trade_policy'][resource];
        }
        return hex.trade_policy[resource];
      };
    },
    Orders: (state) => {
      const orders = [];
      // TODO: add orders
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
    AddAgentOrder(order) {
      console.log("TODO: add agent order", order);      
    },
    AddArmyOrder(order) {
      console.log("TODO: add army order", order);
    },
    AddHexOrder(coord, order, data) {
      if (!this.orders[coord]) this.orders[coord] = {};
      this.orders[coord][order] = data;
      localStorage.setItem('orders', JSON.stringify(this.orders));
    },
    SaveReport() {
      localStorage.setItem('report', JSON.stringify(this.report));
    },
  },
});
