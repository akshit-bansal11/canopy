# Firebase Console Setup Instructions

## 1. Create a Firebase Project (if you haven't already)

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and follow the setup steps.

## 2. Enable Authentication

1. In your Firebase project, go to **Build** > **Authentication** in the left sidebar.
2. Click **Get started**.
3. Select the **Sign-in method** tab.
4. Click on **Google**.
5. Toggle **Enable** to on.
6. Configure the **Project support email**.
7. Click **Save**.

## 3. Create a Firestore Database

1. Go to **Build** > **Firestore Database** in the left sidebar.
2. Click **Create database**.
3. Choose a **Location** (e.g., `nam5 (us-central)`).
4. Start in **Test mode** (for development) or **Production mode** (you will need to set up security rules later).
   - **Test mode** allows anyone with your database reference to view, edit, and delete all data for 30 days.
5. Click **Create**.

## 4. Get Firebase Config (Already done in your code, but for reference)

1. Go to **Project settings** (gear icon).
2. Scroll down to **Your apps**.
3. If you haven't added a web app, click the **</>** icon.
4. Copy the `firebaseConfig` object values into your `.env` file (which you seem to have already done).
