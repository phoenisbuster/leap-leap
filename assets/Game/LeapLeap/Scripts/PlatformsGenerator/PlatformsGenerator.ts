import { Item } from "../../LearningMaterials/Learning/Learning/DropDown/Item";
import LevelData from "../LevelDesign/LevelData";
import Platform from "../Platforms/Platform";
import PlayerControl from "../Player/PlayerController";

const { ccclass, property } = cc._decorator;

const CanvasName: string = "ScreenGame";
const TouchInputName: string = "ScreenGame/TouchInput";
const Touch: string = "Touch";

enum PlatformType {
  PT_NONE,
  PT_NORMAL,
  PT_FAKE,
  PT_SPECIAL,
}

enum PlatState {
  STATE_Nor,
  STATE_Fall,
  STATE_FLY,
}

@ccclass
export default class PlatformsGenerator extends cc.Component {
  @property(cc.Node)
  Player: cc.Node = null;

  @property(cc.Prefab)
  ClockPrefab: cc.Prefab = null;

  @property([cc.Prefab])
  PlatformList: cc.Prefab[] = [];

  @property(cc.Integer)
  FirstIdx: number = 3;

  Plat_Nor: cc.Prefab = null;
  Plat_Fake: cc.Prefab = null;
  Plat_Spe: cc.Prefab[] = [];

  @property(cc.Integer)
  MaximumRow: number = 3;

  @property(cc.Integer)
  MaximumPlatsPerRow: number = 4;

  @property(cc.Boolean)
  StartOddIdx: boolean = false;

  @property(cc.Boolean)
  AutoSetWidth: boolean = true;

  @property(cc.Float)
  WidthOfPlat: number = 250;

  @property({
    type: cc.Float,
    tooltip: "Percented unit, base on the screen width",
  })
  BoundWdith: number = 15;

  @property(cc.Boolean)
  AutoBalanceHeight: boolean = true;

  @property(cc.Float)
  StartHeight: number = 250;
  @property(cc.Float)
  DisBetRows: number = 250;

  TotalIdx: number = 0;

  StartWidth: number = 0;
  EndWidth: number = 0;

  DistPerRow: number = 0;
  @property(cc.Float)
  DistPerPat: number = 0;

  botPos: number = 0;
  topPos: number = 0;
  newGenPos: number = 0;

  Canvas: cc.Node = null;
  screenWidth: number = 0;
  screenHeight: number = 0;

  TouchRegion: cc.Node = null;

  firstTouch: boolean = false;
  canMove = true;

  @property(cc.Float)
  MoveTime: number = 0.3;

  norIdx: number[] = [];

  childrenPlatfrom: cc.Node[][] = [];
  invisiblePlatfrom: cc.Node[] = [];
  CurIdx = 0;
  CurOddIdx = true;
  isFinishPlat = false;
  playerIDX = 0;
  allowSpawnClock = false;
  ClockIdx = 0;

