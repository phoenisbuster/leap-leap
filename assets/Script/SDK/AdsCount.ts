// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { MultiAdsSDK } from "./MultiAdsSDK";

const {ccclass, property} = cc._decorator;

@ccclass
export default class AdsCount {
    public static NUM_OF_FAIL_TO_SHOW_ADS: number = 300;
    private static curCount: number = 0;

    static IncreaseFailCount(){
        AdsCount.curCount++;
    }

    static CheckCountForShowingAds(){
        if(AdsCount.curCount >= AdsCount.NUM_OF_FAIL_TO_SHOW_ADS){
            MultiAdsSDK.getInstance().showInterstitialAds();
            AdsCount.curCount = 0;
        }
    }
    
}
