//import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = cc._decorator;

@ccclass
export class ReturnPanel extends cc.Component {

    OnConfirmClick()
    {
        cc.director.loadScene("Menu");
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

