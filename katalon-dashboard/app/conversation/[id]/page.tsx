// import { ConversationLogDetail } from "../../components/ConversationLogDetail";

// export default function ConversationDetailPage({
//   params,
// }: {
//   params: { id: string };
// }) {
//   return <ConversationLogDetail conversationId={params.id} />;
// }

import { ConversationLogDetail } from "../../components/ConversationLogDetail";

// TEMP: force override PageProps constraint
export default function ConversationDetailPage({ params }: any) {
  return <ConversationLogDetail conversationId={params.id} />;
}
