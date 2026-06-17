import { getAllComments } from "@/app/actions";
import RosterClient from "@/components/RosterClient";

export default async function RosterPage() {
  const comments = await getAllComments();

  return <RosterClient initialComments={comments} />;
}
