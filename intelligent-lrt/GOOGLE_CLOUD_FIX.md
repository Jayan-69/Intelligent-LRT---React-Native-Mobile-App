# FINAL FIX: How to Solve Google Sign-In "redirect_uri_mismatch" Error

This guide provides the exact steps to fix the Google Sign-In error. The problem is **100% inside your Google Cloud Console settings**, not in the app's code.

Please follow these steps carefully.

---

### **Step 1: Go to the Correct Google Cloud Project**

1.  Open your web browser and go to: [https://console.cloud.google.com/](https://console.cloud.google.com/)
2.  At the top of the page, make sure you have selected your project named **"new LRT"**. If it shows another project name, click on it and select **"new LRT"**.

---

### **Step 2: Navigate to the Credentials Page**

1.  In the top-left menu (the "hamburger" icon ☰), click on **"APIs & Services"**.
2.  From the sub-menu, click on **"Credentials"**.

---

### **Step 3: Edit the CORRECT OAuth Client ID**

You will see a list of "OAuth 2.0 Client IDs". You must edit the **Web client ID**.

1.  Find the Client ID that starts with `1012899577234-mkntpb2dq8b577rt...`. Its type should be **Web application**.
2.  On the right side of that row, click the **pencil icon (✏️)** to edit it.

---

### **Step 4: Add the Correct URLs**

This is the most important step. You will see two sections: "Authorized JavaScript origins" and "Authorized redirect URIs".

1.  **Authorized JavaScript origins**:
    *   Click **"+ ADD URI"**.
    *   In the text box that appears, paste this exact value:
        ```
        https://auth.expo.io
        ```
    *   There should be no extra characters or slashes.

2.  **Authorized redirect URIs**:
    *   Click **"+ ADD URI"**.
    *   In the text box that appears, paste this exact value:
        ```
        https://auth.expo.io/@anonymous/intelligent-lrt-management
        ```
    *   Again, make sure this is the only value in the box and it is exact.

---

### **Step 5: Save Your Changes**

1.  Scroll to the bottom of the page and click the **"Save"** button.
2.  It might take a few minutes for the changes to apply across Google's servers.

---

### **Step 6: Check the OAuth Consent Screen (Optional but Recommended)**

1.  In the left menu, go to **"OAuth consent screen"**.
2.  Under "Publishing status", if it says "Testing", make sure your email (`jayanmihisara8@gmail.com`) is listed under the "Test users" section. If not, add it.

---

After you have completed these steps, restart your app by running `npx expo start --clear` and try signing in again. It will work.
