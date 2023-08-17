//import { _decorator, Component, Node, Prefab, instantiate, CCInteger, Vec3, director, Label, RichText, ProgressBar, find, game, log } from 'cc';
import { DropDownBox } from '../DropDown/DropDownBox';
import { Diffculty } from '../Menu/Diffculty';
import { PlayerController } from './PlayerContrller';
const { ccclass, property } = cc._decorator;

//Game Data
enum BlockType
{
    BT_NONE,
    BT_STONE,
}

enum GameState
{
    GS_INIT,
    GS_PLAYING,
    GS_END,
}

@ccclass
export class GameManager extends cc.Component 
{
    @property({type: cc.Prefab})
    public cubePrefab: cc.Prefab | null = null;
    @property({type: cc.Node})
    public RoadParent: cc.Node | null = null;
    @property({type: cc.Integer})
    public roadLength = 50;
    @property({type: PlayerController})
    public playerCtrl: PlayerController = null;
    @property({type: cc.Node})
    public startMenu: cc.Node = null;
    @property({type: cc.Node})
    public endMenu: cc.Node = null;
    @property({type: cc.Node})
    public progressBar: cc.Node = null;
    @property({type: cc.Label})
    public Score: cc.Label | null = null;
    @property({type: cc.Node})
    public Descript: cc.Node = null;
    @property({type: cc.Node})
    DifficultySetting: cc.Node | null = null;
    @property
    curGameState: GameState = GameState.GS_INIT;
    @property
    countDown = 1;
    
    @property
    difficulty = 0;

    isStart = false;
    road: number[]= [];
    score = 0;

    start() 
    {
        this.isStart = false;
        this.SetGameState(GameState.GS_INIT);
        this.playerCtrl?.node.on('JumpEnd', this.PlayerJump, this);
        this.playerCtrl?.node.on('JumpStart', this.PlayerJumpStart, this);
        //this.GenerateRoad();
    }

    init()
    {
        if(this.Score)
        {
            this.Score.string = "Score: 0";
        }
        if(this.startMenu)
        {
            this.startMenu.active = true;
        }
        if(this.endMenu)
        {
            this.endMenu.active = false;
        }
        if(this.playerCtrl)
        {
            this.playerCtrl.setInputActive(false);
            this.playerCtrl.node.setPosition(new cc.Vec3(0, 0, 0));
            this.playerCtrl.MoveIndex = 0;
        }
    }
    
    SetGameState(value: GameState, Score: number = 0) 
    {
        switch(value)
        {
            case GameState.GS_INIT:
                this.init();
                break;
            case GameState.GS_PLAYING:
                // if(this.endMenu)
                // {
                //     this.endMenu.active = false;
                // }
                // setTimeout(() => 
                // {
                //     if(this.playerCtrl)
                //     {
                //         this.playerCtrl.setInputActive(true);
                //     }
                // }, 0.1);
                this.Score.string = "Score: " + Score;
                break;
            case GameState.GS_END:
                if(this.endMenu)
                {
                    this.endMenu.active = true;
                    this.isStart = false;
                    this.endMenu.getChildByName("HighScore").getComponent(cc.RichText).string = "<color=#00ff00>High Score: </color><color=#0fffff>" + Score + "</color>";
                    this.playerCtrl.setInputActive(false);
                }
            default:
                break;
        }
        this.curGameState = value;
    }

    onRestartClick()
    {
        cc.director.loadScene("Main");
    }

    onStartClick()
    {
        switch(this.DifficultySetting.getComponent(DropDownBox).SelectLabel.string)
        {
            case "Easy":
                this.difficulty = 0;
                break;
            case "Normal":
                this.difficulty = 1;
                break;
            case "Hard":
                this.difficulty = 2;
                break;
            default:
                this.difficulty = 0;
                break;                
        }
        this.GenerateRoad();
        if(this.startMenu)
        {
            this.startMenu.active = false;
        }
        if(this.playerCtrl)
        {
            this.playerCtrl.setInputActive(true);
        }
        this.isStart = true;
    }

    onClickBack()
    {
        cc.director.loadScene("Menu");
    }

    GenerateRoad()
    {
        this.RoadParent.removeAllChildren();

        this.road = [];

        switch(this.difficulty)
        {
            case 0:
                this.roadLength = 50;
                break;
            case 1:
                this.roadLength = 100;
                break;
            case 2:
                this.roadLength = 150;
                break;
        }

        for(let i = 0; i < this.roadLength; i++)
        {
            if(i == 0)
            {
                this.road.push(BlockType.BT_STONE);
            }
            else if(this.road[i-1] === BlockType.BT_NONE)
            {
                this.road.push(BlockType.BT_STONE);
            }
            else
            {
                this.road.push(Math.floor(Math.random()*2));
            }           
        }

        for(let j = 0; j < this.road.length; j++)
        {
            let block: cc.Node = this.SpawnBlockByType(this.road[j]);
            if(block)
            {
                this.RoadParent.addChild(block);
                block.setPosition(j, 0, 0);
            }
        }
    }

    SpawnBlockByType(t: BlockType)
    {
        if(!this.cubePrefab)
        {
            return null;
        }

        let block: cc.Node | null = null;
        switch(t)
        {
            case BlockType.BT_STONE:
                block = cc.instantiate(this.cubePrefab);
                break;
            default:
                break;
        }
        
        return block;
    }

    PlayerJump(MoveIndex: number)
    {
        this.GameRule(MoveIndex, false);
    }

    PlayerJumpStart()
    {
        this.countDown = 1;
    }

    GameRule(MoveIndex: number, isMove: boolean)
    {
        if(MoveIndex < this.roadLength)
        {
            if(this.road[MoveIndex] == BlockType.BT_NONE)
            {
                this.SetGameState(GameState.GS_END, MoveIndex - 1);
            }
            else
            {
                this.SetGameState(GameState.GS_PLAYING, MoveIndex);
                this.score = MoveIndex;
            }
        }
        else
        {
            this.SetGameState(GameState.GS_END, this.roadLength - 1);
        }
    }
    
    update(deltaTime: number) 
    {
        this.progressBar.getComponent(cc.ProgressBar).progress = this.countDown;
        if(this.countDown > 0 && this.playerCtrl.isActive && this.isStart)
        {
            let reduceTime = deltaTime * 0.5;
            switch(this.difficulty)
            {
                case 1:
                    reduceTime = deltaTime;
                    break;
                case 2:
                    reduceTime = deltaTime*1.5;
                    break;
            }
            this.countDown = this.countDown - deltaTime <= 0? 0 : this.countDown - reduceTime;
        }
        else if(this.countDown > 0 && !this.playerCtrl.isActive && this.isStart)
        {
            this.countDown = this.countDown - deltaTime <= 0? 0 : this.countDown - deltaTime/10;
        }
        else if(this.countDown <= 0 && this.isStart)
        {
            this.SetGameState(GameState.GS_END, this.score);
        }
    }
}

