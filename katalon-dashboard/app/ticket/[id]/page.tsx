import { TicketDetails } from "../../components/TicketDetails";

// TEMP: force override PageProps constraint
export default function TicketDetailPage({ params }: any) {
    return <TicketDetails ticketId={params.id} />;
}
