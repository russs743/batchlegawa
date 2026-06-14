import { getComments } from "@/app/actions";
import RosterClient from "@/components/RosterClient";

export default async function RosterPage() {
  const comments = await getComments();

  return <RosterClient initialComments={comments} />;
}
