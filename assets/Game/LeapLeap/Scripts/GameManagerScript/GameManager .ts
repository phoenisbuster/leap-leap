import AdsCount from "../../../../Script/SDK/AdsCount";
import { TouchInput } from "../../LearningMaterials/Learning/Learning/Main/TouchInput";
import AudioButton from "../Audio/AudioButton";
import BackGround from "../Background/background";
import BG_params from "../Background/BG_params";
import UIManager from "../Base/UIManager";
import LevelData from "../LevelDesign/LevelData";
import PlatformsGenerator from "../PlatformsGenerator/PlatformsGenerator";
import PlayerAnim from "../Player/PlayerAnim";
import PlayerCheckPosition from "../Player/PlayerCheckPosition";
import PlayerControl from "../Player/PlayerController";
import Score from "../PlayerScore/Score";
import TouchRegion from "../TouchInput/TouchRegion";
import StartButton from "../UI/StartButton";
import UI_Manager from "../UI/UI_Manager";
import BaseDataManager from "../UserDataManager/DataManager";

const {ccclass, property} = cc._decorator;

enum GameState
{
    CutScene,
    Menu,
    Playing,
    Pause,
    Over
}

@ccclass
export default class GameManager extends cc.Component {

    @property(cc.Node)
    backGound: cc.Node = null;

    @property(cc.Node)
    platformsParent: cc.Node = null;

    @property(cc.Node)
    player: cc.Node = null;

    @property(cc.Node)
    camera: cc.Node = null;

    @property(cc.Prefab)
    ClockPrefab: cc.Prefab = null;

    @property(cc.Boolean)
    allowCameraAnim: boolean = false;

    @property(cc.Node)
    inputRegion: cc.Node = null;

    @property(cc.Node)
    screenCanvas: cc.Node = null;

    @property(cc.Integer)
    curGameState: GameState = GameState.Menu;

    @property(cc.Node)
    ClockUI: cc.Node = null;

    @property(cc.Integer)
    initTime = 30;

    @property(cc.Integer)
    allowClockAt = 10;

    @property(cc.Float)
    ClockAppearCount = 8;

    @property(cc.Float)
    ClockAppearInterval = 6;

    @property(cc.Float)
    DifficultyUpEvery = 10;

    @property(cc.Float)
    ClockAppearCountUp = 4;

    @property(cc.Float)
    ClockAppearIntervalUp = 3;

    @property(cc.Node)
    ScoreUI: cc.Node = null;

    @property(cc.Node)
    SumaryPanel: cc.Node = null;

    @property(cc.Node)
    GameplayPanel: cc.Node = null;

    @property(cc.Node)
    SubPanel: cc.Node = null;

    @property(cc.Node)
    CutSceneBG: cc.Node = null;

    @property(cc.Node)
    Logo: cc.Node = null;

    BGM: cc.AudioSource = null
    bgmElapseTime: number = 0;

    @property(cc.AudioSource)
    SoundButton: cc.AudioSource = null

    curTime = 0;
    curSubTime = 0;
    Timer: Function = null;

    curScore = 0;
    curIdx = 0;

    isGameStart = false;
    isPaused = false;
    isGameOver = false;
    unlockedClock = false;
    curClockCount = 0;
    curClockInterval = 0;
    curDiffCount = 0;

