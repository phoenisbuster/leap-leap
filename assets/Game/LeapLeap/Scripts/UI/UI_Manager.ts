// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class UI_Manager extends cc.Component {

    //@property(cc.Node)
    Home: cc.Node = null;

    //@property(cc.Node)
    GamePlay: cc.Node = null;

    //@property(cc.Node)
    PauseUI: cc.Node = null;

    Setting: cc.Node = null;
    
    LeaderBoard: cc.Node = null;
}
