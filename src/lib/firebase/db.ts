import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";

export interface UserData {
  favoriteSongs: string[];
  knownChords: string[];
}

export const getUserData = async (uid: string): Promise<UserData | null> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as UserData;
  }
  return null;
};

export const updateUserData = async (uid: string, data: Partial<UserData>) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    await updateDoc(docRef, data);
  } else {
    await setDoc(docRef, {
      favoriteSongs: data.favoriteSongs || [],
      knownChords: data.knownChords || ['C', 'G', 'Am', 'F'],
      ...data
    });
  }
};
