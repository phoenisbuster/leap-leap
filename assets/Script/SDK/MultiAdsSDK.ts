//  cc.systemEvent.on(UnityAdsEvent.UnityAdsEvent, (event, data)=>{
//    this.adsCallbackLabel.string = event + "\n" + JSON.stringify(data)
//})
export class UnityAdsEvent{
    public static UnityAdsEvent = "UnityAdsEvent";
    public static unityAdsDidClick = "unityAdsDidClick";
    public static unityAdsPlacementStateChanged = "unityAdsPlacementStateChanged";
    public static unityAdsReady = "unityAdsReady";
    public static unityAdsDidError = "unityAdsDidError";
    public static unityAdsDidStart = "unityAdsDidStart";
    public static unityAdsDidFinish = "unityAdsDidFinish";
}

export class MultiAdsSDK {
    private static instance : MultiAdsSDK;
    public static getInstance(): MultiAdsSDK {
        if (!MultiAdsSDK.instance) {
            MultiAdsSDK.instance = new MultiAdsSDK();
        }
        return MultiAdsSDK.instance;
    }

    private initialized = false;

    public initAds() {
        if (!this.checkSDKAds()) {
            return;
        }

        if (this.initialized) {
            return;
        }

        cc.log('SDK ====== Init UnityAds');
        this.registUnityAdsListener();
        sdkbox.PluginUnityAds.init();
        this.initialized = true;
    }

    registUnityAdsListener(){
        sdkbox.PluginUnityAds.setListener({
            unityAdsDidClick: function(placementId) {
                cc.systemEvent.emit(UnityAdsEvent.UnityAdsEvent, UnityAdsEvent.unityAdsDidClick, {
                    placementId : placementId
                });
            },

            unityAdsPlacementStateChanged: function(placementId, oldState, newState) {
                cc.systemEvent.emit(UnityAdsEvent.UnityAdsEvent, UnityAdsEvent.unityAdsPlacementStateChanged, {
                    placementId: placementId, 
                    oldState: oldState, 
                    newState: newState}
                );
            },
            unityAdsReady: function(placementId) {
                cc.systemEvent.emit(UnityAdsEvent.UnityAdsEvent, UnityAdsEvent.unityAdsReady, {
                    placementId : placementId
                });
            },
            unityAdsDidError: function(error, message) {
                cc.systemEvent.emit(UnityAdsEvent.UnityAdsEvent, UnityAdsEvent.unityAdsDidError, {
                    error: error,
                    message: message
                });
            },
            unityAdsDidStart: function(placementId) {
                cc.audioEngine.pauseAll();
                cc.systemEvent.emit(UnityAdsEvent.UnityAdsEvent, UnityAdsEvent.unityAdsDidStart, {
                    placementId : placementId
                });
            },
            unityAdsDidFinish: function(placementId, state) {
                cc.audioEngine.resumeAll();
                cc.systemEvent.emit(UnityAdsEvent.UnityAdsEvent, UnityAdsEvent.unityAdsDidFinish, {
                    placementId : placementId,
                    state: state
                });
            }
        })
    }

    unregistUnityAdsListener(){
        sdkbox.PluginUnityAds.removeListener();
    }

    public checkSDKAds() {
        if (!cc.sys.isNative) {
            return false;
        }

        if (sdkbox && sdkbox.PluginUnityAds){
            return true;
        }
        return false;
    }

    public showInterstitialAds() {
        if (!this.checkSDKAds()) {
            return;
        }
        this.showAds('Interstitial');
    }

    public showBannerAds() {
        if (!this.checkSDKAds()) {
            return;
        }
        this.showAds('banner');
    }

    protected showAds(placementId: string) {
        try {
            if (sdkbox.PluginUnityAds.isReady(placementId)) {
                sdkbox.PluginUnityAds.setBannerPosition(1);
                sdkbox.PluginUnityAds.show(placementId);
                cc.log('SDK ====== ADS SHOW', placementId);
            } else {
                cc.log('SDK ====== ADS Not Ready', placementId);
            }
        } catch (exception) {

        }
    }

    public hideAds() {
        if (!this.checkSDKAds()) {
            return;
        }
        cc.log('SDK ======= HIDE ADS');
        sdkbox.PluginUnityAds.hide();
    }
}
