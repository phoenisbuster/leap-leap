
//
//  IOSNativeUtils.m
//  
//
//  Created by Admin on 12/2/20.
//

#import <Foundation/Foundation.h>
#import <AudioToolbox/AudioServices.h>
#include "IOSNativeUtils.h"
#import "JavascriptIOSBridge.h"
#include "cocos2d.h"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#import <ZaloSDK/ZaloSDK.h>
#include "AppController.h"

using namespace cocos2d;
using namespace JavascriptIOSBridge;
@implementation IOSNativeUtils : NSObject

// nhiều tham số, trước các tham số phải có chữ arg và tăng dần : ví dụ arg1, arg2 .....
+(void) testReceivedJSB:(NSString *)url arg1:(NSString *)token{
    NSLog(@"receivedJSB IOS %@ %@", url, token);
//    JavascriptIOSBridge::call(cbName,@[url,token]); them sau
    [self callJS:@"WSClient_Android_open",url,token,nil];
}

+(void) testReceivedJSB:(NSString *)url{
    NSLog(@"testReceivedJSB IOS %@", url);
}

+(void) copyToClipBoard:(NSString *)text{
    NSLog(@"copyToClipBoard");
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
    pasteboard.string = text;
}

+(void) passClipboard{
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
    NSLog(@"copyToClipBoard %@",pasteboard.string);
    [self callJS:@"pass_clip_board",pasteboard.string,nil];
}


+(void) vibrate{
    NSLog(@"vibrate");
    AudioServicesPlaySystemSound(kSystemSoundID_Vibrate);
}

+(void)callJS:(NSString *) eventName, ...{
    NSMutableString * res = [NSMutableString string];
    [res appendString:eventName];

    std::string str = "";

    va_list args;
    
    va_start(args,eventName);
//    NSLogv(eventName, args);
//    NSLog(@"This is args: %s", args);
    id arg = nil;
    while(( arg = va_arg(args, id))){
        NSLog(@"This is str: %s", str.c_str());
        NSLog(@"This is arg: %@", arg);
//        if(arg != nil){
           // NSLog(@"This is dynamicLink: %@", arg);
            arg = [NSString stringWithFormat:@"\"%@\"", arg];
            str = str + "," + [arg UTF8String];
//        }
    }
    va_end(args);

    eventName = [NSString stringWithFormat:@"\"%@\"", eventName];
    std::string name =[eventName UTF8String] ;
    std::string result = "cc.systemEvent.emit(" + name + str + ");";

    NSLog(@"callJS result %s", result.c_str());
    se::ScriptEngine::getInstance()->evalString(result.c_str());
}

+(void)initFacebook{
    NSLog(@"INIT FACEBOOK");
    [[AppController sharedInstance] initFacebook];
}

+ (void)loginFacebook{
    NSLog(@"LOGIN FACEBOOK");
    [[AppController sharedInstance] loginFacebook];
}

+ (void)logoutFacebook{
    NSLog(@"LOGOUT FACEBOOK");
    [[AppController sharedInstance] logoutFacebook];
}

+ (NSString *)getFacebookAccessToken{
    return [[AppController sharedInstance] getFacebookAccessToken];
}

+ (void)shareFacebook:(NSString *)link{
    NSLog(@"%@", [@"SHARE FACEBOOK" stringByAppendingString:link]);
    AppController *app = [AppController sharedInstance];
    [app shareFb:link];
}

+(void)initZalo{
    NSLog(@"INIT ZALO");
}

+ (void)loginZalo{
    NSLog(@"LOGIN ZALO");
}

+ (NSString *)getZaloAccessToken{
    return @"getZaloAccessToken";
}

+ (void)shareZalo:(NSString *)link{
    NSLog(@"%@", [@"SHARE ZALO " stringByAppendingString:link]);
    
      NSString *appName = [self appName];
    ZOFeed *feed = [[ZOFeed alloc] initWithLink:link appName:appName message:@"" others:NULL];
    UIViewController *view = [AppController getViewController] ;
    [[ZaloSDK sharedInstance] shareFeed:feed inController:view callback:^(ZOShareResponseObject *response) {
        if(response.isSucess){
            NSLog(@"SHARE SUCCESS");
        }else{
            NSLog(@"SHARE FAILED");
        }
    }];
}

+ (NSString *)appName {
    NSString *bundleIdentifier = [[NSBundle mainBundle] bundleIdentifier];
    NSBundle *bundle = [NSBundle bundleWithIdentifier:bundleIdentifier];
    return [bundle objectForInfoDictionaryKey:@"CFBundleDisplayName"];
}

+ (void)shareTelegram:(NSString *)link{
    NSURL *checkURL = [NSURL URLWithString:@"tg:msg_url?url="];
    NSString *shareString = [NSString stringWithFormat:@"%s%@", "https://telegram.me/share/url?url=", link];
    NSURL *shareURL = [NSURL URLWithString:shareString];  
    NSURL *storeURL = [NSURL URLWithString:@"itms-apps://itunes.apple.com/app/id686449807"];
    UIApplication *application = [UIApplication sharedApplication];
   
    if([application canOpenURL:checkURL]){
        [application openURL:shareURL options:@{} completionHandler:^(BOOL success) {}];
    }else{
        [application openURL:storeURL options:@{} completionHandler:^(BOOL success) {}];
    }
}

+ (UIViewController*) topMostController
{
    UIViewController *topController = [UIApplication sharedApplication].keyWindow.rootViewController;

    while (topController.presentedViewController) {
        topController = topController.presentedViewController;
    }

    return topController;
}


+ (NSString *)getAppVersion{
    NSString *version = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
    return version;
}

+ (void) getDeviceName{
    NSLog(@"getDeviceName");
    NSString* name = UIDevice.currentDevice.name;
    NSString* version = UIDevice.currentDevice.systemVersion;
    NSString* deviceName = [NSString stringWithFormat:@"%@ %@", name,version];
    [self callJS:@"event_getDeviceName",deviceName,nil];
}

+ (void) saveQR:(NSString *) link{
    [[AppController sharedInstance] saveQR:link];
}

+ (NSString *)getDeepLink{
    return [[AppController sharedInstance] getDeepLink];
}


//Network check
+ (void) initNetworkCheck:(NSString *) link{
    [[AppController sharedInstance] initNetworkCheck:link];
}
+ (void) stopNetworkCheck{
    [[AppController sharedInstance] stopNetworkCheck];
}
//end Network check
@end
