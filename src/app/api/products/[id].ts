import type { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// inicialización de Firebase (puede estar en /lib/firebase.ts)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const db = getFirestore();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { id } = req.query;

    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const ref = doc(db, 'products', id);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json({ id: snapshot.id, ...snapshot.data() });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
