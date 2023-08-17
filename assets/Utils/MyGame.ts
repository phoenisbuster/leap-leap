// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BundleManager from "./BundleManager";
import ConnectDefine from "./ConnectDefine";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MyGame extends cc.Component {
  start() {
    ConnectDefine.loadConfigJSON(() => {
      BundleManager.getInstance().loadConfigGame();
    });
  }
}
