import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { ContactMessage, ContactMessageStatus, ContactMessageTopic } from "../types";

const COLLECTION_NAME = "contact_messages";
const LOCAL_STORAGE_KEY = "digitalplaygrid_contact_messages_cache";

export async function submitContactMessage(params: {
  name: string;
  email: string;
  subject: string;
  message: string;
  topic?: ContactMessageTopic;
  userId?: string;
  userEmail?: string;
}): Promise<{ success: boolean; messageId: string; message?: ContactMessage }> {
  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const newMessage: ContactMessage = {
    id: messageId,
    name: params.name || "Anonymous Creator",
    email: params.email,
    subject: params.subject || "Message from Digital Play Grid User",
    message: params.message,
    topic: params.topic || "general",
    userId: params.userId,
    userEmail: params.userEmail,
    status: "unread",
    createdAt: now,
    updatedAt: now,
  };

  // 1. Try Firestore Write
  try {
    const docRef = doc(db, COLLECTION_NAME, messageId);
    await setDoc(docRef, {
      ...newMessage,
      serverTime: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${COLLECTION_NAME}/${messageId}`);
    console.warn("Falling back to API and local cache for contact submission", error);
  }

  // 2. Also send to backend API endpoint
  try {
    await fetch("/api/contact/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMessage),
    });
  } catch (apiError) {
    console.warn("Could not post contact submission to /api/contact/submit", apiError);
  }

  // 3. Local Cache update
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    const list: ContactMessage[] = cached ? JSON.parse(cached) : [];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([newMessage, ...list]));
  } catch {}

  return { success: true, messageId, message: newMessage };
}

export async function fetchAllContactMessages(): Promise<ContactMessage[]> {
  const messages: ContactMessage[] = [];

  // Try Firestore fetch
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    snapshot.forEach((docSnap) => {
      messages.push(docSnap.data() as ContactMessage);
    });
    if (messages.length > 0) {
      return messages;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
  }

  // Try Server API fetch
  try {
    const res = await fetch("/api/contact/messages");
    if (res.ok) {
      const data = await res.json();
      if (data.messages && Array.isArray(data.messages)) {
        return data.messages;
      }
    }
  } catch (apiError) {
    console.warn("Failed to fetch messages from API endpoint", apiError);
  }

  // Fallback to local cache
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {}

  return [];
}

export async function updateMessageStatusInDb(
  id: string,
  status: ContactMessageStatus,
  adminNotes?: string
): Promise<boolean> {
  const now = new Date().toISOString();

  // Try Firestore update
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updatePayload: Record<string, any> = {
      status,
      updatedAt: now,
    };
    if (adminNotes !== undefined) {
      updatePayload.adminNotes = adminNotes;
    }
    await updateDoc(docRef, updatePayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
  }

  // Update server API
  try {
    await fetch("/api/contact/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, adminNotes }),
    });
  } catch (e) {
    console.warn("Failed to sync status update with API", e);
  }

  // Update local cache
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const list: ContactMessage[] = JSON.parse(cached);
      const updated = list.map((m) =>
        m.id === id ? { ...m, status, adminNotes: adminNotes ?? m.adminNotes, updatedAt: now } : m
      );
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }
  } catch {}

  return true;
}

export async function deleteMessageFromDb(id: string): Promise<boolean> {
  // Try Firestore delete
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
  }

  // Try Server API delete
  try {
    await fetch(`/api/contact/messages/${id}`, { method: "DELETE" });
  } catch (e) {
    console.warn("Failed to delete via API", e);
  }

  // Update local cache
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const list: ContactMessage[] = JSON.parse(cached);
      const updated = list.filter((m) => m.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }
  } catch {}

  return true;
}