    timeScale = 0.25;


    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {   
        cc.game.on(cc.game.EVENT_HIDE, this.onHide, this);
        // For event when the app entering foreground
        cc.game.on(cc.game.EVENT_SHOW, this.onShow, this);

        // let v = Object.keys(LevelData);
        // cc.warn("CHECK LEVEL DATA " + v[0] + ": " + LevelData.initTime);
        // cc.warn("CHECK LEVEL DATA " + v[1] + ": " + LevelData.allowClockAt);
        // cc.warn("CHECK LEVEL DATA " + v[2] + ": " + LevelData.ClockAppearCount);
        // cc.warn("CHECK LEVEL DATA " + v[3] + ": " + LevelData.ClockAppearInterval);
        // cc.warn("CHECK LEVEL DATA " + v[4] + ": " + LevelData.DifficultyUpEvery);
        // cc.warn("CHECK LEVEL DATA " + v[5] + ": " + LevelData.ClockAppearCountUp);
        // cc.warn("CHECK LEVEL DATA " + v[6] + ": " + LevelData.ClockAppearIntervalUp);
        // cc.warn("CHECK LEVEL DATA " + v[7] + ": " + LevelData.usedDifficulty);
        // cc.warn("CHECK LEVEL DATA " + v[8] + ": " + LevelData.BG_List);
        // cc.warn("CHECK LEVEL DATA " + v[9] + ": " + LevelData.TranBG_List);
        // cc.warn("CHECK LEVEL DATA " + v[10] + ": " + LevelData.useBG);
        // cc.warn("CHECK LEVEL DATA " + v[11] + ": " + LevelData.MaximumRow);
        // cc.warn("CHECK LEVEL DATA " + v[12] + ": " + LevelData.MaximumPlatsPerRow);
        // cc.warn("CHECK LEVEL DATA " + v[13] + ": " + LevelData.usedPlat);

        if(LevelData.usedDifficulty)
        {
            this.initTime = LevelData.initTime;
            this.allowClockAt = LevelData.allowClockAt;
            this.ClockAppearCount = LevelData.ClockAppearCount;
            this.ClockAppearInterval = LevelData.ClockAppearInterval;
            this.DifficultyUpEvery = LevelData.DifficultyUpEvery;
            this.ClockAppearCountUp = LevelData.ClockAppearCountUp;
            this.ClockAppearIntervalUp = LevelData.ClockAppearIntervalUp;
        }
        this.player.getComponent(PlayerCheckPosition).announce = this.screenCanvas.children[this.screenCanvas.childrenCount-1]?.getComponent(cc.Label);
        this.inputRegion.getComponent(TouchRegion).announce = this.screenCanvas.children[this.screenCanvas.childrenCount-1]?.getComponent(cc.Label);
        this.timeScale = LevelData.TimeScale;
        this.InitParam();
        this.InitCutscene(this.curGameState);
        this.InitPlatform();
        this.InitBackgound();
        this.InitPlayer();
        this.InitCamera();
        if(this.curGameState != GameState.CutScene)
        {
            this.RePosSubUI();
        }   
    }

    onShow(){
        this.BGM?.setCurrentTime(this.bgmElapseTime);
        this.BGM?.play();
    }

    onHide(){
        this.bgmElapseTime = this.BGM?.getCurrentTime();
        cc.audioEngine.stopAll()
    }

    protected onDestroy(): void {
         cc.game.off(cc.game.EVENT_HIDE, this.onHide, this);
        cc.game.off(cc.game.EVENT_SHOW, this.onShow, this);
    }
    
    InitCutscene(gameState: GameState)
    {
        if(gameState == GameState.CutScene)
        {
            this.CutSceneBG.active = true;
            this.CutSceneBG.opacity = 255;
            this.DisableHowToPlay(true, 0);
            this.RePosSubUI(0, false);
            this.GameplayPanel.active = false;
            this.player.getComponent(PlayerAnim).PlayAnimCutScene();
            this.player.getComponent(PlayerControl).setInputActive(false);
            cc.tween(this.player).to(0.25,
            {
                x: this.screenCanvas.getPosition().x,
                y: this.screenCanvas.getPosition().y
            }).start();
            this.scheduleOnce(()=>
            {
                cc.tween(this.CutSceneBG).to(0.5,
                {
                    opacity: 0
                }).call(()=>
                {
                    this.CutSceneBG.active = false;
                    this.GameplayPanel.active = true;
                }).start();
                this.curGameState = GameState.Menu;
                this.DisableHowToPlay(false, this.timeScale);
                this.RePosSubUI(this.timeScale, true);
                this.player.getComponent(PlayerControl).ResetPosition(false);
            }, 2);
        }
    }

