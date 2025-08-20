import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function AdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="min-w-0">
				<div className="flex items-center gap-4 mb-4 p-4 border-b-2">
					<SidebarTrigger />
					<p>Administración</p>
				</div>
				<main className="px-5">{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
