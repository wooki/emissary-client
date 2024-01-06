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


};