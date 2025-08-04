# Google Authentication Troubleshooting Guide

## Current Configuration

Your app is currently configured with these credentials:

- **Web Client ID**: `1012899577234-mkntpb2dq8b577rt66v0en9uea8a7ba8.apps.googleusercontent.com`
- **Android Client ID**: `500193017283-7j7f1jr226r1dkr8jej11umboprahk12.apps.googleusercontent.com`
- **Project ID**: `train-lrt`
- **Redirect URI**: `https://auth.expo.io/@anonymous/intelligent-lrt-management`
- **Scheme**: `intelligent-lrt-management`

## Common Error Messages

### "Error 401: deleted_client"

This means the OAuth client ID being used was deleted from Google Cloud Console or is invalid.

**Solution:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Verify your OAuth client IDs exist and are active
4. If needed, create new OAuth client IDs

### "response.type === 'dismiss'"

This happens when the Google Sign-In dialog is dismissed without completion.

**Solution:**
1. Verify redirect URIs in Google Cloud Console match exactly: `https://auth.expo.io/@anonymous/intelligent-lrt-management`
2. Make sure Authorized JavaScript Origins includes: `https://auth.expo.io`
3. Ensure your app.json scheme matches the URI path: `intelligent-lrt-management`

## Step-by-Step Verification Process

1. **Verify Google Cloud Console Setup**
   - Ensure the project exists and is active
   - Check that OAuth consent screen is configured
   - Verify OAuth client IDs are correctly set up with proper redirect URIs

2. **Verify App Configuration**
   - Check `app.json` has:
     ```json
     {
       "expo": {
         "scheme": "intelligent-lrt-management",
         "owner": "anonymous"
       }
     }
     ```
   - Confirm `googleAuth.js` has the correct client IDs and redirect URI

3. **Clear Cache and Run**
   ```
   npm run clear-cache
   npm run android-high-mem
   ```

4. **Test with Development Login Option**
   - Use the development login buttons we added as a fallback

## Debugging Tips

- Check the console logs for detailed authentication flow information
- Use a physical device for testing (sometimes emulators have issues with auth flows)
- Try testing on both Android and iOS if possible
- Make sure your Google account is not restricted by organizational policies

## If All Else Fails

Use the development login mode we've added to continue testing your app's functionality while troubleshooting Google Auth.
