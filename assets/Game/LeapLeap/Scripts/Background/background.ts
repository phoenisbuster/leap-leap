import LevelData from "../LevelDesign/LevelData";
import PlatformsGenerator from "../PlatformsGenerator/PlatformsGenerator";
import PlayerControl from "../Player/PlayerController";
import BG_params, { BG_Comp } from "./BG_params";
import MovingObjs from "./movingObjs";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BackGround extends cc.Component {

    BG_parameters: BG_params = null;

    @property(cc.SpriteFrame)
    BG_ground: cc.SpriteFrame = null;

    @property(cc.Integer)
    ground_Step: number = 3;

    @property([cc.SpriteFrame])
    BG_farObj: cc.SpriteFrame[] = [];

    @property(cc.Integer)
    farObj_Step: number = 12;

    @property(cc.Integer)
    ObjDensity: number = 3;

    curIdx = 1;
    curBGIdx = 0;
    BG_List: BG_Comp[] = [];

    screenWidth = 0;
    screenHeight = 0;
    
    @property(cc.Node)
    player: cc.Node = null;

    @property(cc.Node)
    platformsParent: cc.Node = null;

    curBG: cc.Node = null;
    transBG: cc.Node = null;
    nextBG: cc.Node = null;

    curMovingBGComp: cc.Node = null;
    curStaticBGComp: cc.Node = null;
    curRandomBGComp: cc.Node = null;

    nextMovingBGComp: cc.Node = null;
    nextStaticBGComp: cc.Node = null;
    nextRandomBGComp: cc.Node = null;

    ground: cc.Node = null;
    farAwayObjs: cc.Node[] = [];

    _moveTime = 0;
    isTrans = false;
    isSpecialTrans = false;
    startHeight = 0;

    transTime = 0.3

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        // this.node.destroyAllChildren();
        // this.BG_parameters = this.node.getComponent(BG_params);
        // this.setParam();
        if(LevelData.useBG)
        {
            
        }
        this.transTime = LevelData.TimeScale;
    }

    start () 
    {
        // this.InitBG();
        // this.InitMovingObj();
    }

    protected onEnable(): void {
        this.player?.on('JumpStart', this.MoveBG, this);
    }

    protected onDisable(): void {
        this.player?.off('JumpStart', this.MoveBG, this);
    }

    setParam(width: number = this.node.getContentSize().width, height: number = this.node.getContentSize().height)
    {
        this.BG_List = this.BG_parameters.BG_List;
        this.screenWidth = width;
        this.screenHeight = height;
        this._moveTime = this.platformsParent.getComponent(PlatformsGenerator).MoveTime;
        this.startHeight = this.platformsParent.getComponent(PlatformsGenerator).StartHeight;
    }

    CreateChildren(name: string, parent: cc.Node, PosY: number = 0, id: number = -1, isStatic = null)
    {
        let target = new cc.Node(name);
        target.parent = parent;
        target.setPosition(0, PosY);

        if(id >= 0)
        {
            if(isStatic == true)
                this.SetStaticObj(target, id);
            else if(isStatic == false)
                this.SetMovingObj(target, id);
        }    
        return target;
    }

    InitBG()
    {
        this.curBG = new cc.Node("curBG");
        this.curBG.addComponent(cc.Sprite).spriteFrame = this.BG_List[this.curBGIdx].Main_BG;

        this.curBG.parent = this.node;
        
        this.curBG.setContentSize(this.screenWidth, this.screenHeight);
        this.curBG.setPosition(0, 0);
        // this.SetMovingObj(this.curBG.children[0], 0);
        // this.SetStaticObj(this.curBG.children[1], 0);

        if(this.curBGIdx < this.BG_List.length - 1)
        {
            this.nextBG = new cc.Node("nextBG");
            this.nextBG.addComponent(cc.Sprite).spriteFrame = this.BG_List[this.curBGIdx + 1].Main_BG;

            this.nextBG.parent = this.node;
            // this.nextBG.addChild(new cc.Node("MovingComp"));
            // this.nextBG.addChild(new cc.Node("StaticComp"));
            
            this.nextBG.setContentSize(this.screenWidth, this.screenHeight);
            this.nextBG.setPosition(0, this.screenHeight);
            // this.SetMovingObj(this.nextMovingBGComp, 1);
            // this.SetStaticObj(this.nextBG.children[1], 1);

            this.transBG = new cc.Node("transBG");
            this.transBG.addComponent(cc.Sprite).spriteFrame = this.BG_List[this.curBGIdx].Trans_BG;

            this.transBG.parent = this.node;

            this.transBG.setContentSize(this.screenWidth, this.screenHeight);
            this.transBG.setPosition(0, this.screenHeight/2);
            this.transBG.opacity = 0;
        }

        this.curStaticBGComp = this.CreateChildren("CurStaticComp", this.node, 0, 0, true);
        this.curMovingBGComp = this.CreateChildren("CurMovingComp", this.node, 0, 0, false);
        this.curRandomBGComp = this.CreateChildren("CurRandomComp", this.node, 0, 0);

        this.nextStaticBGComp = this.CreateChildren("NextStaticComp", this.node, this.screenHeight, 1, true);
        this.nextMovingBGComp = this.CreateChildren("NextMovingComp", this.node, this.screenHeight, 1, false);
        this.nextRandomBGComp = this.CreateChildren("NextRandomComp", this.node, this.screenHeight, 1);
    }

    InitMovingObj()
    {
        let mountain = new cc.Node("Mountain");
        mountain.addComponent(cc.Sprite).spriteFrame = this.BG_farObj[0];

        this.ground = new cc.Node("Ground");
        this.ground.addComponent(cc.Sprite).spriteFrame = this.BG_ground;
    
        mountain.parent = this.node;
        this.ground.parent = this.node;

        mountain.setContentSize(this.screenWidth, (this.screenHeight * 0.8));
        mountain.setPosition(0, (-this.screenHeight * 0.2)/2);

        this.ground.setContentSize(this.screenWidth, this.platformsParent.getComponent(PlatformsGenerator).StartHeight * 2 + 75);
        //this.ground.setPosition(0, -293.5);
        this.ground.addComponent(cc.Widget);
        this.ground.getComponent(cc.Widget).isAlignBottom = true;
        //this.ground.getComponent(cc.Widget).bottom = 0;
        // cc.warn("CHECK GROUND " + this.ground.getContentSize());
        // cc.warn("CHECK GROUND " + this.ground.getPosition());

        this.farAwayObjs.push(mountain);
    }

    SetMovingObj(parent: cc.Node, Idx: number)
    {
        if(!parent)
        {
            return;
        }
        else
        {
            parent.destroyAllChildren();
        }

        if(Idx >= this.BG_List.length)
        {
            return;
        }
        if(this.BG_List[Idx].Moving_BG_Comp.length <= 0)
        {
            return;
        }
        let count = 0;
        while(count < this.ObjDensity)
        {
            let Comp = new cc.Node("Moving Comp");
            let i = Math.floor(Math.random() * this.BG_List[Idx].Moving_BG_Comp.length);
            Comp.addComponent(cc.Sprite).spriteFrame = this.BG_List[Idx].Moving_BG_Comp[i];
            Comp.name = Comp.getComponent(cc.Sprite).spriteFrame.name;
            Comp.parent = parent;

            let x =  -this.screenWidth/2 + this.screenWidth * Math.random();
            let y = this.screenHeight/2 - (count/1 + 1)* this.screenHeight/(this.ObjDensity+1);
            Comp.setPosition(x, y);

            Comp.addComponent(MovingObjs);
            Comp.getComponent(MovingObjs).setScreenSize(this.screenWidth, this.screenHeight);
            Comp.getComponent(MovingObjs).speed = this.BG_List[Idx].minSpeed + this.BG_List[Idx].maxSpeed*Math.random();
            Comp.getComponent(MovingObjs).enabled = true;

            count = count/1 + 1;
        }

    }

    SetStaticObj(parent: cc.Node, Idx: number)
    {
        if(!parent)
        {
            return;
        }
        else
        {
            parent.destroyAllChildren();
        }
        if(Idx >= this.BG_List.length)
        {
            return;
        }

        for(let i = 0; i < this.BG_List[Idx].Static_BG_Comp.length; i++)
        {
            let Comp = new cc.Node();
            Comp.addComponent(cc.Sprite).spriteFrame = this.BG_List[Idx].Static_BG_Comp[i];
            Comp.name = Comp.getComponent(cc.Sprite).spriteFrame.name;
            Comp.parent = parent;

            if(this.BG_List[Idx].fixedPos)
            {
                Comp.setPosition(this.BG_List[Idx].Pos);
            }
            else
            {
                let x =  -this.screenWidth/2 + Math.random() * this.screenWidth/2;
                let y = 0 - Math.random() * this.screenHeight/3;
                Comp.setPosition(x, y);
            }
        }
    }

    MoveBG()
    {
        if(this.isSpecialTrans)
        {
            cc.tween(this.transBG).to(this.transTime,
            {
                position: cc.v3(0, -this.screenHeight, 0),
            }).call(()=>
            {
                this.transBG.setPosition(this.transBG.getPosition().x, this.screenHeight/2);
                this.transBG.getComponent(cc.Sprite).spriteFrame = this.BG_List[this.curBGIdx].Trans_BG;
                this.transBG.setContentSize(this.screenWidth, this.screenHeight);
                this.transBG.opacity = 0;
                this.isSpecialTrans = false;
            }).start();
        }
        if(this.isTrans)
        {
            this.BackgroundTransition();
        }

        if(this.ground.getPosition().y > -(this.screenHeight/2 + this.ground.getContentSize().height/2))
        {
            let x = this.ground.getPosition().x;
            let y = this.ground.getPosition().y - this.ground.getContentSize().height/(this.ground_Step*2);
            cc.tween(this.ground).to(this._moveTime, 
            {
                position: cc.v3(x,y,0)
            }).start();
        }
        this.farAwayObjs.forEach(ele=>
        {
            if(ele.getPosition().y > -(this.screenHeight/2 + ele.getContentSize().height/2))
            {
                let x = ele.getPosition().x;
                let y = ele.getPosition().y - ele.getContentSize().height/this.farObj_Step;
                cc.tween(ele).to(this._moveTime,
                {
                    position: cc.v3(x,y,0)
                }).start();
            }
        });

        let a = LevelData.useBG? LevelData.BG_List[this.curBGIdx<LevelData.BG_List.length? this.curBGIdx : LevelData.BG_List.length-1] : this.BG_List[this.curBGIdx].noStartTransPhase;
        //cc.error("Step to BG " + a);
        if(this.curBGIdx < this.BG_List.length-1 && this.curIdx % a == 0 )
        {
            cc.tween(this.transBG).to(this.transTime,
            {
                opacity: 255
            }).start();
            this.isTrans = true;
            this.curBGIdx = this.curBGIdx/1 + 1;
        }
        this.curIdx = this.curIdx/1 + 1;
    }

    BackgroundTransition()
    {
        let a = LevelData.useBG? LevelData.TranBG_List[this.curBGIdx<LevelData.TranBG_List.length? this.curBGIdx : LevelData.TranBG_List.length-1] : this.BG_List[this.curBGIdx].noToTransPhase;
        //cc.error("Step to trans BG " + a);
        ////// Moving BG 1 //////////
        let x = this.curBG.getPosition().x;
        let y = this.curBG.getPosition().y - this.screenHeight/(a);
        cc.tween(this.curBG).to(this._moveTime, 
        {
            position: cc.v3(x,y,0)
        }).call(()=>
        {
            if(this.curBGIdx+1 < this.BG_List.length && this.curBG.getPosition().y <= -this.screenHeight)
            {
                this.curBG.setPosition(this.curBG.getPosition().x, this.screenHeight);
                this.curBG.getComponent(cc.Sprite).spriteFrame = this.BG_List[this.curBGIdx+1].Main_BG;
                this.curBG.setContentSize(this.screenWidth, this.screenHeight);
                // this.SetMovingObj(this.curBG.children[0], this.curBGIdx+1);
                // this.SetStaticObj(this.curBG.children[1], this.curBGIdx+1);
                this.isTrans = false;
            }
        }).start();

        ////// Moving Components of BG 1 //////////
        cc.tween(this.curMovingBGComp).to(this._moveTime, 
        {
            position: cc.v3(x,y,0)
        }).call(()=>
        {
            if(this.curMovingBGComp.getPosition().y <= -this.screenHeight)
            {
                this.curMovingBGComp.setPosition(0, this.screenHeight);
                this.SetMovingObj(this.curMovingBGComp, this.curBGIdx+1);
            }
        }).start();

        cc.tween(this.curStaticBGComp).to(this._moveTime, 
        {
            position: cc.v3(x,y,0)
        }).call(()=>
        {
            if(this.curStaticBGComp.getPosition().y <= -this.screenHeight)
            {
                this.curStaticBGComp.setPosition(0, this.screenHeight);
                this.SetStaticObj(this.curStaticBGComp, this.curBGIdx+1);
            }
        }).start();
        cc.tween(this.curRandomBGComp).to(this._moveTime, 
        {
            position: cc.v3(x,y,0)
        }).call(()=>
        {
            if(this.curRandomBGComp.getPosition().y <= -this.screenHeight)
            {
                this.curRandomBGComp.setPosition(0, this.screenHeight);
            }
        }).start();

        ////// Moving Trans BG  //////////
        x = this.transBG.getPosition().x;
        y = this.transBG.getPosition().y - this.screenHeight/(a);
        cc.tween(this.transBG).to(this._moveTime, 
        {
            position: cc.v3(x,y,0)
        }).call(()=>
        {
            if(this.transBG.getPosition().y <= -(this.screenHeight/2))
            {
                this.isTrans = false;
                this.isSpecialTrans = true;
            }
        }).start();
        
        ////// Moving BG 2 //////////
        x = this.nextBG.getPosition().x;
        y = this.nextBG.getPosition().y - this.screenHeight/(a);
        cc.tween(this.nextBG).to(this._moveTime, 
        {
            position: cc.v3(x,y,0)
        }).call(()=>
        {
            if(this.curBGIdx+1 < this.BG_List.length && this.nextBG.getPosition().y <= -this.screenHeight)
            {    
                this.nextBG.setPosition(this.nextBG.getPosition().x, this.screenHeight);
                this.nextBG.getComponent(cc.Sprite).spriteFrame = this.BG_List[this.curBGIdx+1].Main_BG;
                this.nextBG.setContentSize(this.screenWidth, this.screenHeight);
                // this.SetMovingObj(this.nextBG.children[0] ,this.curBGIdx+1);
                // this.SetStaticObj(this.nextBG.children[1], this.curBGIdx+1);
                this.isTrans = false;
            }
        }).start();

        ////// Moving Components BG 2 //////////
        cc.tween(this.nextMovingBGComp).to(this._moveTime, 
        {
            position: cc.v3(x,y,0)
        }).call(()=>
        {
            if(this.nextMovingBGComp.getPosition().y <= -this.screenHeight)
            {    
                this.nextMovingBGComp.setPosition(0, this.screenHeight);
                this.SetMovingObj(this.nextMovingBGComp ,this.curBGIdx+1);
            }
        }).start();
        cc.tween(this.nextStaticBGComp).to(this._moveTime, 
        {
            position: cc.v3(x,y,0)
        }).call(()=>
        {
            if(this.nextStaticBGComp.getPosition().y <= -this.screenHeight)
            {    
                this.nextStaticBGComp.setPosition(0, this.screenHeight);
                this.SetStaticObj(this.nextStaticBGComp ,this.curBGIdx+1);
            }
        }).start();
        cc.tween(this.nextRandomBGComp).to(this._moveTime, 
        {
            position: cc.v3(x,y,0)
        }).call(()=>
        {
            if(this.nextRandomBGComp.getPosition().y <= -this.screenHeight)
            {    
                this.nextRandomBGComp.setPosition(0, this.screenHeight);
            }
        }).start();
    }

    update (dt) 
    {
        if(this.screenWidth != this.node.getContentSize().width || 
            this.screenHeight != this.node.getContentSize().height)
        {
            this.setParam();
        }
    }
}
