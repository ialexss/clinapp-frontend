import Link from "next/link";
import Image from "next/image";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
	User,
	Users,
	Home,
	Calendar,
	FileText,
	Stethoscope,
	Building,
	Microscope,
	ShoppingBag,
	Hospital,
	Activity,
} from "lucide-react";

// Menu items.
const items = [
	{
		title: "Inicio",
		url: "/admin",
		icon: Home,
	},
	{
		title: "Usuarios",
		url: "/admin/usuarios",
		icon: User,
	},
	{
		title: "Citas",
		url: "/admin/citas",
		icon: Calendar,
	},
	{
		title: "Consultas",
		url: "/admin/consultas",
		icon: FileText,
	},
	{
		title: "Analisis",
		url: "/admin/analisis",
		icon: Microscope,
	},
	{
		title: "Pacientes",
		url: "/admin/pacientes",
		icon: Users,
	},
	{
		title: "Medicos",
		url: "/admin/medicos",
		icon: Stethoscope,
	},
	{
		title: "Especialidades",
		url: "/admin/especialidades",
		icon: Building,
	},
];

export function AppSidebar() {
	return (
		<Sidebar variant="inset">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<div className="!bg-zinc-900  rounded-lg p-2 h-12">
								<a
									href="/admin"
									className="!bg-zinc-900 w-full p-2 flex items-center gap-2 rounded-lg hover:bg-[#1a2b2c] transition-colors"
								>
									<Activity className="!size-5 text-white" />
									<span className="text-base font-light text-white">
										CLINAPP
									</span>
								</a>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<Link href={item.url}>
											<div className="flex items-center gap-1 justify-between">
												<item.icon />
												<span>{item.title}</span>
											</div>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