    InitPlatform()
    {
        if(this.platformsParent)
        {
            this.platformsParent.getComponent(PlatformsGenerator).Canvas = this.screenCanvas;
            this.platformsParent.getComponent(PlatformsGenerator).TouchRegion = this.inputRegion;
            this.platformsParent.getComponent(PlatformsGenerator).Player = this.player;
            this.platformsParent.getComponent(PlatformsGenerator).ClockPrefab = this.ClockPrefab;
            this.platformsParent.getComponent(PlatformsGenerator).SetPlatForms();
            this.platformsParent.getComponent(PlatformsGenerator).SetBotTopGenPos();
            this.platformsParent.getComponent(PlatformsGenerator).SetParameters();
            this.platformsParent.getComponent(PlatformsGenerator).InitPlatForm();
        }
    }

    InitBackgound()
    {
        if(this.backGound)
        {
            this.backGound.destroyAllChildren();
            this.backGound.getComponent(BackGround).BG_parameters = this.backGound.getComponent(BG_params);
            this.backGound.getComponent(BackGround).setParam(this.screenCanvas.getContentSize().width,
                                                                this.screenCanvas.getContentSize().height);
            this.backGound.getComponent(BackGround).InitBG();
            this.backGound.getComponent(BackGround).InitMovingObj();
        }
    }

    InitPlayer()
    {
        if(this.player)
        {
            this.player.getComponent(PlayerControl).InputSignal = this.inputRegion;
            this.player.getComponent(PlayerControl).PlatformGen = this.platformsParent;
            this.player.getComponent(PlayerControl).Camera = this.camera;
            this.player.getComponent(PlayerControl).setParameter();
            if(!LevelData.PlayCutScene)
                this.player.getComponent(PlayerControl).setInputActive(true);
        }
    }

    InitCamera()
    {
        let CamPosX = this.player.getPosition().x - this.camera.parent.getPosition().x;
        let CamPosY = this.player.getPosition().y - this.camera.parent.getPosition().y;
        if(this.allowCameraAnim)
        {
            this.camera.setPosition(CamPosX, CamPosY);
            this.camera.getComponent(cc.Camera).zoomRatio = 2;
        }
        else
        {
            this.camera.setPosition(0,0);
            this.camera.getComponent(cc.Camera).zoomRatio = 1;
        }
    }

    InitParam()
    {
        this.curGameState = LevelData.PlayCutScene? GameState.CutScene : GameState.Menu;
        this.curTime = this.initTime;
        this.curSubTime = 0;
        this.curScore = 0;
        this.curDiffCount = this.DifficultyUpEvery;
    }

    CameraControl(isZoom: boolean = false)
    {
        let CamPosX = this.player.getPosition().x - this.camera.parent.getPosition().x;
        let CamPosY = this.player.getPosition().y - this.camera.parent.getPosition().y;
        if(this.allowCameraAnim)
        {
            if(isZoom)
            {
                cc.tween(this.camera).to(this.timeScale,
                {
                    position: cc.v3(CamPosX, CamPosY, 0)
                }).start();
                cc.tween(this.camera.getComponent(cc.Camera)).to(this.timeScale,
                {
                    zoomRatio: 2
                }).start();
            }
            else
            {
                cc.tween(this.camera).to(this.timeScale,
                {
                    position: cc.v3(0, 0, 0)
                }).start();
                cc.tween(this.camera.getComponent(cc.Camera)).to(this.timeScale,
                {
                    zoomRatio: 1
                }).start();
            }
        }
        else
        {
            return;
        }
    }

    protected onEnable(): void {
        this.player?.on('JumpStart', this.IncreaseScore, this);
        this.player?.on('JumpEnd', this.PlayAnimAfterGameOver, this);
        this.player?.on('BeginPlay', this.GameStart, this);
        this.player?.on('TimeIncrease', this.IncreaseTime, this);
        this.player?.on('FakePlatTouch', this.GameOver, this);
        this.SubPanel.on('PopUp', this.Unplayable, this);
    }

    protected onDisable(): void {
        this.player?.off('JumpStart', this.IncreaseScore, this);
        this.player?.off('JumpEnd', this.PlayAnimAfterGameOver, this);
        this.player?.off('BeginPlay', this.GameStart, this);
        this.player?.off('TimeIncrease', this.IncreaseTime, this);
        this.player?.off('FakePlatTouch', this.GameOver, this);
        this.SubPanel.off('PopUp', this.Unplayable, this);
    }

