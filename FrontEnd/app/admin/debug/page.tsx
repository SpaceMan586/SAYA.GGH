import { notFound } from "next/navigation";
import AdminDebugClient from "./AdminDebugClient";

export default function AdminDebugPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <AdminDebugClient />;
}
