import {
  ref,
  push,
  update,
  remove,
  get,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { database } from "../firebase/config";

export const useProducts = () => {
  const createProduct = async (productData) => {
    const productsRef = ref(database, "products");
    const newProductRef = push(productsRef);

    const data = {
      ...productData,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
    };

    await update(newProductRef, data);
    return newProductRef.key;
  };

  const updateProduct = async (productId, updates) => {
    const productRef = ref(database, `products/${productId}`);
    await update(productRef, {
      ...updates,
      updated_date: new Date().toISOString(),
    });
  };

  const deleteProduct = async (productId) => {
    const productRef = ref(database, `products/${productId}`);
    await remove(productRef);
  };

  const getProductsByReceiver = async (receiverEmail) => {
    const productsRef = ref(database, "products");
    const q = query(
      productsRef,
      orderByChild("receiver_email"),
      equalTo(receiverEmail),
    );
    const snapshot = await get(q);

    if (snapshot.exists()) {
      return Object.entries(snapshot.val()).map(([id, data]) => ({
        id,
        ...data,
      }));
    }
    return [];
  };

  const getProductsBySender = async (senderEmail) => {
    const productsRef = ref(database, "products");
    const q = query(
      productsRef,
      orderByChild("sender_email"),
      equalTo(senderEmail),
    );
    const snapshot = await get(q);

    if (snapshot.exists()) {
      return Object.entries(snapshot.val()).map(([id, data]) => ({
        id,
        ...data,
      }));
    }
    return [];
  };

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByReceiver,
    getProductsBySender,
  };
};
