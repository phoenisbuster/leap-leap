//
//  IOSNativeUtils.h
//  
//
//  Created by Admin on 12/2/20.
//

#ifndef IOSNativeUtils_h
#define IOSNativeUtils_h

@interface IOSNativeUtils : NSObject
+ (void) callJS:(NSString *) eventName, ...;

+ (void) initFacebook;
+ (void) loginFacebook;
+ (NSString *) getFacebookAccessToken;
+ (void) shareFacebook:(NSString *) link;
+ (void) logoutFacebook;

+ (void) initZalo;
+ (void) loginZalo;
+ (NSString *) getZaloAccessToken;
+ (void) shareZalo	:(NSString *) link;
+ (void) shareTelegram	:(NSString *) link;
+ (NSString *) getAppVersion;
+ (NSString *) appName;
+ (void) getDeviceName   ;
+ (void) saveQR:(NSString *) link;

//Network check
+ (void) initNetworkCheck:(NSString *) link;
+ (void) stopNetworkCheck;
//end Network check

+ (NSString *) getDeepLink;
@end

#endif /* IOSNativeUtils_h */
