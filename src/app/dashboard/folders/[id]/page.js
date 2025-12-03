import { redirect } from "next/navigation";

export default function FolderPage({ params }) {
  redirect(`/dashboard/folders/${params.id}/stages`);
}
