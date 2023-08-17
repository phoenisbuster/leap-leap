import { MultiAdsSDK } from "../../../../Script/SDK/MultiAdsSDK";
import SDKBoxPlay from "../../../../Script/SDK/SDKBoxPlay";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CSamLoadingScene extends cc.Component {
  @property(cc.ProgressBar)
  protected sprProgress: cc.ProgressBar = null;

  @property(cc.Label)
  protected loadingLabel: cc.Label = null;

  protected processCurrent = 0;

  protected onLoad() {
  }

  protected start() {
    this.processCurrent = 0;

    SDKBoxPlay.getInstance().initSDKBoxPlay();
    MultiAdsSDK.getInstance().initAds();

    // cc.director.preloadScene(CSamGameDefine.GameScene, this.onProgress.bind(this), (error) => {
    //   cc.assetManager.loadBundle("CSamResources", (err, bundle) => {
    //     CSamPoolManager.gCI().preloadProgress(this.onProgress.bind(this), () => {
    //       cc.sys.garbageCollect();
    //       cc.director.loadScene(CSamGameDefine.GameScene);
    //     });
    //   })
    // });
  }

  showBannerAds(){
    MultiAdsSDK.getInstance().showBannerAds();
  }

  showInterstitialAds(){
    MultiAdsSDK.getInstance().showInterstitialAds();
  }

  private onProgress(completedCount, totalCount, item) {
    var progress = (completedCount / totalCount) * 1;
    var percent = Math.ceil(Math.min(Math.max(progress * 100, 0), 100));
    if (this.processCurrent < progress) {
      this.processCurrent = progress;
      this.sprProgress.progress = this.processCurrent;
      this.loadingLabel.string = percent.toString();
    }
  }

}
