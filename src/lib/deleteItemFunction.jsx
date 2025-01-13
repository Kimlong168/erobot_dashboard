import { db } from "../firebase-config";
import { doc, deleteDoc } from "firebase/firestore";

const deleteItemFucntion = async (id, database) => {
  try {
    const postDoc = doc(db, database, id);
    await deleteDoc(postDoc);
    console.log("Item deleted");
    return true; // Resolve the promise with true upon successful deletion
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error; // Re-throw the error so that it can be caught by the caller if needed
  }
};

export default deleteItemFucntion;
