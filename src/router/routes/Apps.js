// ** React Imports
import { lazy } from "react";
import { Navigate } from "react-router-dom";

const User = lazy(() => import("../../views/apps/master/user/User"));
const AppsUser = lazy(() =>
	import("../../views/apps/master/user-app/AppsUser")
);
const Department = lazy(() =>
	import("../../views/apps/master/department/Department")
);
const Division = lazy(() =>
	import("../../views/apps/master/division/Division")
);
const Application = lazy(() =>
	import("../../views/apps/master/app/Application")
);
const Group = lazy(() => import("../../views/apps/master/group/Group"));
const TUser = lazy(() => import("../../views/apps/transaction/user/User"));

const InvoiceAdd = lazy(() => import("../../views/apps/invoice/add"));
const InvoiceList = lazy(() => import("../../views/apps/invoice/list"));
const InvoiceEdit = lazy(() => import("../../views/apps/invoice/edit"));
const InvoicePrint = lazy(() => import("../../views/apps/invoice/print"));
const InvoicePreview = lazy(() => import("../../views/apps/invoice/preview"));

const EcommerceShop = lazy(() => import("../../views/apps/ecommerce/shop"));
const EcommerceDetail = lazy(() => import("../../views/apps/ecommerce/detail"));
const EcommerceWishlist = lazy(() =>
	import("../../views/apps/ecommerce/wishlist")
);
const EcommerceCheckout = lazy(() =>
	import("../../views/apps/ecommerce/checkout")
);

const UserList = lazy(() => import("../../views/apps/user/list"));
const UserView = lazy(() => import("../../views/apps/user/view"));

const Roles = lazy(() => import("../../views/apps/roles-permissions/roles"));
const Permissions = lazy(() =>
	import("../../views/apps/roles-permissions/permissions")
);

const AppRoutes = [
	{
		element: <User />,
		path: "/master/user",
		meta: {
			appLayout: true,
			className: "email-application",
		},
	},
	{
		path: "/master/user-apps",
		element: <AppsUser />,
		meta: {
			appLayout: true,
			className: "chat-application",
		},
	},
	{
		element: <Department />,
		path: "/master/department",
		meta: {
			appLayout: true,
			className: "todo-application",
		},
	},
	{
		element: <Division />,
		path: "/master/division",
	},
	{
		element: <Application />,
		path: "/master/application",
	},
	{
		element: <Group />,
		path: "/master/group",
	},
	{
		element: <TUser />,
		path: "/transaction/user",
	},
	{
		element: <InvoicePreview />,
		path: "/apps/invoice/preview/:id",
	},
	{
		path: "/apps/invoice/preview",
		element: <Navigate to="/apps/invoice/preview/4987" />,
	},
	{
		element: <InvoiceEdit />,
		path: "/apps/invoice/edit/:id",
	},
	{
		path: "/apps/invoice/edit",
		element: <Navigate to="/apps/invoice/edit/4987" />,
	},
	{
		element: <InvoiceAdd />,
		path: "/apps/invoice/add",
	},
	{
		path: "/apps/invoice/print",
		element: <InvoicePrint />,
		meta: {
			layout: "blank",
		},
	},
	{
		element: <EcommerceShop />,
		path: "/apps/ecommerce/shop",
		meta: {
			className: "ecommerce-application",
		},
	},
	{
		element: <EcommerceWishlist />,
		path: "/apps/ecommerce/wishlist",
		meta: {
			className: "ecommerce-application",
		},
	},
	{
		path: "/apps/ecommerce/product-detail",
		element: (
			<Navigate to="/apps/ecommerce/product-detail/apple-i-phone-11-64-gb-black-26" />
		),
		meta: {
			className: "ecommerce-application",
		},
	},
	{
		path: "/apps/ecommerce/product-detail/:product",
		element: <EcommerceDetail />,
		meta: {
			className: "ecommerce-application",
		},
	},
	{
		path: "/apps/ecommerce/checkout",
		element: <EcommerceCheckout />,
		meta: {
			className: "ecommerce-application",
		},
	},
	{
		element: <UserList />,
		path: "/apps/user/list",
	},
	{
		path: "/apps/user/view",
		element: <Navigate to="/apps/user/view/1" />,
	},
	{
		element: <UserView />,
		path: "/apps/user/view/:id",
	},
	{
		element: <Roles />,
		path: "/apps/roles",
	},
	{
		element: <Permissions />,
		path: "/apps/permissions",
	},
];

export default AppRoutes;
