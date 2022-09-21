// ** Icons Import
import {
	Mail,
	MessageSquare,
	CheckSquare,
	Calendar,
	FileText,
	Circle,
	ShoppingCart,
	User,
	Shield,
} from "react-feather";

export default [
	{
		header: "Master",
	},
	{
		id: "mAllApps",
		title: "Master User All Apps",
		icon: <Mail size={20} />,
		navLink: "/master/user",
	},
	{
		id: "mDepartment",
		title: "Master Department",
		icon: <CheckSquare size={20} />,
		navLink: "/master/department",
	},
	{
		id: "mDivisi",
		title: "Master Divisi",
		icon: <Calendar size={20} />,
		navLink: "/master/division",
	},
	{
		id: "mApp",
		title: "Master Aplikasi",
		icon: <Calendar size={20} />,
		navLink: "/master/application",
	},
	{
		id: "mGroup",
		title: "Master Group",
		icon: <Calendar size={20} />,
		navLink: "/master/group",
	},
	{
		id: "mRole",
		title: "Master Role",
		icon: <Calendar size={20} />,
		navLink: "/apps/calendar",
	},
	{
		id: "mRoleUser",
		title: "Master Role User",
		icon: <Calendar size={20} />,
		navLink: "/apps/calendar",
	},
	{
		id: "mTable",
		title: "Master Tabel",
		icon: <Calendar size={20} />,
		navLink: "/apps/calendar",
	},
	{
		header: "Transaction",
	},
	{
		id: "tUser",
		title: "User Details",
		icon: <Calendar size={20} />,
		navLink: "/transaction/user",
	},
	{
		id: "tMenu",
		title: "App Menu",
		icon: <Calendar size={20} />,
		badge: "light-success",
		badgeText: "New",
		children: [
			{
				id: "appMenuGroup",
				title: "App Menu Group",
				icon: <Circle size={12} />,
				navLink: "/transaction/appmenu/group",
			},
			{
				id: "appMenuDetails",
				title: "App Menu Details",
				icon: <Circle size={12} />,
				navLink: "/transaction/appmenu/details",
			},
		],
	},
	{
		id: "tGroup",
		title: "Transaction Group",
		icon: <Calendar size={20} />,
		navLink: "/apps/calendar",
	},
	{
		id: "tRole",
		title: "Transaction Role",
		icon: <Calendar size={20} />,
		navLink: "/apps/calendar",
	},
];
