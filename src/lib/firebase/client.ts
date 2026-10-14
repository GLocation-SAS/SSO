import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-sso";
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key";
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`;

const firebaseConfig = {
  projectId,
  apiKey,
  authDomain,
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// Use emulator if configured
const emulatorHost = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST;
if (emulatorHost) {
  try {
    connectAuthEmulator(
      auth,
      `http://${emulatorHost}`,
      { disableWarnings: true }
    );
  } catch {
    // Ignorar si ya está conectado
  }
}

export { app, auth };
