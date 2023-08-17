import Native from "../Script/Utils/Native";
import ConnectDefine from "./ConnectDefine";
import GameUtils from "./GameUtils";

const { ccclass, property } = cc._decorator;
export class InfoBundle {
  /**
   *
   */
  constructor(_link: string, _md5Version: string, _version: string) {
    this.link = _link;
    this.md5Version = _md5Version;
    this.version = _version;
  }
  public link: string = "";
  public md5Version: string = "";
  public version: string = "";
}
@ccclass
export default class BundleManager {
  private static instance: BundleManager = null;
  private indexConfig: number = 0;

  public static getInstance() {
    if (!BundleManager.instance) {
      BundleManager.instance = new BundleManager();
    }
    return BundleManager.instance;
  }
  private topicHome: number = 2000;
  private bundleInternal: string = "internal";
  private bundleMain: string = "main";
  private bundleResource: string = "resources";
  private bundlePortalResource: string = "PortalResources";
  private bundleCardLobby: string = "LobbyCardBundle";

  public loadBundleGame(link: string, callback = null) {
    var bundle = cc.assetManager.getBundle(link);
    if (!bundle) {
      cc.assetManager.loadBundle(link, function (err, bundle) {
        if (err) {
          return console.error(err);
        }
        console.log("load bundle successfully.");
        callback && callback(bundle);
      });
    } else {
      callback && callback(bundle);
    }
  }

