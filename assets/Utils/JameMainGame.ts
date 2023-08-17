const { ccclass, property } = cc._decorator;

@ccclass
export default class JameMainGame extends cc.Component {
  @property(cc.Node)
  currentGame: cc.Node = null;

  @property(cc.Node)
  myGame: cc.Node = null;

  onLoad() {
    cc.systemEvent.on("Load_Game_Current", () => {
      this.currentGame.active = true;
    });
  }

  private limitTime: number = 0;

  start() {
    let time = Date.now();
    cc.log("time " + time);
    if (time > this.limitTime) {
      this.myGame.active = true;
    } else {
      cc.systemEvent.emit("Load_Game_Current");
    }
  }

  // update (dt) {}
}
