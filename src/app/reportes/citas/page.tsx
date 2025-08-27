import { getCitas } from "@/services/citasService";
import ReporteCitasClient from "@/components/reportes/ReporteCitasClient";

export default async function ReporteCitasPage() {
	const citas = await getCitas();
	return <ReporteCitasClient citas={citas} />;
}