  public loadConfigGame(callback = null) {
    var self = this;
    let t = Date.now();
    let link = ConnectDefine.addressConfig[this.indexConfig] + "&t=" + t;
    cc.log("loadConfigGame " + link);
    let linkConfig = "";
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      console.log("xhr.readyState " + xhr.readyState + " " + xhr.status + " " + xhr.statusText);
      if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
        var response = JSON.parse(xhr.responseText);
        if (response.url) {
          linkConfig = response.url;
          self.getConfigGame(linkConfig, callback);
        } else {
          //retry
          self.retryLoadConfig(callback, xhr.responseText);
        }
      } else if (xhr.readyState == 4) {
        self.retryLoadConfig(callback, xhr.responseText);
      }
    };
    xhr.ontimeout = function () {
      console.log("ON TIME OUT");
      self.loadGameCurrent();
    };

    xhr.onerror = function () {
      console.log("ON ERROR");
      self.loadGameCurrent();
    };

    xhr.timeout = 20000;
    xhr.open("GET", link, true);
    xhr.send();
  }

  private retryLoadConfig(callback, responseText: string) {
    this.indexConfig++;
    if (this.indexConfig >= ConnectDefine.addressConfig.length) {
      console.log(responseText);
      this.loadGameCurrent();
      return;
    } else {
      this.loadConfigGame(callback);
    }
  }

  public getConfigGame(linkConfig: string, callback = null) {
    var self = this;
    var currentResponse = null;
    let t = Date.now();
    // let linkConfig = ConnectDefine.addressConfig + "?t=" + t;
    linkConfig = linkConfig + "?t=" + t;
    cc.log("getConfigGame " + linkConfig);
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
        var response = JSON.parse(xhr.responseText);
        if (response.is_update) {
          currentResponse = response;
          // cc.log("response  " + currentResponse);
        } else {
          currentResponse = null;
        }
      } else {
        currentResponse = null;
      }

      if (currentResponse != null) {
        self.checkConfigResponse(currentResponse, callback);
      } else {
        self.loadGameCurrent();
      }
    };
    xhr.open("GET", linkConfig, true);
    xhr.send();
  }

  private checkConfigResponse(response, callback = null) {
    var currentConfig = response;
    let internalDomain: InfoBundle;
    let mainDomain: InfoBundle;
    let resourcesDomain: InfoBundle;
    let portalResourcesDomain: InfoBundle;
    let lobbyCardDomain: InfoBundle;
    if (currentConfig) {
      try {
        cc.log("response currentConfig " + JSON.stringify(currentConfig));
        var listBundle = currentConfig.asset_bundles;
        listBundle.forEach((bundle) => {
          if (bundle) {
            let domainBundle = this.getDomainAssetBundleURL(currentConfig) + "/" + bundle.folder;
            if (bundle.topic == this.topicHome) {
              cc.log("domainBundle " + domainBundle);
              if (bundle.name == this.bundleInternal) {
                internalDomain = new InfoBundle(domainBundle, bundle.md5_version, bundle.version);
              } else if (bundle.name == this.bundleMain) {
                mainDomain = new InfoBundle(domainBundle, bundle.md5_version, bundle.version);
              } else if (bundle.name == this.bundlePortalResource) {
                portalResourcesDomain = new InfoBundle(domainBundle, bundle.md5_version, bundle.version);
              } else if (bundle.name == this.bundleResource) {
                resourcesDomain = new InfoBundle(domainBundle, bundle.md5_version, bundle.version);
              } else if (bundle.name == this.bundleCardLobby) {
                lobbyCardDomain = new InfoBundle(domainBundle, bundle.md5_version, bundle.version);
              }
            }
          }
        });
        switch (cc.sys.platform) {
          case cc.sys.ANDROID: {
            // Native.getInstance().call("changeAppIcon", true);
            break;
          }
        }
        this.loadGame(internalDomain, mainDomain, resourcesDomain, portalResourcesDomain, lobbyCardDomain);
        // callback();
      } catch (err) {
        cc.log("exception " + err);
      }
    }
  }

  private getDomainAssetBundleURL(currentConfig) {
    if (currentConfig.asset_bundle_domains && currentConfig.asset_bundle_domains.length > 0) {
      return currentConfig.asset_bundle_domains[0];
    }
  }

  public loadGame(internalDomain: InfoBundle, mainDomain: InfoBundle, resourcesDomain: InfoBundle, portalResourcesDomain: InfoBundle, lobbyCardDomain: InfoBundle) {
    let hasUpdate = false;
    let bundleRoot = [];
    let version, link;
    let newManifest = {
      bundles: bundleRoot,
      version: internalDomain.version,
    };
    version = "";
    bundleRoot.push({
      url: internalDomain.link,
      hash: internalDomain.md5Version,
    });

    bundleRoot.push({
      url: resourcesDomain.link,
      hash: resourcesDomain.md5Version,
    });

    bundleRoot.push({
      url: mainDomain.link,
      hash: mainDomain.md5Version,
    });

    bundleRoot.push({
      url: portalResourcesDomain.link,
      hash: portalResourcesDomain.md5Version,
    });

    bundleRoot.push({
      url: lobbyCardDomain.link,
      hash: lobbyCardDomain.md5Version,
    });

    // var currentConfig = cc.sys.localStorage.getItem("UptAssetManifest");
    // console.log("==> prev: ");
    // //console.log("==> curr: " + JSON.stringify(JSON.stringify(newManifest)));

    // if (currentConfig) {
    //   try {
    //     var currentManifest = JSON.parse(currentConfig);
    //     if (currentManifest && currentManifest.version) {
    //       if (this.versionCompareHandle(newManifest.version, currentManifest.version) > 0) {
    //         hasUpdate = true;
    //       }
    //     }
    //   } catch (err) {
    //     cc.sys.localStorage.removeItem("UptAssetManifest");
    //     hasUpdate = true;
    //   }
    // } else {
    //   hasUpdate = true;
    // }

    // if (hasUpdate == true) {
    cc.sys.localStorage.setItem("UptAssetManifest", JSON.stringify(newManifest));
    cc.audioEngine.stopAll();

    setTimeout(() => {
      cc.log("restart game");
      if (GameUtils.isNative()) {
        cc.game.restart();
      } else {
        window.location.reload();
      }
    }, 1000);

    // } else {
    //   //onContinue
    // }
  }

  public versionCompareHandle(versionA, versionB) {
    console.log("JS Custom Version Compare: version A is " + versionA + ", version B is " + versionB);
    var vA = versionA.split(".");
    var vB = versionB.split(".");
    for (var i = 0; i < vA.length; ++i) {
      var a = parseInt(vA[i]);
      var b = parseInt(vB[i] || 0);
      if (a === b) {
        continue;
      } else {
        return a - b;
      }
    }
    if (vB.length > vA.length) {
      return -1;
    } else {
      return 0;
    }
  }

  public loadGameCurrent() {
    cc.systemEvent.emit("Load_Game_Current");
  }
}
