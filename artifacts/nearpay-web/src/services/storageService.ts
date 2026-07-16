/**
 * Firebase Storage helpers.
 *
 * Folder layout:
 *   merchant_logos/<merchantId>/<filename>
 *   customer_avatars/<customerId>/<filename>
 *   attachments/<merchantId>/<debtId>/<filename>
 */
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../lib/firebase';

// ─── Upload helpers ───────────────────────────────────────────────────────────

export async function uploadMerchantLogo(
  merchantId: string,
  file: File
): Promise<string> {
  const storageRef = ref(storage, `merchant_logos/${merchantId}/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function uploadCustomerAvatar(
  customerId: string,
  file: File
): Promise<string> {
  const storageRef = ref(storage, `customer_avatars/${customerId}/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function uploadDebtAttachment(
  merchantId: string,
  debtId: string,
  file: File
): Promise<string> {
  const storageRef = ref(
    storage,
    `attachments/${merchantId}/${debtId}/${Date.now()}_${file.name}`
  );
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// ─── Delete helper ────────────────────────────────────────────────────────────

export async function deleteStorageFile(url: string): Promise<void> {
  const storageRef = ref(storage, url);
  await deleteObject(storageRef);
}
