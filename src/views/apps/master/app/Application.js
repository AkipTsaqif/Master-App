// ** React Imports
import { Fragment, useState, forwardRef, useEffect, useCallback } from "react";

// ** Import Utils
import { formatDate, __API } from "../../../../utility/Utils";

// ** Add New Modal Component
import AppForm from "../../../ui-elements/forms/AppForm";

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
	Spinner,
	UncontrolledButtonDropdown,
} from "reactstrap";

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
	<div className="form-check">
		<Input type="checkbox" ref={ref} {...props} />
	</div>
));

const Application = () => {
	// ** States
	const [modal, setModal] = useState(false);
	const [currentPage, setCurrentPage] = useState(0);
	const [searchValue, setSearchValue] = useState("");
	const [filteredData, setFilteredData] = useState([]);
	const [appData, setAppData] = useState([]);
	const [isFetching, setIsFetching] = useState(false);
	const [selectedRow, setSelectedRow] = useState([]);
	const [type, setType] = useState("");

	const columns = [
		{
			name: "No",
			width: "50px",
			selector: (row) => row.id,
			center: true,
		},
		{
			name: "Nama App",
			width: "220px",
			selector: (row) => row.appname,
			sortable: (row) => row.appname,
			style: {
				fontWeight: "bold",
			},
		},
		{
			name: "Keterangan",
			width: "220px",
			selector: (row) => row.ket,
			sortable: (row) => row.ket,
		},
		{
			name: "Status",
			width: "100px",
			selector: (row) => row.status,
			sortable: (row) => row.status,
			center: true,
			style: {
				fontWeight: "bold",
			},
		},
		{
			name: "Modified Date",
			width: "180px",
			selector: (row) => row.modifdate,
			sortable: (row) => row.modifdate,
			format: (row) => formatDate(row.modifdate),
			right: true,
		},
		{
			name: "Modified By",
			width: "180px",
			selector: (row) => row.modifby,
			sortable: (row) => row.modifby,
		},
	];

	const fetchData = async () => {
		setIsFetching(true);
		await axios
			.post(__API, {
				Option: "GET APPLICATION",
			})
			.then((res) => {
				const data = JSON.parse(res.data).map((item, index) => {
					return {
						...item,
						id: index + 1,
					};
				});
				setAppData(data);
				setIsFetching(false);
			});
	};

	useEffect(() => {
		fetchData();
	}, []);

	const selectRowHandler = useCallback((state) => {
		setSelectedRow(state.selectedRows);
	}, []);

	useEffect(() => {
		console.log(appData);
	}, [appData]);

	// ** Function to handle Modal toggle
	const handleModal = (e) => {
		setModal(!modal);
		if (e.hasOwnProperty("target")) setType(e.target.id);
		else if (e === "reload") fetchData();
	};

	// ** Function to handle filter
	const handleFilter = (e) => {
		const value = e.target.value;
		let updatedData = [];
		setSearchValue(value);

		if (value.length) {
			updatedData = appData.filter((item) => {
				const inc =
					(item.appname &&
						item.appname
							.toLowerCase()
							.includes(value.toLowerCase())) ||
					(item.ket &&
						item.ket.toLowerCase().includes(value.toLowerCase())) ||
					(item.modifby &&
						item.modifby
							.toLowerCase()
							.includes(value.toLowerCase()));

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
					: Math.ceil(appData.length / 7) || 1
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
		const keys = Object.keys(appData[0]);

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
			<Card>
				<CardHeader className="flex-md-row flex-column align-md-items-center align-items-start border-bottom">
					<CardTitle tag="h4">Master Aplikasi</CardTitle>
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
							color="primary"
							id="add"
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
							color={"warning"}
							className="me-1"
							id="edit"
							onClick={handleModal}
						>
							Edit
						</Button>{" "}
						{"  "}
						<Button
							color={"info"}
							id="details"
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
						selectableRowsSingle
						onSelectedRowsChange={selectRowHandler}
						columns={columns}
						paginationPerPage={6}
						className="react-dataTable"
						sortIcon={<ChevronDown size={10} />}
						persistTableHead
						// paginationComponent={CustomPagination}
						// paginationDefaultPage={currentPage + 1}
						selectableRowsComponent={BootstrapCheckbox}
						data={searchValue.length ? filteredData : appData}
						progressPending={isFetching}
						progressComponent={
							<Spinner className="m-5" color="primary" />
						}
					/>
				</div>
			</Card>
			<AppForm
				open={modal}
				handleModal={handleModal}
				type={type}
				data={selectedRow}
			/>
		</Fragment>
	);
};

export default Application;
