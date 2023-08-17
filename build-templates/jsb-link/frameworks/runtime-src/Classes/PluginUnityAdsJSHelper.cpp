#include "PluginUnityAdsJSHelper.h"
#include "PluginUnityAds/PluginUnityAds.h"
#include "SDKBoxJSHelper.h"

#ifdef SDKBOX_JSBINDING_CC3
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"

namespace cocos2d = cc;
#else
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#endif

class UnityAdsListenerJS : public sdkbox::UnityAdsListener, public sdkbox::JSListenerBase
{
public:
    UnityAdsListenerJS() : sdkbox::JSListenerBase() {
    }

    void unityAdsDidClick(const std::string& placementId) {
        RUN_ON_MAIN_THREAD_BEGIN
        MAKE_V8_HAPPY
        se::ValueArray args;
        args.push_back(se::Value(placementId));
        invokeJSFun(funcName, args);
        RUN_ON_MAIN_THREAD_END
    }

    void unityAdsPlacementStateChanged(const std::string& placementId,
                                       sdkbox::PluginUnityAds::SBUnityAdsPlacementState oldState,
                                       sdkbox::PluginUnityAds::SBUnityAdsPlacementState newState) {
        RUN_ON_MAIN_THREAD_BEGIN
        MAKE_V8_HAPPY
        se::ValueArray args;
        args.push_back(se::Value(placementId));
        args.push_back(se::Value((int)oldState));
        args.push_back(se::Value((int)newState));
        invokeJSFun(funcName, args);
        RUN_ON_MAIN_THREAD_END
    }

    void unityAdsReady(const std::string& placementId) {
        RUN_ON_MAIN_THREAD_BEGIN
        MAKE_V8_HAPPY
        se::ValueArray args;
        args.push_back(se::Value(placementId));
        invokeJSFun(funcName, args);
        RUN_ON_MAIN_THREAD_END
    }

    void unityAdsDidError(sdkbox::PluginUnityAds::SBUnityAdsError error,
                          const std::string& message) {
        RUN_ON_MAIN_THREAD_BEGIN
        MAKE_V8_HAPPY
        se::ValueArray args;
        args.push_back(se::Value((int)error));
        args.push_back(se::Value(message));
        invokeJSFun(funcName, args);
        RUN_ON_MAIN_THREAD_END
    }

    void unityAdsDidStart(const std::string& placementId) {
        RUN_ON_MAIN_THREAD_BEGIN
        MAKE_V8_HAPPY
        se::ValueArray args;
        args.push_back(se::Value(placementId));
        invokeJSFun(funcName, args);
        RUN_ON_MAIN_THREAD_END
    }

    void unityAdsDidFinish(const std::string& placementId,
                           sdkbox::PluginUnityAds::SBUnityAdsFinishState state) {
        RUN_ON_MAIN_THREAD_BEGIN
        MAKE_V8_HAPPY
        se::ValueArray args;
        args.push_back(se::Value(placementId));
        args.push_back(se::Value((int)state));
        invokeJSFun(funcName, args);
        RUN_ON_MAIN_THREAD_END
    }
};


void unityads_register_constants(se::Object* unityads)
{
    se::Value v;
    cocos2d::ValueMap enums;
    enums.clear();
    enums["kUnityAdsErrorNotInitialized"] = 0;
    enums["kUnityAdsErrorInitializedFailed"] = 1;
    enums["kUnityAdsErrorInvalidArgument"] = 2;
    enums["kUnityAdsErrorVideoPlayerError"] = 3;
    enums["kUnityAdsErrorInitSanityCheckFail"] = 4;
    enums["kUnityAdsErrorAdBlockerDetected"] = 5;
    enums["kUnityAdsErrorFileIoError"] = 6;
    enums["kUnityAdsErrorDeviceIdError"] = 7;
    enums["kUnityAdsErrorShowError"] = 8;
    enums["kUnityAdsErrorInternalError"] = 9;

    ccvaluemap_to_seval(enums, &v);
    unityads->setProperty("SBUnityAdsError", v);

    enums.clear();
    enums["kUnityAdsFinishStateError"] = 0;
    enums["kUnityAdsFinishStateSkipped"] = 1;
    enums["kUnityAdsFinishStateCompleted"] = 2;

    ccvaluemap_to_seval(enums, &v);
    unityads->setProperty("SBUnityAdsFinishState", v);

    enums.clear();
    enums["kUnityAdsPlacementStateReady"] = 0;
    enums["kUnityAdsPlacementStateNotAvailable"] = 1;
    enums["kUnityAdsPlacementStateDisabled"] = 2;
    enums["kUnityAdsPlacementStateWaiting"] = 3;
    enums["kUnityAdsPlacementStateNoFill"] = 4;

    ccvaluemap_to_seval(enums, &v);
    unityads->setProperty("SBUnityAdsPlacementState", v);
}

static bool js_PluginUnityAdsJS_setListener(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc == 1)
    {
        UnityAdsListenerJS* nativeDelegate = dynamic_cast<UnityAdsListenerJS*>(sdkbox::PluginUnityAds::getListener());
        if (!nativeDelegate) {
            nativeDelegate = new (std::nothrow) UnityAdsListenerJS();
            sdkbox::PluginUnityAds::setListener(nativeDelegate);
        }
        nativeDelegate->setJSDelegate(args[0]);


        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
SE_BIND_FUNC(js_PluginUnityAdsJS_setListener)

extern se::Object* __jsb_sdkbox_PluginUnityAds_proto;
extern se::Class* __jsb_sdkbox_PluginUnityAds_class;
bool register_all_PluginUnityAdsJS_helper(se::Object* obj)
{
    auto pluginValue = sdkbox::getPluginValue(obj, "sdkbox.PluginUnityAds");
    auto plugin = pluginValue.toObject();
    plugin->defineFunction("setListener", _SE(js_PluginUnityAdsJS_setListener));

    unityads_register_constants(plugin);

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

