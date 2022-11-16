import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes,
  getMetadata
} from "firebase/storage";

const {
  REACT_APP_FIREBASE_AUTH_KEY,
  REACT_APP_FIREBASE_AUTH_DOMAIN,
  REACT_APP_FIREBASE_PROJECTID,
  REACT_APP_FIREBASE_STORAGE_BUCKET,
  REACT_APP_FIREBASE_MESSAGING_SENDERID,
  REACT_APP_FIREBASE_APPID,
  REACT_APP_FIREBASE_MEASUREMENTID
} = process.env;
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: REACT_APP_FIREBASE_AUTH_KEY,
  authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: REACT_APP_FIREBASE_PROJECTID,
  storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDERID,
  appId: REACT_APP_FIREBASE_APPID,
  measurementId: REACT_APP_FIREBASE_MEASUREMENTID
  //...
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function uploadFile(file) {
  const storageRef = ref(storage, `images/${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef)
    .then(async (url) => {
      return url;
    })
    .catch((error) => {
      console.error("error", error);
    });
}
