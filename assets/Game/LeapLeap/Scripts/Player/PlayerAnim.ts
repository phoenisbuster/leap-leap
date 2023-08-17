import LevelData from "../LevelDesign/LevelData";
import PlayerControl from "./PlayerController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerAnim extends cc.Component {

    @property(sp.Skeleton)
    Anim: sp.Skeleton = null;

    @property(cc.Node)
    CharacterNode: cc.Node = null;

    curRight: boolean = false;

    static Anim_Idel_L: string = "Idle_L";
    static Anim_Idel_R: string = "Idle_R";
    static Anim_Jump_L: string = "Jump_L";
    static Anim_Jump_R: string = "Jump_R";
    static Anim_Fall_L: string = "Falling_R2";
    static Anim_Fall_R: string = "Falling_R";
    static CutScene_Fall: string = "Falling_Idle_L";
    static CutScene_Landing: string = "Falling_landing_L";

    // LIFE-CYCLE CALLBACKS:

    onLoad() 
    {
        if(!this.CharacterNode)
        {
            this.CharacterNode = this.node.children[0];
        }
        if(!this.Anim)
        {
            this.Anim = this.CharacterNode.getComponent(sp.Skeleton);
        }
    }

    setAnimation(skeleton: sp.Skeleton = null, animationName: string = "animation", loop: boolean = false, startTime: number = 0, timeScale: number = 1) 
    {
        if(!skeleton)
        {
            skeleton = this.Anim;
        }
        let state = skeleton.setAnimation(0, animationName, loop) as sp.spine.TrackEntry;
        if(state)
        { 
            state.animationStart = startTime;
        }
        skeleton.timeScale = timeScale;
    }

    protected onEnable(): void 
    {
        //this.node.on("JumpStart", this.PlayAnimJump, this);
        //this.node.on("JumpEnd", this.PlayAnimIdle, this); 
        this.node.on("FakePlatTouch", this.PlayAnimFall, this);    
    }

    protected onDisable(): void 
    {
        //this.node.off("JumpStart", this.PlayAnimJump, this);
        //this.node.off("JumpEnd", this.PlayAnimIdle, this);
        this.node.off("FakePlatTouch", this.PlayAnimFall, this);
    }

    PlayAnimJump(isRight: boolean = true)
    {
        if(this.node.getComponent(PlayerControl).curState == 1)
        {
            return;
        }
        
        let name = isRight? PlayerAnim.Anim_Jump_R : PlayerAnim.Anim_Jump_L;
        this.curRight = isRight;
        this.setAnimation(this.Anim, name, false);
    }

    PlayAnimIdle(name: string = "")
    {
        if(this.node.getComponent(PlayerControl).curState == 1)
        {
            return;
        }
        if(name == "")
            name = this.curRight? PlayerAnim.Anim_Idel_R : PlayerAnim.Anim_Idel_L;
        this.setAnimation(this.Anim, name, true);
    }

    PlayAnimFall()
    {
        let name = this.curRight? PlayerAnim.Anim_Fall_R : PlayerAnim.Anim_Fall_L;
        this.setAnimation(this.Anim, name, false);
    }

    PlayAnimCutScene()
    {
        this.setAnimation(this.Anim, PlayerAnim.CutScene_Fall, true);
    }

    PlayAnimLanding()
    {
        this.setAnimation(this.Anim, PlayerAnim.CutScene_Landing, false);
    }

    start () 
    {
        this.curRight = Math.random() < 0.5? true : false;
        if(!LevelData.PlayCutScene)
            this.PlayAnimIdle();
    }

    // update (dt) {}
}
