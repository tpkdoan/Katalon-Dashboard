import {ConversationLogDetail} from "../../components/ConservationLogDetail";

// TEMP: force override PageProps constraint
export default function ConversationDetailPage({ params }: any) {
    return <ConversationLogDetail conversationId={params.id} />;
}
