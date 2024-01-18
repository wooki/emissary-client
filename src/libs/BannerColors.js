import { Colors1, Colors2 } from "./BannerColors.js";

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
    console.log("flag", flag);
    if (flag[0] == 2) return Colors1[parseInt(flag[3])];
    return Colors2[parseInt(flag[2])];
  };
  this.Color2 = () => {
    let flag = this.my_kingdom.flag.split("");
    if (flag[0] == 2) return Colors1[parseInt(flag[4])];
    return Colors2[parseInt(flag[3])];
  };
}
