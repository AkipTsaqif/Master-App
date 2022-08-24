// ** React Imports
import { Fragment, useState, forwardRef, useEffect, useCallback } from "react";

// ** Utils
import { __API } from "../../../../utility/Utils";

// ** Add New Modal Component
import UserForm from "../../../ui-elements/forms/UserForm";

// ** Third Party Components
import axios from "axios";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
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

const UserAllApps = () => {
	// ** States
	const [modal, setModal] = useState(false);
	const [currentPage, setCurrentPage] = useState(0);
	const [searchValue, setSearchValue] = useState("");
	const [filteredData, setFilteredData] = useState([]);
	const [dataUser, setDataUser] = useState([]);
	const [selectedRow, setSelectedRow] = useState([]);
	const [isRowSelected, setIsRowSelected] = useState(false);
	const [type, setType] = useState("");
	const [isFetching, setIsFetching] = useState(false);

	const columns = [
		{
			name: "NIK",
			maxWidth: "130px",
			selector: (row) => row.nik,
			sortable: (row) => row.nik,
			style: {
				fontWeight: "bold",
			},
		},
		{
			name: "Username",
			minWidth: "270px",
			selector: (row) => row.username,
			sortable: (row) => row.username,
			wrap: true,
			style: {
				fontWeight: "bold",
			},
		},
		{
			name: "User AD",
			width: "170px",
			selector: (row) => row.userad,
			sortable: (row) => row.userad,
		},
		{
			name: "LOB",
			width: "80px",
			selector: (row) => row.lob,
			sortable: (row) => row.lob,
		},
		{
			name: "Email Kantor",
			minWidth: "275px",
			selector: (row) => row.email,
			sortable: (row) => row.email,
		},
		{
			name: "Status",
			width: "95px",
			selector: (row) => row.status,
			sortable: (row) => row.status,
		},
	];

	const fetchData = async () => {
		setIsFetching(true);
		await axios
			.post(__API, {
				Option: "GET ALL USER DATA",
			})
			.then((res) => {
				const data = JSON.parse(res.data).map((item, index) => {
					return {
						...item,
						id: index,
					};
				});
				setDataUser(data);
				setIsFetching(false);
			});
	};

	useEffect(() => {
		fetchData();
	}, []);

	const selectRowHandler = useCallback((state) => {
		setSelectedRow(state.selectedRows);

		state.selectedRows.length === 1
			? setIsRowSelected(true)
			: setIsRowSelected(false);

		console.log(state.selectedRows.length);
		console.log(state.selectedRows);
	}, []);

	useEffect(() => {
		console.log(selectedRow);
	}, [selectedRow]);

	// ** Function to handle Modal toggle
	const handleModal = (e) => {
		setModal(!modal);
		setType(e.target.id);
	};

	// ** Function to handle filter
	const handleFilter = (e) => {
		const value = e.target.value;
		let updatedData = [];
		setSearchValue(value);

		if (value.length) {
			updatedData = dataUser.filter((item) => {
				const inc =
					(item.nik &&
						item.nik.toLowerCase().includes(value.toLowerCase())) ||
					(item.username &&
						item.username
							.toLowerCase()
							.includes(value.toLowerCase())) ||
					(item.userad &&
						item.userad
							.toLowerCase()
							.includes(value.toLowerCase())) ||
					(item.lob &&
						item.lob.toLowerCase().includes(value.toLowerCase())) ||
					(item.email &&
						item.email.toLowerCase().includes(value.toLowerCase()));

				return inc;
			});
			setFilteredData(updatedData);
			setSearchValue(value);
		}
	};

	// ** Function to handle Pagination
	const handlePagination = (page) => {
		setCurrentPage(page.selected);
	};

	// ** Custom Pagination
	const CustomPagination = () => (
		<ReactPaginate
			previousLabel=""
			nextLabel=""
			forcePage={currentPage}
			onPageChange={(page) => handlePagination(page)}
			pageCount={
				searchValue.length
					? Math.ceil(filteredData.length / 7)
					: Math.ceil(dataUser.length / 7) || 1
			}
			breakLabel="..."
			pageRangeDisplayed={2}
			marginPagesDisplayed={2}
			activeClassName="active"
			pageClassName="page-item"
			breakClassName="page-item"
			nextLinkClassName="page-link"
			pageLinkClassName="page-link"
			breakLinkClassName="page-link"
			previousLinkClassName="page-link"
			nextClassName="page-item next-item"
			previousClassName="page-item prev-item"
			containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1"
		/>
	);

	// ** Converts table to CSV
	function convertArrayOfObjectsToCSV(array) {
		let result;

		const columnDelimiter = ",";
		const lineDelimiter = "\n";
		const keys = Object.keys(dataUser[0]);

		result = "";
		result += keys.join(columnDelimiter);
		result += lineDelimiter;

		array.forEach((item) => {
			let ctr = 0;
			keys.forEach((key) => {
				if (ctr > 0) result += columnDelimiter;

				result += item[key];

				ctr++;
			});
			result += lineDelimiter;
		});

		return result;
	}

	// ** Downloads CSV
	function downloadCSV(array) {
		const link = document.createElement("a");
		let csv = convertArrayOfObjectsToCSV(array);
		if (csv === null) return;

		const filename = "export.csv";

		if (!csv.match(/^data:text\/csv/i)) {
			csv = `data:text/csv;charset=utf-8,${csv}`;
		}

		link.setAttribute("href", encodeURI(csv));
		link.setAttribute("download", filename);
		link.click();
	}

	return (
		<Fragment>
			<div className="vw-100">
				<Card>
					<CardHeader className="flex-md-row flex-column align-md-items-center align-items-start border-bottom">
						<CardTitle tag="h4">Master User All Apps</CardTitle>
						<div className="d-flex mt-md-0 mt-1">
							<UncontrolledButtonDropdown>
								<DropdownToggle color="secondary" caret outline>
									<Share size={15} />
									<span className="align-middle ms-50">
										Export
									</span>
								</DropdownToggle>
								<DropdownMenu>
									<DropdownItem className="w-100">
										<Printer size={15} />
										<span className="align-middle ms-50">
											Print
										</span>
									</DropdownItem>
									<DropdownItem
										className="w-100"
										onClick={() => downloadCSV(data)}
									>
										<FileText size={15} />
										<span className="align-middle ms-50">
											CSV
										</span>
									</DropdownItem>
									<DropdownItem className="w-100">
										<Grid size={15} />
										<span className="align-middle ms-50">
											Excel
										</span>
									</DropdownItem>
									<DropdownItem className="w-100">
										<File size={15} />
										<span className="align-middle ms-50">
											PDF
										</span>
									</DropdownItem>
									<DropdownItem className="w-100">
										<Copy size={15} />
										<span className="align-middle ms-50">
											Copy
										</span>
									</DropdownItem>
								</DropdownMenu>
							</UncontrolledButtonDropdown>
							<Button
								className="ms-2"
								id="add"
								color="primary"
								onClick={handleModal}
							>
								<Plus size={15} id="add" />
								<span className="align-middle ms-50" id="add">
									Add Record
								</span>
							</Button>
						</div>
					</CardHeader>
					<Row className="justify-content-between mx-0">
						<Col
							className="d-flex align-items-center justify-content-start"
							md="6"
							sm="12"
						>
							<Button
								color={isRowSelected ? "warning" : "secondary"}
								className="me-1"
								id="edit"
								disabled={!isRowSelected}
								onClick={handleModal}
							>
								Edit
							</Button>{" "}
							{"  "}
							<Button
								color={isRowSelected ? "info" : "secondary"}
								id="details"
								disabled={!isRowSelected}
								onClick={handleModal}
							>
								Details
							</Button>
						</Col>
						<Col
							className="d-flex align-items-center justify-content-end mt-1"
							md="6"
							sm="12"
						>
							<Label className="me-1" for="search-input">
								Search
							</Label>
							<Input
								className="dataTable-filter mb-50"
								type="text"
								bsSize="sm"
								id="search-input"
								value={searchValue}
								onChange={handleFilter}
							/>
						</Col>
					</Row>
					<div className="react-dataTable react-dataTable-selectable-rows">
						<DataTable
							noHeader
							pagination
							selectableRows
							onSelectedRowsChange={selectRowHandler}
							columns={columns}
							paginationPerPage={6}
							className="react-dataTable"
							sortIcon={<ChevronDown size={10} />}
							persistTableHead
							// paginationComponent={CustomPagination}
							// paginationDefaultPage={currentPage + 1}
							selectableRowsComponent={BootstrapCheckbox}
							data={searchValue.length ? filteredData : dataUser}
							progressPending={isFetching}
							progressComponent={
								<Spinner className="m-5" color="primary" />
							}
						/>
					</div>
				</Card>
			</div>
			<UserForm open={modal} handleModal={handleModal} type={type} />
		</Fragment>
	);
};

export default UserAllApps;
