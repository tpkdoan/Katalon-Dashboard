import { ConversationLogDetail } from "../../components/ConversationLogDetail";

export default function ConversationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <ConversationLogDetail conversationId={params.id} />;
}
