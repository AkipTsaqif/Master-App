// ** React Imports
import {
	Fragment,
	useState,
	forwardRef,
	useEffect,
	useCallback,
	useRef,
} from "react";
import { useLocation } from "react-router-dom";

// ** Utils
import { __API, formatDate, selectThemeColors, statusConvert } from "@utils";
import AutoComplete from "@components/autocomplete";

// ** Third Party Components
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import Select from "react-select";
import {
	ChevronDown,
	Share,
	Printer,
	FileText,
	File,
	Grid,
	Copy,
	Plus,
} from "react-feather";

// ** Reactstrap Imports
import {
	Row,
	Col,
	Card,
	Input,
	Label,
	Button,
	CardTitle,
	CardHeader,
	CardBody,
	Form,
	DropdownMenu,
	DropdownItem,
	DropdownToggle,
	UncontrolledButtonDropdown,
	Spinner,
} from "reactstrap";

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
	<div className="form-check">
		<Input type="checkbox" ref={ref} {...props} />
	</div>
));

const MySwal = withReactContent(Swal);

const Role = () => {
	const fetchData = async () => {
		setIsFetching(true);
		await axios
			.post(__API, {
				Option: "GET APP MENU",
			})
			.then((res) => {
				setAppMenuData(JSON.parse(res.data));
				setIsFetching(false);
			});
	};
};

export default Role;
