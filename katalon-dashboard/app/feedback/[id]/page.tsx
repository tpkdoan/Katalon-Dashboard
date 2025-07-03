import { FeedbackDetails } from "./../../components/FeedbackDetails";

export default function FeedbackDetailPage({ params }: { params: { id: string } }) {
    return <FeedbackDetails feedbackId={params.id} />;
}

