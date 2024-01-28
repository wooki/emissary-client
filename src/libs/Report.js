import { Colors1, Colors2, Colors3 } from "@/libs/BannerColors";

export default function Report(data) {
  this.data = data;
  this.turn = data.turn;
  this.map = data.map;
  this.my_kingdom = data.my_kingdom;
  this.kingdoms = data.kingdoms;

  this.MyKingdom = () => {
    return this.my_kingdom.name;
  };
  this.Me = () => {
    return this.my_kingdom.player;
  };
  this.MyBanner = () => {
    return this.my_kingdom.flag;
  };
  this.Color1 = () => {
    let flag = this.my_kingdom.flag.split("");
    if (flag[0] == 1) return Colors1[parseInt(flag[2])];
    return Colors1[parseInt(flag[3])];
  };
  this.Color2 = () => {
    let flag = this.my_kingdom.flag.split("");
    if (flag[0] == 1) return Colors1[parseInt(flag[3])];
    return Colors1[parseInt(flag[4])];
  };
  this.CreateOrders = () => {
    // iterate all areas and add orders for owned settlements and units
    let orders = [];
    Object.keys(this.map).forEach(coord => {
      const hex = this.map[coord];      
      if (hex.owner == this.Me()) {
        orders.push({
          order: "trade_policy",
          coord: coord,
          data: hex.trade_policy
        });        
      }
    });

    console.log("orders");
    console.dir(orders);
    return JSON.stringify(orders);
  };
}
