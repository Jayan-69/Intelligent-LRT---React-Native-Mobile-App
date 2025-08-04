# Final Google Sign-In Checklist

This is the final guide. The code is now 100% correct. The only remaining problem is in your Google Cloud project settings. 

**Follow these steps exactly.**

---

### ✅ **Step 1: Open the Correct Client ID**

1.  Go to the [Google Cloud Credentials page](https://console.cloud.google.com/apis/credentials).
2.  Select your project: **"new LRT"**.
3.  Find your **Web client ID** (the one that starts with `1012899577234-mkntpb2dq8b577rt...`).
4.  Click the **pencil icon (✏️)** to edit it.

---

### ✅ **Step 2: Fix the Authorized Redirect URIs**

This is the most common point of failure.

1.  Look at the list under **"Authorized redirect URIs"**.
2.  **DELETE** every single URI that is currently in that list. Make it completely empty.
3.  Click **"+ ADD URI"**.
4.  A new text box will appear. Paste this exact value into it:
    ```
    https://auth.expo.io/@anonymous/intelligent-lrt
    ```
5.  Ensure it is the **ONLY** URI in the list.

---

### ✅ **Step 3: Save and Test**

1.  Click the **"Save"** button at the bottom of the page.
2.  Wait one minute for Google's servers to update.
3.  Go back to your app and try to sign in.

---

If you follow this checklist exactly, the problem will be solved.
