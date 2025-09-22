import type { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

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
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Crear consulta para productos activos
    const productsRef = collection(db, 'products');
    const activeProductsQuery = query(
      productsRef,
      where('status', '==', 'active'),
    );
    const snapshot = await getDocs(activeProductsQuery);

    const products: any[] = [];
    snapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    return res.status(200).json(products);
  } catch (error: any) {
    console.error('Error fetching active products:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
