// import { FeedbackDetails } from "./../../components/FeedbackDetails";

// export default function FeedbackDetailPage({ params }: { params: { id: string } }) {
//     return <FeedbackDetails feedbackId={params.id} />;
// }


import { FeedbackDetails } from "../../components/FeedbackDetails";

// TEMP: force override PageProps constraint
export default function FeedbackDetailPage({ params }: any) {
    return <FeedbackDetails feedbackId={params.id} />;
}
