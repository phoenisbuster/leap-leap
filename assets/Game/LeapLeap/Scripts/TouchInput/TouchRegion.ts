import LevelData from "../LevelDesign/LevelData";
import StartButton from "../UI/StartButton";

const {ccclass, property} = cc._decorator;

const Canvas: string = "ScreenGame";
const Touch: string = "Touch";

@ccclass
export default class TouchRegion extends cc.Component {

    @property(cc.Node)
    ScreenGame: cc.Node = null;

    LeftRegion: cc.Node = null;
    RightRegion: cc.Node = null;

    screenHeigh: number = 0;
    screenWidth: number = 0;

    private estereggtime = 0;
    private estereggcount = 0;
    private continuousTouch = 0;

    announce: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        if(!this.ScreenGame)
        {
            this.ScreenGame = cc.find(Canvas);
        }
        this.LeftRegion = this.node.children[0];
        this.RightRegion = this.node.children[1];
    }

    start () 
    {
        try
        {
            if(this.ScreenGame)
            {
                this.SetTouchRegionResponsive();
            }
            else
            {
                throw new Error("The main Canvas was not found");
            }
        }
        catch(e)
        {
            cc.error(e.msg);
        }
    }

    public SetTouchRegionResponsive()
    {
        this.screenWidth = this.ScreenGame.getContentSize().width;
        this.screenHeigh = this.ScreenGame.getContentSize().height;

        this.LeftRegion.setContentSize(this.screenWidth/2, this.LeftRegion.getContentSize().height);
        this.LeftRegion.setPosition(cc.v2(-this.screenWidth/4, 0));

        this.RightRegion.setContentSize(this.screenWidth/2, this.RightRegion.getContentSize().height);
        this.RightRegion.setPosition(cc.v2(this.screenWidth/4, 0));
    }

    protected onEnable(): void
    {
        this.LeftRegion?.on(cc.Node.EventType.TOUCH_START, this.TouchLeft, this);
        this.RightRegion?.on(cc.Node.EventType.TOUCH_START, this.TouchRight, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.OnKeyPress, this);

        this.LeftRegion?.on(cc.Node.EventType.TOUCH_MOVE, this.DoSomething3, this);
        this.RightRegion?.on(cc.Node.EventType.TOUCH_MOVE, this.DoSomething4, this);
    }

    protected onDisable(): void
    {
        this.LeftRegion?.off(cc.Node.EventType.TOUCH_START, this.TouchLeft, this);
        this.RightRegion?.off(cc.Node.EventType.TOUCH_START, this.TouchRight, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.OnKeyPress, this);

        this.LeftRegion?.off(cc.Node.EventType.TOUCH_MOVE, this.DoSomething3, this);
        this.RightRegion?.off(cc.Node.EventType.TOUCH_MOVE, this.DoSomething4, this);
    }

    private OnKeyPress(event: cc.Event.EventKeyboard)
    {
        if(event.keyCode == cc.macro.KEY.a || event.keyCode == cc.macro.KEY.left)
        {
            this.TouchLeft();
        }
        if(event.keyCode == cc.macro.KEY.d || event.keyCode == cc.macro.KEY.right)
        {
            this.TouchRight();
        }
    }

    private TouchLeft()
    {
        this.node.emit(Touch, false);
        cc.log("Receive Touch on the left");
        this.DoSomething2(false);
    }

    private TouchRight()
    {
        this.node.emit(Touch, true);
        cc.log("Receive Touch on the right");
        this.DoSomething2(true);
    }

    private DoSomething1(dt: number)
    {
        if(this.estereggcount == 11)
        {
            this.estereggcount = 0;
            this.estereggtime = 0;
            this.node.emit("Imortal", true);
            //cc.error("ALO");
        }
        if(this.estereggtime <= 0)
        {
            this.estereggcount = 0;
            return;
        }
        else
        {
            this.estereggtime = this.estereggtime/1 - dt;
        }
    }

    private DoSomething2(isRight: boolean)
    {
        switch(this.estereggcount)
        {
            case 0:
            case 1:
            case 2:
            case 5:
            case 8:
            case 9:
            case 10:
                if(!isRight)
                {
                    this.estereggcount = this.estereggcount/1 + 1;
                    this.estereggtime = 1;
                }
                else
                {
                    this.estereggcount = 0;
                }
                break;
            case 3:
            case 4:
            case 6:
            case 7:
                if(isRight)
                {
                    this.estereggcount = this.estereggcount/1 + 1;
                    this.estereggtime = 1;
                }
                else
                {
                    this.estereggcount = 0;
                }
                break;
            default:
                this.estereggcount = 0;
                this.estereggtime = 0;
                break;
        }
    }

    private DoSomething3()
    {
        if(this.continuousTouch <= 20.1 && this.continuousTouch >= 0)
        {
            this.continuousTouch = this.continuousTouch/1 + 2*cc.director.getDeltaTime();
        }
        else
        {
            this.announce.string = "???";
        }    
    }

    private DoSomething4()
    {
        if(this.continuousTouch >= 20)
        {
            this.continuousTouch = this.continuousTouch/1 + 2*cc.director.getDeltaTime();
        }
    }

    update (dt) 
    {
        if(this.node.getContentSize().width != this.screenWidth || this.node.getContentSize().height != this.screenHeigh)
        {
            this.SetTouchRegionResponsive();
        }
        this.DoSomething1(dt);
        if(this.continuousTouch >= 60)
        {
            LevelData.TimeScale = LevelData.TimeScale >= 0.25? 0.125 : 0.3;
            this.continuousTouch = -1;
            this.announce.string = "????";
            this.scheduleOnce(()=>
            {
                this.announce.string = "";
            }, 1);
        }
        else if(this.continuousTouch <= 20 && this.continuousTouch >= 0)
        {
            this.continuousTouch = this.continuousTouch/1 - dt > 0? this.continuousTouch/1 - dt : 0;
        }   
    }
}
