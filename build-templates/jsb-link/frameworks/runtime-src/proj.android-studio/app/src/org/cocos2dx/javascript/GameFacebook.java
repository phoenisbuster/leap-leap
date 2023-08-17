package org.cocos2dx.javascript;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;

import com.facebook.AccessToken;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;
import com.facebook.share.model.ShareLinkContent;
import com.facebook.share.widget.ShareDialog;
import com.zing.zalo.zalosdk.oauth.ZaloSDK;

import java.util.Arrays;

public class GameFacebook {
    /*FACEBOOK ------------------------------------------------------------*/
    CallbackManager callbackManager;
    Activity activity;
    public void initFacebook(Activity activity){
        this.activity = activity;
        callbackManager = CallbackManager.Factory.create();
        LoginManager.getInstance().registerCallback(callbackManager,
                new FacebookCallback<LoginResult>() {
                    @Override
                    public void onSuccess(LoginResult loginResult) {
                        JavascriptJavaBridge.call("FACEBOOK_LOGIN_SUCCESS", getAccessToken());
                    }

                    @Override
                    public void onCancel() {
                        // App code
                    }

                    @Override
                    public void onError(FacebookException exception) {
                        // App code
                    }
                });
    }

    public void loginFacebook(){
        AccessToken accessToken = AccessToken.getCurrentAccessToken();
        boolean isLoggedIn = accessToken != null && !accessToken.isExpired();
        if(!isLoggedIn)
            LoginManager.getInstance().logInWithReadPermissions(activity, Arrays.asList("public_profile"));
    }

    public void onActivityResult(Activity activity, int reqCode, int resCode, Intent d){
        if(callbackManager!=null)
            callbackManager.onActivityResult(reqCode, resCode, d);

    }

    public String getAccessToken(){
        AccessToken accessToken = AccessToken.getCurrentAccessToken();
        if(accessToken==null)   return "";
        else return accessToken.getToken();
    }
	
	 public void logout(){
        LoginManager.getInstance().logOut();
    }

//    public void getAccessToken(){
//        LoginManager.getInstance().retrieveLoginStatus(this, new LoginStatusCallback() {
//            @Override
//            public void onCompleted(AccessToken accessToken) {
//                if(accessToken!=null) Log.e("FACEBOOK", accessToken.getToken());
//                // User was previously logged in, can log them in directly here.
//                // If this callback is called, a popup notification appears that says
//                // "Logged in as <User Name>"
//            }
//            @Override
//            public void onFailure() {
//                // No access token could be retrieved for the user
//            }
//            @Override
//            public void onError(Exception exception) {
//                // An error occurred
//            }
//        });
//    }

    public void share(String link){
        ShareLinkContent content = new ShareLinkContent.Builder()
                .setContentUrl(Uri.parse(link))
                .build();
        ShareDialog shareDialog = new ShareDialog(activity);
        shareDialog.show(content, ShareDialog.Mode.FEED);
    }
    /*END FACEBOOK ------------------------------------------------------------*/
}
