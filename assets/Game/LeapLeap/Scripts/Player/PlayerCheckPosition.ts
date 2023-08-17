import Platform from "../Platforms/Platform";
import TouchRegion from "../TouchInput/TouchRegion";
import PlayerControl from "./PlayerController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerCheckPosition extends cc.Component {

    PlayerCollider: cc.BoxCollider = null;

    allowCheck = false;
    isHit = false;

    @property(cc.Boolean)
    isDebug: boolean = false;

    @property(cc.Node)
    InputRegion: cc.Node = null;

    @property(cc.Prefab)
    TimeText: cc.Prefab = null;

    announce: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:
    onCollisionEnter(other: cc.Collider, self: cc.Collider) 
    {
        if(other.node.name == "Platform")
        {
            if(other.node.getComponent(Platform).Tag == 2)
            {
                if(this.allowCheck)
                {
                    //cc.warn("You enter on the fake platform");
                }
            }
        }
        if(other.node.name == "Clock")
        {
            other.node.destroy();
            let timeText = cc.instantiate(this.TimeText);
            timeText.parent = cc.director.getScene();
            timeText.setPosition(this.node.getPosition().x, this.node.getPosition().y + 50);
            this.node.emit("TimeIncrease");
        }
    }

    onCollisionStay(other: cc.Collider, self: cc.Collider) 
    {
        if(other.node.name == "Platform")
        {
            if(other.node.getComponent(Platform).Tag == 2)
            {
                if(this.allowCheck && !this.isHit)
                {
                    if(self.node.getPosition().y > other.node.parent.getPosition().y)
                    {    
                        if(!this.isDebug)
                        {
                            this.node.getComponent(PlayerControl).setInputActive(false, 1);
                            //this.node.getComponent(PlayerControl).ResetPosition(false);
                            this.node.getComponent(cc.BoxCollider).enabled = false;
                            this.node.emit("FakePlatTouch");
                        }
                        this.isHit = true;
                        other.node.getComponent(Platform).DestroyObj();
                    }
                }
            }
        }
    }

    onCollisionExit(other: cc.Collider, self: cc.Collider) 
    {
        if(other.node.name == "Platform")
        {
            if(other.node.getComponent(Platform).Tag == 2)
            {
                if(this.isDebug)
                {
                    this.isHit = false;
                }
            }
        }
    }

    onLoad () 
    {
        cc.director.getCollisionManager().enabled = true;
        this.PlayerCollider = this.node.getComponent(cc.BoxCollider);
    }

    start () 
    {
        this.PlayerCollider.size = this.node.getContentSize();
    }

    protected onEnable(): void 
    {
        this.node.on("JumpStart", this.allowCheckFalse, this);
        this.node.on("JumpEnd", this.allowCheckTrue, this);
        this.InputRegion?.on("Imortal", this.setDebug, this);
    }

    protected onDisable(): void 
    {
        this.node.off("JumpStart", this.allowCheckFalse, this);
        this.node.off("JumpEnd", this.allowCheckTrue, this);    
    }

    protected onDestroy(): void 
    {
        this.InputRegion?.off("Imortal", this.setDebug, this);
    }

    allowCheckTrue(currtentIdx: number)
    {
        this.allowCheck = true;
    }

    allowCheckFalse()
    {
        this.allowCheck = false;
    }

    setDebug(allow: boolean = false)
    {
        this.isDebug = allow;
        this.announce.string = "??";
        this.scheduleOnce(()=>
        {
            this.announce.string = "";
        }, 1);
    }

    // update (dt) {}
}
