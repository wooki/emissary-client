import { defineStore } from 'pinia';
import { Colors1, Colors2 } from '@/libs/BannerColors';

export const useReportStore = defineStore('report', {
  state: () => ({
    turn: null,
    report: null,
    orders: [],
    selectedHex: null,
    highlightedHex: null,
    highlightedBanner: null
  }),
  getters: {
    isLoaded: (state) => state.report !== null,
    Kingdoms: (state) => state.report.kingdoms,
    MyKingdom: (state) => state.report.my_kingdom,
    Me: (state) => state.report.my_kingdom.player,
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
  },
  actions: {
    CurrentTradePolicy(hex, resource) {
      // TODO: check if there is an order for this
      return hex.trade_policy[resource];
    },
    SetReport(data) {
      this.report = data;
      this.turn = data.turn;
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
      const hex = this.Map[`${area.x},${area.y}`];
      this.SelectHex(hex);
    },
    AddOrder(order) {
      console.log('TODO: add order to game state', order);
      this.orders.push(order);
      localStorage.setItem('orders', JSON.stringify(this.orders));
    },
    SaveReport() {
      localStorage.setItem('report', JSON.stringify(this.report));
    },
    GetKingdom(name) {
      return this.Kingdoms[name];
    },
  },
});
