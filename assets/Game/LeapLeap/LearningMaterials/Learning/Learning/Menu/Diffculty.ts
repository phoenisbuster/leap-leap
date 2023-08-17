//import { _decorator, Component, Node, CCInteger } from 'cc';
const { ccclass, property } = cc._decorator;

@ccclass
export class Diffculty extends cc.Component {
    @property({type: cc.Integer})
    public difficultyCode = 0; //0: easy; 1: normal; 2: hard
}

