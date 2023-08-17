// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Size = cc.Size;

const { ccclass } = cc._decorator;

@ccclass
export default class AutoCanvasSizeComp extends cc.Component {
  private readonly defaultRatio: number = 16 / 9;
  private readonly defaultRatioMax: number = 13 / 6;
  private readonly defaultRatioMin: number = 4 / 3;
  private startSize: cc.Size = new cc.Size(1280, 720);

  onLoad() {
    let canvas = this.getComponent(cc.Canvas);
    this.startSize = canvas.designResolution;
    this.setFlexibleWebScreen();
    cc.view.setResizeCallback(() => {
      if (this && this.node) this.setFlexibleWebScreen();
    });
  }

  protected onDestroy() {
    if (this.isWebBuild()) {
      cc.view.setResizeCallback(null);
    }
    this.unscheduleAllCallbacks();
  }

  private setFlexibleWebScreen() {
    let size = cc.view.getFrameSize();
    let w = size.width;
    let h = size.height;
    let ratio = w / h;
    let fitHeight = ratio > this.defaultRatio;
    let max = false;
    if (ratio > this.defaultRatioMax) {
      ratio = this.defaultRatioMax;
      max = true;
    }

    let min = false;
    if (ratio < this.defaultRatioMin) {
      ratio = this.defaultRatioMin;
      min = true;
    }

    let canvas = this.getComponent(cc.Canvas);
    canvas.fitWidth = !fitHeight;
    canvas.fitHeight = fitHeight;

    if (fitHeight) {
      if (this.isWebBuild() && max) {
        canvas.designResolution = new Size(this.startSize.height * this.defaultRatioMax, this.startSize.height);
        canvas.fitWidth = true;
        canvas.fitHeight = true;
      } else {
        canvas.designResolution = new Size(this.startSize.width, this.startSize.height);
      }
    } else {
      if (this.isWebBuild() && min) {
        canvas.designResolution = new Size(this.startSize.width, this.startSize.width / this.defaultRatioMin);
        canvas.fitWidth = true;
        canvas.fitHeight = true;
      } else {
        canvas.designResolution = new Size(this.startSize.width, this.startSize.height);
      }
    }

    this.scheduleOnce(() => {
      //cc.systemEvent.emit(EventKey.ON_SCREEN_CHANGE_SIZE_EVENT)
    }, 1 / 60);
  }

  private isWebBuild() {
    return (cc.sys.platform == cc.sys.DESKTOP_BROWSER || cc.sys.platform == cc.sys.MOBILE_BROWSER) && CC_BUILD;
  }
}
