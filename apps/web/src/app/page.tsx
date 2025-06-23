import { redirect } from "next/navigation";

export default function Page() {
    redirect("/waterMap");
    return <div>Redirecting...</div>;
}