package org.cocos2dx.javascript;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.zing.zalo.zalosdk.core.helper.Base64;
import com.zing.zalo.zalosdk.oauth.FeedData;
import com.zing.zalo.zalosdk.oauth.LoginVia;
import com.zing.zalo.zalosdk.oauth.OAuthCompleteListener;
import com.zing.zalo.zalosdk.oauth.OauthResponse;
import com.zing.zalo.zalosdk.oauth.OpenAPIService;
import com.zing.zalo.zalosdk.oauth.ZaloOpenAPICallback;
import com.zing.zalo.zalosdk.oauth.ZaloPluginCallback;
import com.zing.zalo.zalosdk.oauth.ZaloSDK;
import com.zing.zalo.zalosdk.oauth.ZaloSDKApplication;
import com.zing.zalo.zalosdk.oauth.model.ErrorResponse;

import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

public class GameZalo {
    OAuthCompleteListener listener;
    Activity activity;
    String code_verifier;
    String code_challenge;
    String access_token;
    String refresh_token;
    String oaCode;

    final String TAG = "ZALO";

    public String generateCodeVerifier()  {
        SecureRandom secureRandom = new SecureRandom();
        byte[] codeVerifier = new byte[32];
        secureRandom.nextBytes(codeVerifier);
        return Base64.encodeWebSafe(codeVerifier, false);
    }

    public String generateCodeChallange(String codeVerifier) {
        byte[] bytes = new byte[0];
        try {
            bytes = codeVerifier.getBytes("US-ASCII");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        MessageDigest messageDigest = null;
        try {
            messageDigest = MessageDigest.getInstance("SHA-256");
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        messageDigest.update(bytes, 0, bytes.length);
        byte[] digest = messageDigest.digest();
        return Base64.encodeWebSafe(digest, false);
    }

    public void init(Activity activity){
        this.activity = activity;
        ZaloSDKApplication.wrap(activity.getApplication());
        listener = new OAuthCompleteListener() {
            @Override
            public void onAuthenError(ErrorResponse errorResponse) {
                //Login fail
                Log.e(TAG, "login fail");
            }

            @Override
            public void onGetOAuthComplete(OauthResponse response) {
                String code = response.getOauthCode();
                oaCode = code;
                Log.e(TAG, "login success");

                //login success
            }
        };

        code_verifier = generateCodeVerifier();
        code_challenge = generateCodeChallange(code_verifier);
    }

    public void login(){
        ZaloSDK.Instance.authenticateZaloWithAuthenType
                (activity, LoginVia.APP_OR_WEB, code_challenge, listener);
    }

    public void onActivityResult(Activity activity, int reqCode, int resCode, Intent d){
        ZaloSDK.Instance.onActivityResult(activity, reqCode, resCode, d);
    }

    public void getAccessTokenRequest() {
        ZaloSDK.Instance.getAccessTokenByOAuthCode(activity.getApplicationContext(), oaCode, code_verifier,
                data -> {
                    int err = data.optInt("error");
                    if (err == 0) {
                        access_token = data.optString("access_token");
                        refresh_token = data.optString("refresh_token");
                        long expires_in = Long.parseLong(data.optString("expires_in"));
                        Log.e(TAG, access_token);
                    }
                });
    }

    public String getAccessToken(){
        return access_token;
    }

    public  void share(String link){
        ZaloPluginCallback callback = (b, i, s, s1) -> Log.d(TAG,  s + " ---- " + s1);
        FeedData feed = new FeedData();
//        feed.setMsg("Prefill message");
        feed.setLink(link);
//        feed.setLinkTitle("Zing News");
//        feed.setLinkSource("http://news.zing.vn");
//        feed.setLinkThumb(new String[] {"http://img.v3.news.zdn.vn/w660/Uploaded/xpcwvovb/2015_12_15/cua_kinh_2.jpg"});
        OpenAPIService service = new OpenAPIService();
        service.shareFeed(activity, feed, callback);
    }
}