    Unplayable(allowControl: boolean = false)
    {
        this.player.getComponent(PlayerControl).setInputActive(allowControl);
    }

    InitCoundown()
    {
        this.platformsParent.getComponent(PlatformsGenerator).AllPlatAppear();
        this.platformsParent.getComponent(PlatformsGenerator).ResetFirstRow();
        this.curTime = this.initTime;
        this.curGameState = GameState.Playing;
        this.isGameStart = true;
    }

    DisableHowToPlay(isDisable: boolean = true, time = 0)
    {
        this.inputRegion.children.forEach(ele=>
        {
            if(time > 0)
            {
                cc.tween(ele.children[0]).to(this.timeScale, 
                {
                    opacity: isDisable? 0 : 255
                }).start();
            }
            else
            {
                ele.children[0].opacity = 0;
            }
        });

        if(time > 0)
        {
            cc.tween(this.Logo).to(this.timeScale, 
            {
                opacity: isDisable? 0 : 255
            }).start();
        }
        else
        {
            this.Logo.opacity = 0;
        }
    }

    RePosSubUI(time: number = 0, visible: boolean = true)
    {
        cc.tween(this.SubPanel).to(time,
        {
            //x: pos0,
            opacity: visible? 255 : 0
        }).call(()=>
        {
            this.SubPanel.active = visible? true : false;
        }).start();
    }

    ResetGameState()
    {
        this.curGameState = GameState.Menu;
        this.unlockedClock = false;
        this.isGameStart = false;
        this.isPaused = false;
        this.isGameOver = false;
        cc.tween(this.GameplayPanel).to(this.timeScale,
        {
            opacity: 0
        }).call(()=>
        {
            this.InitParam();
            this.GameplayPanel.active = false;
        }).start();
        this.RePosSubUI(this.timeScale, true);
    }

    IncreaseScore(isRight: boolean = false)
    {
        if(this.isGameOver)
        {
            this.PlayAnimAfterGameOver();
            return;
        }
        
        this.curScore = this.curScore + 10;
        this.ScoreUI.getComponent(cc.Label).string = this.curScore + " pts";
        this.SpawnClock(isRight);
    }

    IncreaseTime()
    {
        this.curTime = this.curTime/1 + 3;
    }

    SpawnClock(isRight: boolean)
    {
        let step = isRight? 1 : -1;
        if(this.ClockAppearCount > 0)
        {
            if(this.unlockedClock && this.curClockCount <= 0)
            {
                this.platformsParent.getComponent(PlatformsGenerator).allowSpawnClock = true;
                this.curClockCount = this.ClockAppearCount;
            }
            else if(this.unlockedClock && this.curClockCount > 0)
            {
                this.curClockCount = this.curClockCount/1 - 1;
                this.platformsParent.getComponent(PlatformsGenerator).allowSpawnClock = false;
            }
            else
            {
                this.platformsParent.getComponent(PlatformsGenerator).allowSpawnClock = false;
            }
        }
    }

    GameStart()
    {
        this.CameraControl();
        this.InitCoundown();
        this.DisableHowToPlay(true, this.timeScale);
        this.inputRegion.getComponent(StartButton).OnClick();
        this.RePosSubUI(this.timeScale, false);
    }

    GamePause()
    {
        if(this.curGameState == GameState.Playing)
        {
            this.curGameState = GameState.Pause;
            this.player.getComponent(PlayerControl).setInputActive(false);
            this.player.getComponent(PlayerCheckPosition).enabled = false;
            this.screenCanvas.getComponent(UI_Manager).PauseUI.children[3].getComponent(cc.Label).string ="" + this.curScore;
        }
        else if(this.curGameState == GameState.Pause)
        {
            this.curGameState = GameState.Playing;
            this.player.getComponent(PlayerControl).setInputActive(true);
            this.player.getComponent(PlayerCheckPosition).enabled = true;
        }
    }

