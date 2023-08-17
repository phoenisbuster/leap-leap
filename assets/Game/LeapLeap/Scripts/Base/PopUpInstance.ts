// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class PopUpInstance extends cc.Component {
    @property(cc.Widget)
    background: cc.Widget = null;
    @property(cc.Node)
    panel: cc.Node = null;
    @property
    normalPanelSize: number = 1;
    @property
    scaleWhenOpenAndClosePanelSize: number = 1.05;
  
    _animation: cc.Animation;
    _open = false;
    _data;
  
    _onYes: () => void;
    _onNo: () => void;
    _close: () => void;
  
    onDestroy() {
      this.unscheduleAllCallbacks();
    }
  
    onLoad() {
      if (!this.background) this.background = this.node.getChildByName("darkBackground")?.getComponent(cc.Widget);
      if (this.background) {
        this.background.isAlignLeft = true;
        this.background.isAbsoluteRight = true;
        this.background.isAbsoluteTop = true;
        this.background.isAlignBottom = true;
        this.background.left = -500;
        this.background.top = -500;
        this.background.bottom = -500;
        this.background.right = -500;
        this.background.target = cc.director.getScene().getChildByName("Canvas");
      }
      this._animation = this.getComponent(cc.Animation);
      this.node.active = false;
    }
    showPopup() {
      if (this.panel != null) {
        this.panel.scale = 0;
        this.panel.opacity = 0;
        this.node.active = true;
        cc.Tween.stopAllByTarget(this.panel);
        cc.tween(this.panel)
          .to(
            0,
            { scale: 0, opacity: 0 }
          )
          .to(
            0.2,
            { scale: this.normalPanelSize * this.scaleWhenOpenAndClosePanelSize, opacity: 255 }
          )
          .to(
            0.1,
            { scale: this.normalPanelSize }
          )
          .call(() => {
            this.showDone();
          }).start();
  
      } else {
        this.node.active = true;
        if (this._animation != null) {
          this._animation.stop();
          this._animation.play("Show");
        } else {
          this.showDone();
        }
  
      }
    }
    hidePopup() {
      if (this.panel != null) {
        cc.Tween.stopAllByTarget(this.panel);
        cc.tween(this.panel)
          .to(
            0.2,
            { scale: this.normalPanelSize * this.scaleWhenOpenAndClosePanelSize, opacity: 0 }
  
          ).call(() => {
            this.node.active = false;
            this.closeDone();
          }).start();
      } else {
        if (this._animation != null) {
          this._animation.stop();
          this._animation.play("Hide");
        } else {
          this.closeDone();
        }
      }
    }
  
    public open(data, onYes: () => void = null, onNo: () => void = null) {
      this.beforeShow();
      this._open = true;
      this.showPopup();
      this._data = data;
      this._onYes = onYes;
      this._onNo = onNo;
      this.onShow(data);
    }
  
    public closeInstance() {
      if (!this._open) return;
      this._open = false;
      if (this._close) this._close();
      this.beforeClose();
      this.hidePopup();
  
    }
  
    protected close() {
      this._open = false;
      if (this._close) this._close();
      this.beforeClose();
      this.hidePopup();
    }
  
    public onYes() {
      if (this._onYes) {
        this._onYes();
      }
      this.close();
    }
  
    public onNo() {
      if (this._onNo) {
        this._onNo();
      }
      this.close();
    }
  
    //#region Call From Animation Event
    public showDone() {
      this.afterShow();
    }
  
    public closeDone() {
      if (this._open == false) {
        this.node.active = false;
        this.afterClose();
      }
    }
  
    //#endregion
  
    protected onShow(data) { }
  
    protected afterShow() { }
  
    protected beforeShow() { }
  
    protected beforeClose() { }
  
    protected afterClose() { }
}
