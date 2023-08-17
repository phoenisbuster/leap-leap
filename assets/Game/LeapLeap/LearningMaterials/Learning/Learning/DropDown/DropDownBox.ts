//import { _decorator, Component, Node, Label, Prefab, Quat, NodeSpace, error, log, instantiate, CCString, Vec3 } from 'cc';
import { Item } from './Item';
//const {Node} = cc.Node;
const { ccclass, property } = cc._decorator;

@ccclass
export class DropDownBox extends cc.Component 
{
    @property({type: cc.Node})
    public Arrow: cc.Node | null = null;
    @property({type: cc.Label})
    public SelectLabel: cc.Label | null = null;
    @property({type: cc.Node})
    public DropDown: cc.Node | null = null;
    @property({type: cc.Node})
    public vLayout: cc.Node | null = null;
    @property({type: cc.Node})
    public contentNode: cc.Node | null = null;
    @property({type: cc.Prefab})
    public item: cc.Prefab | null = null;
    @property({type: cc.String})
    public itemContent: string[] = [];

    isDrop = false;

    onLoad()
    {
        this.isDrop = false;
        if(this.DropDown)
        {
            this.DropDown.active = false;
        }
        if(this.itemContent.length > 0)
        {
            this.InitItem();
        }
        else
        {
            cc.error("Item has not been specified");
        }
    }

    InitItem()
    {
        let Heigh = 0;
        cc.log(this.itemContent.length);
        for(let i = 0; i < this.itemContent.length; i++)
        {
            let item = cc.instantiate(this.item);
            item.children[0].getComponent<cc.Label>(cc.Label).string = this.itemContent[i];

            item.getComponent(Item).initContent(this);
            //item.parent = item;
            this.vLayout.addChild(item);
            cc.log(i);
            if(i == 0)
            {
                this.SelectLabel.string = this.itemContent[i];
            }
        }
    }

    rotateArrow()
    {
        let a = new cc.Quat();
        if(!this.isDrop)
        {
            //this.Arrow.setWorldRotationFromEuler(0, 0, 0);
            //this.Arrow.eulerAngles = new cc.Vec3(0, 0, 0);
            //this.Arrow.setRotation(new cc.Quat(0,0,0));
            this.Arrow.angle = 0;
        }
        else
        {
            //this.Arrow.setWorldRotationFromEuler(0, 0, -90);
            //this.Arrow.eulerAngles = new cc.Vec3(0, 0, -90);
            //this.Arrow.setRotation(new cc.Quat(0,0,-90));
            this.Arrow.angle = -90;
        }
    }

    ShowHideDropBox()
    {
        if(!this.isDrop)
        {
            if(this.DropDown)
            {
                this.DropDown.active = true;
            }
        }
        else
        {
            if(this.DropDown)
            {
                this.DropDown.active = false;
            }
        }
    }

    onClick()
    {
        this.rotateArrow();
        this.ShowHideDropBox();
        this.isDrop = !this.isDrop;
    }
    
    start() 
    {
        this.onLoad();
    }

    update(deltaTime: number) {
        
    }
}