    GameOver()
    {
        AdsCount.IncreaseFailCount();
        this.curGameState = GameState.Over;
        this.player.getComponent(PlayerControl).setInputActive(false, 1);
        BaseDataManager.internalSaveNum(Score.LAST_SCORE, this.curScore);
        if(BaseDataManager.internalGetNum(Score.BEST_SCORE, 0) < this.curScore)
        {
            BaseDataManager.internalSaveNum(Score.BEST_SCORE, this.curScore);
        }
        this.SumaryPanel.scale = 1;
        this.SumaryPanel.children[4].getComponent(cc.Label).string = "" + BaseDataManager.internalGetNum(Score.LAST_SCORE, 0);
        this.SumaryPanel.children[5].getComponent(cc.Label).string = "" + BaseDataManager.internalGetNum(Score.BEST_SCORE, 0);
        cc.tween(this.SumaryPanel).to(0.5,
        {
            opacity: 255
        }).call(()=>
        {

        }).start();
        this.ResetGameState();
        LevelData.PlayCutScene = true;
    }

    PlayAnimAfterGameOver()
    {
        if(this.isGameOver)
        {
            this.player.getComponent(PlayerAnim).PlayAnimFall();
        }
    }

    Reset()
    {
        //cc.warn("CHECK SCENE " + cc.director.getScene().name);
        //this.SoundButton.play();
        cc.tween(this.SoundButton).to(0.05,{
        }).call(()=>{
            cc.director.loadScene(cc.director.getScene().name);
        }).start();
    }

    BackToLevel()
    {
        //cc.warn("CHECK SCENE " + cc.director.getScene().name);
        // cc.director.loadScene("LevelDesign");
    }

    start () 
    {
        AdsCount.CheckCountForShowingAds();

        this.BGM = this.screenCanvas.getComponents(cc.AudioSource)[0];
        this.BGM?.play();
    }

    update (dt) 
    {
        let stringTime = (this.curTime < 10? "0" : "") + this.curTime;
        let stringSubTime = (this.curSubTime < 10? "0" : "") + Math.floor(this.curSubTime);
        this.ClockUI.getComponent(cc.Label).string = stringTime + ":" + stringSubTime;
        
        if(this.curGameState == GameState.Playing)
        {
            if(this.curSubTime <= 0)
            {
                if(this.curTime > 0)
                {
                    this.curSubTime = 99;
                    this.curTime = this.curTime/1 - 1 >= 0? this.curTime/1 - 1 : 0;
                }
                else if(this.curTime <= 0 && !this.isGameOver)
                {
                    this.isGameOver = true;
                    this.curGameState = GameState.Over;
                    this.node.emit("GameOver");
                    this.player.getComponent(PlayerAnim).PlayAnimFall();
                    cc.tween(this.platformsParent).to(this.timeScale,
                    {
                        opacity: 0
                    }).start();
                    //cc.warn("TIME UP");
                    this.GameOver();
                }
            }
            else
            {
                this.curSubTime = this.curSubTime - 99*dt >= 0? this.curSubTime - 99*dt : 0;
            }

            if(this.unlockedClock == true)
            {
                if(this.ClockAppearCount <= 0)
                {
                    if(this.curClockInterval <= 0)
                    {
                        this.curClockInterval = this.ClockAppearInterval;
                        this.platformsParent.getComponent(PlatformsGenerator).allowSpawnClock = true;
                        //cc.warn("ALLOW TO SPQWN CLOCK and AFTER " + this.curClockInterval);
                    }
                    else if(this.curClockInterval > 0 && !this.platformsParent.getComponent(PlatformsGenerator).allowSpawnClock)
                    {
                        this.curClockInterval = this.curClockInterval/1 - dt;
                        //cc.warn("WHYYYYYY");
                    }
                }

                if(this.curDiffCount <= 0)
                {
                    this.curDiffCount = this.DifficultyUpEvery;
                    if(this.ClockAppearCount > 0)
                    {
                        this.ClockAppearCount = this.ClockAppearCount/1 + this.ClockAppearCountUp;
                    }
                    else
                    {
                        this.ClockAppearInterval = this.ClockAppearInterval/1 + this.ClockAppearIntervalUp;
                    }    
                }
                else
                {
                    this.curDiffCount = this.curDiffCount/1 - dt;
                }
            }

            if((this.curTime == this.allowClockAt) && !this.unlockedClock)
            {
                this.unlockedClock = true;
            }
        }      
    }
}