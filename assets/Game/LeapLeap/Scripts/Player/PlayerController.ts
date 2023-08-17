import Platform from "../Platforms/Platform";
import PlatformsGenerator from "../PlatformsGenerator/PlatformsGenerator";
import PlayerAnim from "./PlayerAnim";
import PlayerCheckPosition from "./PlayerCheckPosition";

const { ccclass, property } = cc._decorator;

const Touch: string = "Touch";
const TouchInputPath = "ScreenGame/TouchInput";
const CamPath = "ScreenGame/Main Camera";

enum PlayerState {
  Normal,
  Fall,
  Boost,
}

@ccclass
export default class PlayerControl extends cc.Component {
  @property(cc.Integer)
  MoveIndex = 3;

  firstIdx: number = 0;

  @property(cc.Node)
  InputSignal: cc.Node = null;

  @property(cc.Node)
  PlatformGen: cc.Node = null;

  @property(cc.Node)
  Camera: cc.Node = null;
  @property(cc.Boolean)
  CameraAnim: boolean = false;
  CamPosX: number = 0;
  CamPosY: number = 0;
  isZoom = true;

  private firstTouch = false;
  private _totalIdx: number = 0;
  private startPosX: number = 0;
  private PosY: number = 0;
  private distPerJump: number = 0;

  private _startJump: boolean = false;
  private _jumpTime: number = 1;
  private _curPos: cc.Vec2 = cc.Vec2.ZERO;
  private _targetPos: cc.Vec2 = cc.Vec2.ZERO;
  private _isMoving = false;
  public isActive = false;

  curState: number = PlayerState.Normal;

  isBegin = false;
  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.firstIdx = this.MoveIndex;
  }

  start() {
    if (!this.InputSignal) this.InputSignal = cc.find(TouchInputPath);

    if (!this.PlatformGen) this.PlatformGen = cc.find("Platforms");

    if (!this.Camera) this.Camera = cc.find(CamPath);
    this.MoveIndex = this.firstIdx;
    //this.setInputActive(false);
  }

  setInputActive(active: boolean, curState: number = PlayerState.Normal) {
    this.isActive = active;
    if (active) {
      this.InputSignal?.on(Touch, this.MoveCommand, this);
      this.node.getComponent(cc.BoxCollider).enabled = true;
      this.node.getComponent(PlayerCheckPosition).isHit = false;
      if (!this.firstTouch) {
        this.firstTouch = true;
        this.curState = PlayerState.Normal;
      }
    } else {
      this.InputSignal?.off(Touch, this.MoveCommand, this);
      this.curState = curState;
      //this.PlatformGen.getComponent(PlatformsGenerator).SetState(curState);
    }
  }

  setParameter() {
    this._totalIdx = this.PlatformGen.getComponent(PlatformsGenerator).TotalIdx;
    this.startPosX =
      this.PlatformGen.getComponent(PlatformsGenerator).StartWidth;
    this.PosY =
      this.PlatformGen.getComponent(PlatformsGenerator).StartHeight +
      this.node.getContentSize().height * 0.75;
    this.distPerJump =
      this.PlatformGen.getComponent(PlatformsGenerator).DistPerPat;
    this._jumpTime = this.PlatformGen.getComponent(PlatformsGenerator).MoveTime;

    // cc.warn("Check total idx " + this._totalIdx);
    // cc.warn("Check start X " + this.startPosX);
    // cc.warn("Check Y " + this.PosY);
    // cc.warn("Check distance per jump " + this.distPerJump);
    // cc.warn("Check Time to jump " + this._jumpTime);
    this.node.setPosition(
      this.startPosX + this.distPerJump * this.firstIdx,
      this.PosY
    ); //TODO fix x
  }

  ResetPosition(isPlayCameraAnim: boolean = this.CameraAnim) {
    let pos = cc.v3(
      this.startPosX + this.distPerJump * this.firstIdx,
      this.PosY,
      0
    );
    cc.tween(this.node)
      .to(0.25, {
        position: pos,
      })
      .call(() => {
        this.node.getComponent(PlayerAnim).PlayAnimLanding();
        this.scheduleOnce(() => {
          this.node.getComponent(PlayerAnim).PlayAnimIdle("Idle_L");
          this.setInputActive(true);
        }, 0.5);
      })
      .start();
  }

  MoveCommand(isRight: boolean) {
    if (isRight) {
      this.jumpByStep(1);
    } else {
      this.jumpByStep(-1);
    }
  }

  jumpByStep(step: number) {
    if (this._isMoving) {
      return;
    }
    if (this.MoveIndex == 0 && step < 0) {
      return;
    }
    if (this.MoveIndex == this._totalIdx - 1 && step > 0) {
      return;
    }
    if (!this.isBegin) {
      this.isBegin = true;
      this.node.emit("BeginPlay");
    }

    this._startJump = true;

    this.node.getPosition(this._curPos);
    cc.Vec2.add(
      this._targetPos,
      this._curPos,
      new cc.Vec2(this.distPerJump * step, 0)
    );
    cc.tween(this.node)
      .to(this._jumpTime, {
        x: this._targetPos.x,
      })
      .call(() => {
        this.node.setPosition(this._targetPos);
        this._startJump = false;
        this.onOnceJumpEnd();
      })
      .start();

    cc.tween(this.node)
      .to(this._jumpTime / 2, {
        y: this.PosY + 100,
      })
      .call(() => {
        cc.tween(this.node)
          .to(this._jumpTime / 2, {
            y: this.PosY,
          })
          .start();
      })
      .start();

    this.node.getComponent(PlayerAnim).PlayAnimJump(step == 1);

    this.MoveIndex += step;

    this._isMoving = true;
    this.node.emit("JumpStart", step == 1);
  }

  onOnceJumpEnd() {
    this._isMoving = false;
    //cc.warn("CHECK CURRENT IDX " + this.MoveIndex);
    this.node.getComponent(PlayerAnim).PlayAnimIdle();
    this.node.emit("JumpEnd", this.MoveIndex);
  }

  // update (deltaTime: number)
  // {

  // }
}
