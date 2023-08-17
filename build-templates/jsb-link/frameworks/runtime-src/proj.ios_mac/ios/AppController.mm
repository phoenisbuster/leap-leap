/****************************************************************************
 Copyright (c) 2010-2013 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

#import "AppController.h"
#import "cocos2d.h"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#import "AppDelegate.h"
#import "RootViewController.h"
#import "SDKWrapper.h"
#import "platform/ios/CCEAGLView-ios.h"
#import "IOSNativeUtils.h"
#import <Firebase/Firebase.h>
#import <UserNotifications/UserNotifications.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKLoginKit/FBSDKLoginManager.h>
#include <FBSDKShareKit/FBSDKShareKit.h>
#import <ZaloSDK/ZaloSDK.h>
#import <Foundation/Foundation.h>

using namespace cocos2d;
@interface AppController () <UNUserNotificationCenterDelegate, FBSDKSharingDelegate>
@end

@implementation AppController

Application* app = nullptr;
@synthesize window;

#pragma mark -
#pragma mark Application lifecycle

static AppController *_shareInstance = nil;

NSString *deepLink = @"";
NSString *networkCheckLink = @"";

UIViewController *view;

NSString *const kGCMMessageIDKey = @"gcm.message_id";
NSString *const ZALO_APP_ID = @"3245225691777441321";
NSTimer *ssidTimer;

FBSDKLoginManager *loginManager;
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [[SDKWrapper getInstance] application:application didFinishLaunchingWithOptions:launchOptions];
    // Add the view controller's view to the window and display.
    float scale = [[UIScreen mainScreen] scale];
    CGRect bounds = [[UIScreen mainScreen] bounds];
    window = [[UIWindow alloc] initWithFrame: bounds];
    
    // cocos2d application instance
    app = new AppDelegate(bounds.size.width * scale, bounds.size.height * scale);
    app->setMultitouch(true);
    
    // Use RootViewController to manage CCEAGLView
    _viewController = [[RootViewController alloc]init];
#ifdef NSFoundationVersionNumber_iOS_7_0
    _viewController.automaticallyAdjustsScrollViewInsets = NO;
    _viewController.extendedLayoutIncludesOpaqueBars = NO;
    _viewController.edgesForExtendedLayout = UIRectEdgeAll;
#else
    _viewController.wantsFullScreenLayout = YES;
#endif
    // Set RootViewController to window
    if ( [[UIDevice currentDevice].systemVersion floatValue] < 6.0)
    {
        // warning: addSubView doesn't work on iOS6
        [window addSubview: _viewController.view];
    }
    else
    {
        // use this method on ios6
        [window setRootViewController:_viewController];
    }
    
    [window makeKeyAndVisible];
    view = _viewController;
    
    [[UIApplication sharedApplication] setStatusBarHidden:YES];
    [[UIApplication sharedApplication] setIdleTimerDisabled:YES];
    
    [[FBSDKApplicationDelegate sharedInstance] application:application
      didFinishLaunchingWithOptions:launchOptions];
    [[ZaloSDK sharedInstance] initializeWithAppId:ZALO_APP_ID];
    
    //run the cocos2d-x game scene
    app->start();
    [FIRApp configure];
    
    if ([UNUserNotificationCenter class] != nil) {
      // iOS 10 or later
      // For iOS 10 display notification (sent via APNS)
      [UNUserNotificationCenter currentNotificationCenter].delegate = self;
      UNAuthorizationOptions authOptions = UNAuthorizationOptionAlert |
          UNAuthorizationOptionSound | UNAuthorizationOptionBadge;
      [[UNUserNotificationCenter currentNotificationCenter]
          requestAuthorizationWithOptions:authOptions
          completionHandler:^(BOOL granted, NSError * _Nullable error) {
            // ...
          }];
    } else {
      // iOS 10 notifications aren't available; fall back to iOS 8-9 notifications.
      UIUserNotificationType allNotificationTypes =
      (UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge);
      UIUserNotificationSettings *settings =
      [UIUserNotificationSettings settingsForTypes:allNotificationTypes categories:nil];
      [application registerUserNotificationSettings:settings];
    }

    [application registerForRemoteNotifications];
    _shareInstance = self;
    return YES;
}

-(void) initNetworkCheck:(NSString *) link{
    networkCheckLink = [[NSString alloc] initWithString:link];
    NSLog (@"initNetworkCheck %@", networkCheckLink);
    
    if(ssidTimer!=NULL) return;
    ssidTimer = [NSTimer scheduledTimerWithTimeInterval:1.0 target:self selector:@selector(checkNetwork) userInfo:nil repeats:YES];
}

-(void) stopNetworkCheck{
    if(ssidTimer == NULL) return;
    [ssidTimer invalidate];
    ssidTimer = NULL;
}

- (void)checkNetwork {
    if(networkCheckLink == NULL) return;
    CFNetDiagnosticRef dReference;
    dReference = CFNetDiagnosticCreateWithURL (NULL, (__bridge CFURLRef)[NSURL URLWithString:networkCheckLink]);

    CFNetDiagnosticStatus status;
    status = CFNetDiagnosticCopyNetworkStatusPassively (dReference, NULL);

    CFRelease (dReference);

    std::string hasNetwork = "true";
    if ( status == kCFNetDiagnosticConnectionUp )
    {
        hasNetwork = "true";
    }
    else
    {
        hasNetwork = "false";
    }
    std::string result = "cc.systemEvent.emit(\"ON_NETWORK_STATUS_CHANGED\", \"" + hasNetwork + "\");";
    se::ScriptEngine::getInstance()->evalString(result.c_str());
}

+ (UIViewController *)getViewController{
    return  view;
}


+ (AppController *)sharedInstance{
    return _shareInstance;
}


- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {

  BOOL handledFb = [[FBSDKApplicationDelegate sharedInstance] application:application
    openURL:url
    sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
    annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
  ];
        
   BOOL handledZalo = [[ZDKApplicationDelegate sharedInstance] application:application openURL:url options:options];
    
    BOOL handledDeeplink = [self application:application
                       openURL:url
             sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
                    annotation:options[UIApplicationOpenURLOptionsAnnotationKey]];

    
  // Add any custom logic here.
  return handledFb||handledZalo||handledDeeplink;
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication
         annotation:(id)annotation {

  BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application
    openURL:url
    sourceApplication:sourceApplication
    annotation:annotation
  ];
    
    FIRDynamicLink *dynamicLink = [[FIRDynamicLinks dynamicLinks] dynamicLinkFromCustomSchemeURL:url];
    BOOL handledDeeplink = NO;
      if (dynamicLink) {
        if (dynamicLink.url) {
            deepLink = dynamicLink.url.absoluteString;
          // Handle the deep link. For example, show the deep-linked content,
          // apply a promotional offer to the user's account or show customized onboarding view.
          // ...
        } else {
          // Dynamic link has empty deep link. This situation will happens if
          // Firebase Dynamic Links iOS SDK tried to retrieve pending dynamic link,
          // but pending link is not available for this device/App combination.
          // At this point you may display default onboarding view.
        }
          handledDeeplink = YES;
      }
  // Add any custom logic here.
  return handled || handledDeeplink;
}

- (BOOL)application:(UIApplication *)application
continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:
#if defined(__IPHONE_12_0) && (__IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_12_0)
(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> *_Nullable))restorationHandler {
#else
    (nonnull void (^)(NSArray *_Nullable))restorationHandler {
#endif  // __IPHONE_12_0
  BOOL handled = [[FIRDynamicLinks dynamicLinks] handleUniversalLink:userActivity.webpageURL
                                                          completion:^(FIRDynamicLink * _Nullable dynamicLink,
                                                                       NSError * _Nullable error) {
                                                            // [START_EXCLUDE]
  
      if(dynamicLink == nil){
          deepLink = @"dynamicLink null";
      }else if(dynamicLink.url == nil){
          deepLink = @"dynamicLink.url null";
      }else if (dynamicLink.url.absoluteString == nil){
          deepLink = @"dynamicLink.url.absoluteString null";
      }else{
          if([dynamicLink.url.absoluteString isKindOfClass:[NSString class]]) {
              // Delay 3 seconds
              dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(3.0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                  [IOSNativeUtils callJS:@"FireBaseDynamicLinkHandleComp_handleFirstTimeDynamicLinkFireBase",dynamicLink.url.absoluteString,nil];
              });
          }
      }
    
      [IOSNativeUtils callJS:@"FireBaseDynamicLinkHandleComp_handleDynamicLinkFireBase",dynamicLink.url.absoluteString,nil];
                                                            // [END_EXCLUDE]
                                                          }];
        
    
  // [END_EXCLUDE]
  return handled;
}
- (void)applicationWillResignActive:(UIApplication *)application {
    /*
     Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
     Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
     */
    app->onPause();
    [[SDKWrapper getInstance] applicationWillResignActive:application];
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    /*
     Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
     */
    app->onResume();
    [[SDKWrapper getInstance] applicationDidBecomeActive:application];
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    /*
     Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
     If your application supports background execution, called instead of applicationWillTerminate: when the user quits.
     */
    [[SDKWrapper getInstance] applicationDidEnterBackground:application]; 
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    /*
     Called as part of  transition from the background to the inactive state: here you can undo many of the changes made on entering the background.
     */
    [[SDKWrapper getInstance] applicationWillEnterForeground:application]; 
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    [[SDKWrapper getInstance] applicationWillTerminate:application];
    delete app;
    app = nil;
}

    - (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
      // If you are receiving a notification message while your app is in the background,
      // this callback will not be fired till the user taps on the notification launching the application.
      // TODO: Handle data of notification

      // With swizzling disabled you must let Messaging know about the message, for Analytics
      // [[FIRMessaging messaging] appDidReceiveMessage:userInfo];

      // [START_EXCLUDE]
      // Print message ID.
      if (userInfo[kGCMMessageIDKey]) {
        NSLog(@"Message ID: %@", userInfo[kGCMMessageIDKey]);
      }
      // [END_EXCLUDE]

      // Print full message.
      NSLog(@"%@", userInfo);
    }

    // [START receive_message]
    - (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
        fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
      // If you are receiving a notification message while your app is in the background,
      // this callback will not be fired till the user taps on the notification launching the application.
      // TODO: Handle data of notification

      // With swizzling disabled you must let Messaging know about the message, for Analytics
      // [[FIRMessaging messaging] appDidReceiveMessage:userInfo];

      // [START_EXCLUDE]
      // Print message ID.
      if (userInfo[kGCMMessageIDKey]) {
        NSLog(@"Message ID: %@", userInfo[kGCMMessageIDKey]);
      }
      // [END_EXCLUDE]

      // Print full message.
      NSLog(@"%@", userInfo);

      completionHandler(UIBackgroundFetchResultNewData);
    }
    // [END receive_message]

    // [START ios_10_message_handling]
    // Receive displayed notifications for iOS 10 devices.
    // Handle incoming notification messages while app is in the foreground.
    - (void)userNotificationCenter:(UNUserNotificationCenter *)center
           willPresentNotification:(UNNotification *)notification
             withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
      NSDictionary *userInfo = notification.request.content.userInfo;

      // With swizzling disabled you must let Messaging know about the message, for Analytics
      // [[FIRMessaging messaging] appDidReceiveMessage:userInfo];

      // [START_EXCLUDE]
      // Print message ID.
      if (userInfo[kGCMMessageIDKey]) {
        NSLog(@"Message ID: %@", userInfo[kGCMMessageIDKey]);
      }
      // [END_EXCLUDE]

      // Print full message.
      NSLog(@"%@", userInfo);

      // Change this to your preferred presentation option
      completionHandler(UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionAlert);
    }

    // Handle notification messages after display notification is tapped by the user.
    - (void)userNotificationCenter:(UNUserNotificationCenter *)center
    didReceiveNotificationResponse:(UNNotificationResponse *)response
             withCompletionHandler:(void(^)(void))completionHandler {
      NSDictionary *userInfo = response.notification.request.content.userInfo;
      if (userInfo[kGCMMessageIDKey]) {
        NSLog(@"Message ID: %@", userInfo[kGCMMessageIDKey]);
      }

      // With swizzling disabled you must let Messaging know about the message, for Analytics
      // [[FIRMessaging messaging] appDidReceiveMessage:userInfo];

      // Print full message.
      NSLog(@"%@", userInfo);

      completionHandler();
    }

    // [END ios_10_message_handling]

    // [START refresh_token]
    - (void)messaging:(FIRMessaging *)messaging didReceiveRegistrationToken:(NSString *)fcmToken {
        NSLog(@"FCM registration token: %@", fcmToken);
        // Notify about received token.
        NSDictionary *dataDict = [NSDictionary dictionaryWithObject:fcmToken forKey:@"token"];
        [[NSNotificationCenter defaultCenter] postNotificationName:
         @"FCMToken" object:nil userInfo:dataDict];
        // TODO: If necessary send token to application server.
        // Note: This callback is fired at each app startup and whenever a new token is generated.
    }
    // [END refresh_token]

    - (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
      NSLog(@"Unable to register for remote notifications: %@", error);
    }
    
    //[FACEBOOK]------------------
    - (void)initFacebook{
        loginManager = [[FBSDKLoginManager alloc] init];
    }
    - (void)loginFacebook{
        UIViewController *view = [AppController getViewController];
         [loginManager logInWithPermissions:@[@"public_profile", @"email"]
                                fromViewController:view handler:^(FBSDKLoginManagerLoginResult *result, NSError *error) {
           //TODO: process error or result.
             NSLog(@"FACEBOOK LOGIN ERROR: %@", error);
             if(error == NULL){
				NSString *token = [self getFacebookAccessToken];
    
				std::string tokenStr = "";
				if(token!=NULL)
					tokenStr = std::string([token UTF8String]);
				std::string result = "cc.systemEvent.emit(\"FACEBOOK_LOGIN_SUCCESS\", \"" + tokenStr + "\");";

				se::ScriptEngine::getInstance()->evalString(result.c_str());
             }
         }];
    }

    - (void) logoutFacebook{
        if(loginManager!=NULL) [loginManager logOut];
    }
    
    - (NSString *)getFacebookAccessToken{
        NSString *token = @"";
        token = [FBSDKAccessToken tokenString];
        return token;
    }

    - (void)shareFb:(NSString *)link{
        NSLog(@"FACEBOOK SHARE  FSFDSFSFSF");
        FBSDKShareLinkContent *content = [[FBSDKShareLinkContent alloc] init];
        [content setContentURL:[NSURL URLWithString:link]];

        FBSDKShareDialog *dialog = [[FBSDKShareDialog alloc] initWithViewController:view
                                                            content:content delegate:self];

        dialog.mode = FBSDKShareDialogModeAutomatic;
        [dialog show];
        if([dialog canShow])
            [dialog show];
        else
            NSLog(@"CANT SHOW SHARE DIALOG");


//        FBSDKLoginManager *login = [[FBSDKLoginManager alloc] init];


//        [loginManager logInWithPermissions:@[@"email"]fromViewController: [AppController getViewController] handler:^(FBSDKLoginManagerLoginResult *result, NSError *error)
//        {
//
//            if (error)
//            {
//            // Process error
//            }
//            else
//            {
//                FBSDKShareLinkContent *content = [[FBSDKShareLinkContent alloc] init];
////                content.contentURL = [NSURL URLWithString:@"https://developers.facebook.com/"];
////
//                FBSDKMessageDialog *messageDialog = [[FBSDKMessageDialog alloc] init];
//                messageDialog.delegate = self;
//
//                [messageDialog setShareContent:content];
//                if([messageDialog canShow])
//                    [messageDialog show];
//                else
//                    NSLog(@"CANT SHOW SHARE DIALOG");
//
//            }
//        }];
        
    }
    
    - (void)sharer:(nonnull id<FBSDKSharing>)sharer didCompleteWithResults:(nonnull NSDictionary<NSString *,id> *)results {
    }
    
    - (void)sharer:(nonnull id<FBSDKSharing>)sharer didFailWithError:(nonnull NSError *)error {
        NSLog(@"FACEBOOK SHARE ERROR: %@", error);
    }
    
    - (void)sharerDidCancel:(nonnull id<FBSDKSharing>)sharer {
        
    }

    //[END FACEBOOK]-----------------------------
    
