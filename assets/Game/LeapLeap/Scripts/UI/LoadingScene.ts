// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoadingScene extends cc.Component {

    @property(cc.Node)
    LoadingScreen = null;

    SceneName = "Main";
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.LoadScene(true ,this.SceneName)
    }

    public LoadScene(event, customEventData)
    {
        this.LoadingScreen.active = true;
        console.log(customEventData);
        cc.log(customEventData);
        cc.director.preloadScene(customEventData, (progress: number, total: number, item) =>
        {
            //cc.warn(item);
            //this.LoadingScreen.children[2].getComponent(cc.ProgressBar).progress = progress;
            cc.tween(this.LoadingScreen.children[2].getComponent(cc.ProgressBar)).to(1,
                {
                    progress: 1
                }).call(()=>{
                    this.OnTapScreen();
                }).start();

            // if(progress === total)
            // {
            //     this.LoadingScreen.children[0].active = true;
            //     this.LoadingScreen.getComponent(cc.Button).interactable = true;
            //     this.SceneName = customEventData;
            // }
        })
    }
    public OnTapScreen()
    {
        try
        {
            cc.director.loadScene(this.SceneName);
        }
        catch(e)
        {
            console.log(e);
        }
    }
    // update (dt) {}
}