  curState: number = PlatState.STATE_Nor;
  @property(cc.Float)
  fallSpeed: number = 10;
  @property(cc.Float)
  flySpeed: number = 10;
  @property(cc.Float)
  flyTime: number = 5;
  curFlyTime = 0;

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    if (!this.Canvas) {
      this.Canvas = cc.find(CanvasName);
    }
    if (!this.Player) {
      this.Canvas = cc.find("Player");
    }
    if (!this.TouchRegion) {
      this.TouchRegion = cc.find(TouchInputName);
    }
    if (LevelData.usedPlat) {
      this.MaximumRow = LevelData.MaximumRow;
      this.MaximumPlatsPerRow = LevelData.MaximumPlatsPerRow;
      this.AutoSetWidth = true;
      this.AutoBalanceHeight = true;
    }
    this.playerIDX = this.FirstIdx;
    this.MoveTime = LevelData.TimeScale;
  }

  public SetPlatForms() {
    if (this.PlatformList.length <= 0) {
      cc.error("There no platforms prefabs!!!");
      return;
    }
    this.PlatformList.forEach((ele) => {
      switch (ele.data.getComponent(Platform).Tag) {
        case PlatformType.PT_NORMAL:
          this.Plat_Nor = ele;
          break;
        case PlatformType.PT_FAKE:
          this.Plat_Fake = ele;
          break;
        case PlatformType.PT_SPECIAL:
          this.Plat_Spe.push(ele);
          break;
        default:
          break;
      }
    });
  }

  public SetBotTopGenPos() {
    this.screenWidth = this.Canvas.getContentSize().width;
    this.screenHeight = this.Canvas.getContentSize().height;

    this.botPos = -25;
    this.topPos = this.screenHeight + 25;
    this.newGenPos = this.topPos / 1 + 25;

    // cc.warn("Check screen width " + this.screenWidth);
    // cc.warn("Check screen height " + this.screenHeight);
    // cc.warn("Check Bot " + this.botPos);
    // cc.warn("Check Top " + this.topPos);
    // cc.warn("Check Gen Pos " + this.newGenPos);
  }

  public SetParameters() {
    this.TotalIdx = 2 * (this.MaximumPlatsPerRow / 1) - 1;
    //cc.warn("Tong Idx " + this.TotalIdx);
    let fullPlatformWidth = (this.screenWidth / 1) * (1 - (this.BoundWdith * 2) / 100);
    // cc.warn("Chieu rong cua toan bo platforms " + fullPlatformWidth);
    if (this.AutoSetWidth) {
      if (fullPlatformWidth >= 800) {
        this.WidthOfPlat = 300;
      } else {
        this.WidthOfPlat = fullPlatformWidth / this.MaximumPlatsPerRow - 50;
      }
    }
  
    //cc.warn("Chieu rong cua 1 platform " + this.WidthOfPlat);
    // this.StartWidth = (this.screenWidth / 1) * (this.BoundWdith / 100);
    let playerController = this.Player.getComponent(PlayerControl);
    this.StartWidth = this.screenWidth/2 - this.DistPerPat * playerController.firstIdx

    // this.StartWidth = (this.screenWidth - fullPlatformWidth)/2;
    this.EndWidth = this.screenWidth / 1 - this.StartWidth / 1;
    // cc.warn("Vi tri bat dau cho tung hang " + this.StartWidth);
    // cc.warn("Vi tri ket thuc cho tung hang " + this.EndWidth);

    // this.DistPerPat = (i/(this.MaximumPlatsPerRow - 1))/2; //TODO
    // console.warn("Khoang cah giua moi Plat ", this.DistPerPat);

    if (this.AutoBalanceHeight) {
      this.StartHeight = this.screenHeight / (this.MaximumRow / 1 + 1);
      this.DistPerRow =
        (this.screenHeight / 1 - this.StartHeight / 1) / (this.MaximumRow / 1);
    } else {
      this.DistPerRow = this.DisBetRows;
    }
    //cc.warn("Chieu cao cua hang dau tien " + this.StartHeight);
    //cc.warn("Khoang cach cua moi hang " + this.DistPerRow);
  }

  public InitPlatForm() {
    let i = 0;
    let j = 0;
    let startIdx = 1;
    if (this.StartOddIdx) {
      startIdx = 0;
      this.CurOddIdx = false;
    } else {
      this.CurOddIdx = true;
    }

    this.node.destroyAllChildren();
    this.childrenPlatfrom = [];
    this.invisiblePlatfrom = [];
    this.CurIdx = 0;
    this.norIdx = [];
    this.firstTouch = false;

    while (j < this.MaximumRow + 1) {
      let newNorIdx: number[] = [];
      let subsetofRow: cc.Node[] = [];
      while (i < this.TotalIdx) {
        let pos = new cc.Node();
        pos.parent = this.node;

        let x = this.StartWidth + i * this.DistPerPat;//TODO fix x
        
        let y =
          j < this.MaximumRow
            ? this.StartHeight + j * this.DistPerRow
            : this.topPos;

        pos.setPosition(cc.v2(x, y));

        if (j != 0 && i == startIdx) {
          startIdx = startIdx / 1 + 2;
          if (this.norIdx.includes(i)) {
            this.getPlatformByType(
              PlatformType.PT_NORMAL,
              pos,
              this.isFinishPlat
            );

            let rateFor2Plat = Math.random();
            let rateForLeft = Math.random();
            let idxModifier = rateForLeft < 0.5 ? -1 : 1;

            let leftidx =
              i / 1 + idxModifier / 1 >= 0 &&
              i / 1 + idxModifier / 1 < this.TotalIdx
                ? i / 1 + idxModifier / 1
                : -1;
            let rightidx =
              i / 1 - idxModifier / 1 >= 0 &&
              i / 1 - idxModifier / 1 < this.TotalIdx
                ? i / 1 - idxModifier / 1
                : -1;
            if (leftidx != -1) newNorIdx.push(leftidx);
            if ((rateFor2Plat < 0.25 || leftidx == -1) && rightidx != -1) {
              newNorIdx.push(rightidx);
            } else {
              newNorIdx.push[0];
              newNorIdx.push[this.TotalIdx - 1];
            }
          } else {
            this.getPlatformByType(
              PlatformType.PT_FAKE,
              pos,
              this.isFinishPlat
            );
          }
        } else if (j == 0 && i == this.FirstIdx) {
          this.getPlatformByType(
            PlatformType.PT_NORMAL,
            pos,
            this.isFinishPlat
          );

          this.norIdx.push(this.FirstIdx / 1 - 1);
          this.norIdx.push(this.FirstIdx / 1 + 1);
        }
        subsetofRow.push(pos);
        i++;
      }
      if (j != 0) {
        this.norIdx = [];
        this.norIdx = newNorIdx;
      }
      this.childrenPlatfrom.push(subsetofRow);
      j++;
      i = 0;
      startIdx = startIdx % 2 == 0 ? 1 : 0;
    }
  }

  public MoveBelow(isRight: boolean) {
    if (this.canMove) {
      this.canMove = false;
      let step = isRight ? 1 : -1;
      //cc.warn("PLAYER IDX " + this.playerIDX);
      this.playerIDX = this.playerIDX / 1 + step;
      //cc.warn("REAL PLAYER IDX " + this.Player.getComponent(PlayerControl).MoveIndex);
      this.ClockIdx = this.norIdx[0];
      let clockidList: number[] = [];
      this.norIdx.forEach((id) => {
        if (
          Math.abs(id - this.playerIDX) <
          Math.abs(this.ClockIdx - this.playerIDX)
        ) {
          this.ClockIdx = id;
        } else if (
          Math.abs(id - this.playerIDX) ==
          Math.abs(this.ClockIdx - this.playerIDX)
        ) {
          if (!clockidList.includes(id)) clockidList.push(id);
        }
      });
      if (clockidList.length > 1) {
        let i = clockidList[Math.floor(Math.random() * clockidList.length)];
        //this.ClockIdx = i <= this.ClockIdx? i : this.ClockIdx;
        this.ClockIdx = i;
      }
      //cc.warn("CLOCK IDX " + this.ClockIdx);

      for (let i = 0; i < this.node.childrenCount; i++) {
        if (this.node.children[i].getPosition().y <= this.StartHeight) {
          let x = this.node.children[i].getPosition().x;
          let y = this.botPos;

          cc.tween(this.node.children[i])
            .to(this.MoveTime, {
              position: cc.v3(x, y, 0),
            })
            .call(() => {
              this.node.children[i].setPosition(x, this.topPos);
              this.canMove = true;
              if (!this.firstTouch) {
                this.RandomPlatforms(this.CurIdx, this.CurOddIdx);
              }
            })
            .start();
        } else if (this.node.children[i].getPosition().y == this.newGenPos) {
          let x = this.node.children[i].getPosition().x;
          this.node.children[i].setPosition(x, this.topPos);
        } else if (this.node.children[i].getPosition().y == this.topPos) {
          let x = this.node.children[i].getPosition().x;
          let y =
            this.StartHeight / 1 +
            (this.MaximumRow / 1 - 1) * (this.DistPerRow / 1);

          cc.tween(this.node.children[i])
            .to(this.MoveTime, {
              position: cc.v3(x, y, 0),
            })
            .call(() => {
              this.canMove = true;
            })
            .start();
        } else if (
          this.node.children[i].getPosition().y ==
          this.StartHeight / 1 + this.DistPerRow / 1
        ) {
          let x = this.node.children[i].getPosition().x;
          let y = this.StartHeight;

          cc.tween(this.node.children[i])
            .to(this.MoveTime, {
              position: cc.v3(x, y, 0),
            })
            .call(() => {
              this.canMove = true;
            })
            .start();
        } else {
          let x = this.node.children[i].getPosition().x;
          let y =
            this.node.children[i].getPosition().y / 1 - this.DistPerRow / 1;

          cc.tween(this.node.children[i])
            .to(this.MoveTime, {
              position: cc.v3(x, y, 0),
            })
            .call(() => {
              this.canMove = true;
            })
            .start();
        }
      }
      if (this.firstTouch) {
        this.scheduleOnce(() => {
          this.RandomPlatforms(this.CurIdx, this.CurOddIdx);
        }, this.MoveTime);
      }
    } else {
      cc.log("CAN NOT MOVE");
    }
  }

  public AllPlatAppear() {
    this.isFinishPlat = true;
    this.invisiblePlatfrom.forEach((ele) => {
      cc.tween(ele)
        .to(this.MoveTime, {
          opacity: 255,
        })
        .start();
    });
  }

  public ResetFirstRow() {
    if (!this.firstTouch) {
      this.firstTouch = true;
      for (let i = 0; i < this.TotalIdx; i++) {
        if (i != this.FirstIdx && i % 2 == this.FirstIdx % 2) {
          this.getPlatformByType(PlatformType.PT_NORMAL, this.node.children[i]);
        } else if (i == this.FirstIdx) {
          this.node.children[i].children[0].opacity = 255;
        }
      }
    }
  }

  private RandomPlatforms(rowIdx: number, isOddRow: boolean) {
    let newNorIdx: number[] = [];
    for (let i = 0; i < this.TotalIdx; i++) {
      if (this.childrenPlatfrom[rowIdx][i].childrenCount > 0) {
        if (this.norIdx.includes(i)) {
          let item = null;
          if (i == this.ClockIdx && this.allowSpawnClock) {
            item = this.ClockPrefab;
            this.allowSpawnClock = false;
            //cc.warn("CLOCK SPAWN");
          }
          this.getPlatformByType(
            PlatformType.PT_NORMAL,
            this.childrenPlatfrom[rowIdx][i],
            true,
            item
          );

          let rateFor2Plat = Math.random();
          let rateForLeft = Math.random();
          let idxModifier = rateForLeft < 0.5 ? -1 : 1;

          let leftidx =
            i / 1 + idxModifier / 1 >= 0 &&
            i / 1 + idxModifier / 1 < this.TotalIdx
              ? i / 1 + idxModifier / 1
              : -1;
          let rightidx =
            i / 1 - idxModifier / 1 >= 0 &&
            i / 1 - idxModifier / 1 < this.TotalIdx
              ? i / 1 - idxModifier / 1
              : -1;
          if (leftidx != -1) newNorIdx.push(leftidx);
          if ((rateFor2Plat < 0.25 || leftidx == -1) && rightidx != -1) {
            newNorIdx.push(rightidx);
          } else {
            newNorIdx.push[0];
            newNorIdx.push[this.TotalIdx - 1];
          }
        } else {
          this.getPlatformByType(
            PlatformType.PT_FAKE,
            this.childrenPlatfrom[rowIdx][i]
          );
        }
      }
    }
    if (newNorIdx.length <= 0) {
      newNorIdx.push[0];
      newNorIdx.push[this.TotalIdx - 1];
      this.norIdx = [];
      this.norIdx = newNorIdx;
    } else {
      this.norIdx = [];
      this.norIdx = newNorIdx;
    }
    this.CurIdx = rowIdx / 1 + 1 <= this.MaximumRow ? rowIdx / 1 + 1 : 0;
    this.CurOddIdx = !isOddRow;
  }

  public getPlatformByType(
    type: number,
    parent: cc.Node = null,
    visible = true,
    item: cc.Prefab = null
  ) {
    if (!parent) {
      parent = cc.director.getScene();
    } else {
      parent.destroyAllChildren();
    }
    let plat: cc.Node = null;
    switch (type) {
      case PlatformType.PT_NORMAL:
        plat = cc.instantiate(this.Plat_Nor);
        break;
      case PlatformType.PT_FAKE:
        plat = cc.instantiate(this.Plat_Fake);
        break;
      case PlatformType.PT_SPECIAL:
        let i = Math.floor(Math.random() * this.Plat_Spe.length);
        plat = cc.instantiate(this.Plat_Spe[i]);
        break;
      case PlatformType.PT_NONE:
        plat = null;
        break;
    }

    if (plat) {
      plat.parent = parent;
      plat.setContentSize(this.WidthOfPlat, plat.getContentSize().height);
      plat.setPosition(cc.Vec2.ZERO);

      if (!visible) {
        plat.opacity = 0;
        this.invisiblePlatfrom.push(plat);
      } else {
        plat.opacity = 255;
        if (item) {
          let gen_item = cc.instantiate(item);
          gen_item.parent = parent;
          gen_item.setPosition(0, gen_item.getContentSize().height);
        }
      }
    }
  }

  MovingFast(speed: number, dt: number) {
    for (let i = 0; i < this.node.childrenCount; i++) {
      let curPos = this.node.children[i].getPosition();
      curPos.add(cc.v2(0, speed * dt), curPos);

      if (curPos.y < this.botPos) {
        curPos.y = this.topPos;
      }
      if (curPos.y > this.topPos) {
        curPos.y = this.botPos;
      }

      this.node.children[i].setPosition(curPos);
    }
  }

  start() {
    this.curState = PlatState.STATE_Nor;
  }

  protected onEnable(): void {
    this.Player?.on("JumpStart", this.MoveBelow, this);
  }

  protected onDisable(): void {
    this.Player?.off("JumpStart", this.MoveBelow, this);
  }

  SetState(state: number) {
    this.curState = state;
    if (this.curState == PlatState.STATE_FLY) {
      this.curFlyTime = this.flyTime;
    }
  }

  update(dt) {
    if (
      this.screenWidth != this.Canvas.getContentSize().width ||
      this.screenHeight != this.Canvas.getContentSize().height
    ) {
      this.SetBotTopGenPos();
      this.SetParameters();
      this.InitPlatForm();
    }

    if (this.curState != PlatState.STATE_Nor) {
      let speed =
        this.curState == PlatState.STATE_Fall ? this.fallSpeed : -this.flySpeed;
      this.MovingFast(speed, dt);
    }

    if (this.curFlyTime > 0 && this.curState == PlatState.STATE_FLY) {
      this.curFlyTime = this.curFlyTime - dt;
    } else if (this.curFlyTime <= 0 && this.curState == PlatState.STATE_FLY) {
      this.curState = PlatState.STATE_Nor;
      this.InitPlatForm();
      this.Player.getComponent(PlayerControl).setInputActive(true);
    }
  }
}