#pragma mark -
#pragma mark Memory management

- (void)applicationDidReceiveMemoryWarning:(UIApplication *)application {
    /*
     Free up as much memory as possible by purging cached data objects that can be recreated (or reloaded from disk) later.
     */
}


- (void)saveQR:(NSString *) link{
    //re-generate qr image
        
        // Generation of QR code image
    NSData *qrCodeData = [link dataUsingEncoding:NSISOLatin1StringEncoding]; // recommended encoding
    CIFilter *qrCodeFilter = [CIFilter filterWithName:@"CIQRCodeGenerator"];
    [qrCodeFilter setValue:qrCodeData forKey:@"inputMessage"];
    [qrCodeFilter setValue:@"M" forKey:@"inputCorrectionLevel"]; //default of L,M,Q & H modes
    
    CIImage *qrCodeImage = qrCodeFilter.outputImage;

    CIContext *context = [CIContext contextWithOptions:nil];
    CGImageRef cgImage = [context createCGImage:qrCodeImage fromRect:[qrCodeImage extent]];
    UIImage* uiImage = [UIImage imageWithCGImage:cgImage];
    CGImageRelease(cgImage);
    
  
    UIImageWriteToSavedPhotosAlbum(uiImage, self,
                                      @selector(image:didFinishSavingWithError:contextInfo:),
                                      nil);
}
    
- (void)image:(UIImage *)image didFinishSavingWithError:(NSError *)error contextInfo:(void *)contextInfo
{
    if (error != nil) {
      std::string result = "cc.systemEvent.emit(\"SAVE_QR_CALLBACK\", \"\");";
      se::ScriptEngine::getInstance()->evalString(result.c_str());
    } else {
      std::string result = "cc.systemEvent.emit(\"SAVE_QR_CALLBACK\", \"QR_SAVED\");";
      se::ScriptEngine::getInstance()->evalString(result.c_str());
    }
}

    - (NSString *)getDeepLink{
        return deepLink;
    }

@end
