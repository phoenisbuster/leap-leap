#pragma once

#include "SDKBoxJSHelper.h"

#ifdef SDKBOX_JSBINDING_CC3
namespace se { class Object; }
#else

#include "base/ccConfig.h"

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

#endif

extern se::Object* __jsb_sdkbox_PluginSdkboxPlay_proto;
extern se::Class* __jsb_sdkbox_PluginSdkboxPlay_class;

bool js_register_sdkbox_PluginSdkboxPlay(se::Object* obj);
bool register_all_PluginSdkboxPlayJS(se::Object* obj);































