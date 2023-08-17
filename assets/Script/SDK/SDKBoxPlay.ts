const {ccclass, property} = cc._decorator;

@ccclass
export default class SDKBoxPlay {
    private static instance : SDKBoxPlay;
    public static getInstance(): SDKBoxPlay {
        if (!SDKBoxPlay.instance) {
            SDKBoxPlay.instance = new SDKBoxPlay();
        }
        return SDKBoxPlay.instance;
    }

    public initialized = false;

    public checkSDKBoxPlay () {
        if (!cc.sys.isNative){
            return false;
        }

        if (sdkbox && sdkbox.PluginSdkboxPlay) {
            return true;
        } 
        return false;
    }

    public initSDKBoxPlay () {
        if (!this.checkSDKBoxPlay())
            return;

        if (this.initialized) {
            return; 
        }

        cc.log('SDK ====== Init BoxPlay');
        sdkbox.PluginSdkboxPlay.init();
        // this.signIn();
        this.initialized = true;
    }

    public signIn() {
        if (!this.checkSDKBoxPlay()) {
            return;
        }

        cc.log('SDK ======= do SignIn Google ', sdkbox.PluginSdkboxPlay.isSignedIn());
        if (!sdkbox.PluginSdkboxPlay.isSignedIn() && !sdkbox.PluginSdkboxPlay.isConnected()) {
            sdkbox.PluginSdkboxPlay.signin(true);
        }
    }

    public showLeaderBoardScore () {
        if (!this.checkSDKBoxPlay()) {
            return;
        }

        cc.log('SDK ======= showLeaderboard ');
        this.signIn();
        sdkbox.PluginSdkboxPlay.showLeaderboard('RankingScore');
    }

    public submitHighScore (score: number) {
        if (!this.checkSDKBoxPlay()) {
            return;
        }
        cc.log('SDK ======= Submit Score ', score);
        sdkbox.PluginSdkboxPlay.submitScore('RankingScore', score);
    }
}
