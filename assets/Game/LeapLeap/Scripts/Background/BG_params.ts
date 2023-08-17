const {ccclass, property, executeInEditMode} = cc._decorator;

@ccclass("BG_Comp")
export class BG_Comp
{
    @property(cc.SpriteFrame)
    Main_BG: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    Trans_BG: cc.SpriteFrame = null;

    @property([cc.SpriteFrame])
    Moving_BG_Comp: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    Static_BG_Comp: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    Random_BG_Comp: cc.SpriteFrame[] = [];

    @property(cc.Float)
    minSpeed: number = 50;

    @property(cc.Float)
    maxSpeed: number = 50;

    @property(cc.Boolean)
    randomPath: boolean = false;

    @property(cc.Boolean)
    fixedPos: boolean = false;

    @property({
        type: cc.Vec2,
        visible: function (this) {
            return this.fixedPos;
        }
    })
    Pos: cc.Vec2 = cc.Vec2.ZERO;

    @property(cc.Integer)
    noStartTransPhase: number = 12;

    @property(cc.Float)
    noToTransPhase: number = 4;
}

@ccclass
@executeInEditMode
export default class BG_params extends cc.Component {

    @property({
        type: [BG_Comp],
        displayName: "All Background of the level"
    })
    BG_List: BG_Comp[] = [];

    onLoad () 
    {
        cc.log("READY");
    }
}
