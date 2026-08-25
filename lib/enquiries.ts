import { desc, eq } from "drizzle-orm";
import { getDb } from "../db";
import { enquiries as enquiriesTable } from "../db/schema";

export type Enquiry = {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  emailStatus: string;
  handled: boolean;
  createdAt: string;
};

export type EnquiryInput = Omit<Enquiry, "id" | "createdAt" | "handled" | "emailStatus">;

export async function saveEnquiry(input: EnquiryInput): Promise<number> {
  const [row] = await getDb()
    .insert(enquiriesTable)
    .values({ ...input, createdAt: new Date().toISOString() })
    .returning({ id: enquiriesTable.id });
  return row.id;
}

export async function recordEmailStatus(id: number, emailStatus: string): Promise<void> {
  await getDb().update(enquiriesTable).set({ emailStatus }).where(eq(enquiriesTable.id, id));
}

export async function listEnquiries(): Promise<Enquiry[]> {
  try {
    return await getDb()
      .select()
      .from(enquiriesTable)
      .orderBy(desc(enquiriesTable.createdAt), desc(enquiriesTable.id))
      .limit(200);
  } catch {
    return [];
  }
}

export async function setHandled(id: number, handled: boolean): Promise<void> {
  await getDb().update(enquiriesTable).set({ handled }).where(eq(enquiriesTable.id, id));
}

export function formatEnquiryDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso.includes("T") ? iso : `${iso.replace(" ", "T")}Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  });
}
