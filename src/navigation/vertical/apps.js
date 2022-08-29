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
		id: "mAllAppsUser",
		title: "Master Apps User",
		icon: <MessageSquare size={20} />,
		navLink: "/master/user-apps",
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
		id: "tMenu",
		title: "Transaction Menu",
		icon: <Calendar size={20} />,
		navLink: "/apps/calendar",
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
