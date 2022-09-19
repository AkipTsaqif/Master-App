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
import { statusConvert, __API, formatDate, selectThemeColors } from "@utils";
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

const AppMenu = () => {
	// ** States
	const [form, setForm] = useState(false);
	const [currentPage, setCurrentPage] = useState(0);
	const [searchValue, setSearchValue] = useState("");
	const [filteredData, setFilteredData] = useState([]);
	const [appMenuData, setAppMenuData] = useState([]);
	const [appList, setAppList] = useState([]);
	const [appGroupList, setAppGroupList] = useState([]);
	const [type, setType] = useState("");
	const [isFetching, setIsFetching] = useState(false);
	const [selectedApp, setSelectedApp] = useState();
	const [appMenuFormData, setAppMenuFormData] = useState({
		AppName: "",
		GroupName: "",
		MenuName: "",
		MappingCode: "",
		HeaderPos: "",
		Submenu1Pos: "",
		Submenu2Pos: "",
		Submenu3Pos: "",
		Submenu4Pos: "",
		Status: "Active",
	});

	const loc = useLocation();
	const ref = useRef(null);
	const timerRef = useRef(null);
	console.log(loc);

	const columns = [
		{
			name: "No",
			width: "50px",
			selector: (row) => row.RowNum,
			// center: true,
		},
		{
			name: "Nama Aplikasi",
			width: "200px",
			selector: (row) => row.AppName,
			sortable: (row) => row.AppName,
			style: {
				fontWeight: "bold",
			},
		},
		{
			name: "Nama Grup",
			minWidth: "200px",
			selector: (row) => row.GroupName,
			sortable: (row) => row.GroupName,
			wrap: true,
			style: {
				fontWeight: "bold",
			},
		},
		{
			name: "Nama Menu",
			width: "200px",
			selector: (row) => row.MenuName,
			sortable: (row) => row.MenuName,
		},
		{
			name: "Kode Mapping",
			width: "150px",
			selector: (row) => row.MappingCode,
			sortable: (row) => row.MappingCode,
		},
		{
			name: "Status",
			width: "95px",
			selector: (row) => row.Status,
			sortable: (row) => row.Status,
			style: {
				fontWeight: "bold",
			},
		},
		{
			name: "Modified Date",
			width: "180px",
			selector: (row) => row.Modified_Date,
			sortable: (row) => row.Modified_Date,
			format: (row) => formatDate(row.Modified_Date),
			right: true,
		},
		{
			name: "Modified By",
			width: "180px",
			selector: (row) => row.Modified_By,
			sortable: (row) => row.Modified_By,
		},
	];

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

	const fetchAppList = async () => {
		await axios
			.post(__API, {
				Option: "GET APPLICATION",
			})
			.then((res) => {
				const app = JSON.parse(res.data).map((item) => {
					return {
						value: item.appname,
						label: item.appname,
					};
				});
				setAppList(app);
			});
	};

	const fetchAppGroupList = async () => {
		await axios
			.post(__API, {
				Option: "GET GROUP",
				App: {
					AppName: selectedApp,
				},
			})
			.then((res) => {
				const group = JSON.parse(res.data).map((item) => {
					return {
						value: item.groupname,
						label: item.groupname,
					};
				});
				setAppGroupList(group);
			});
	};

	useEffect(() => {
		fetchData();
		fetchAppList();
	}, []);

	useEffect(() => {
		if (selectedApp !== undefined) fetchAppGroupList();
	}, [selectedApp]);

	const selectRowHandler = useCallback((state) => {
		if (state.selectedCount !== 0) {
			setAppMenuFormData((prevState) => ({
				...prevState,
				EmpType: state.selectedRows[0].type,
				NIK: state.selectedRows[0].nik,
				Status: statusConvert(state.selectedRows[0].status),
				Username: state.selectedRows[0].username,
				Gender: state.selectedRows[0].gender,
			}));
		} else {
			setAppMenuFormData({
				EmpType: "Tetap",
				NIK: "",
				Username: "",
				Status: 1,
				Gender: "",
			});
		}
	}, []);

	// ** Function to handle Modal toggle
	const handleForm = (e) => {
		setForm(!form);

		timerRef.current = setTimeout(
			() => ref.current.scrollIntoView({ behavior: "smooth" }),
			100
		);
		if (e.hasOwnProperty("target")) setType(e.target.id);
		else setType("");
	};

	useEffect(() => {
		return () => clearTimeout(timerRef.current);
	}, []);

	const submitForm = async () => {
		console.log(appMenuFormData);
		await axios
			.post(__API, {
				Option: "SUBMIT USER",
				Type: type,
				Status: appMenuFormData.Status,
				User: {
					EmpType: appMenuFormData.EmpType,
					NIK: appMenuFormData.NIK,
					Username: appMenuFormData.Username,
					Gender: appMenuFormData.Gender,
				},
			})
			.then(() => {
				MySwal.fire({
					title:
						type === "add" ? (
							<p>User berhasil ditambahkan</p>
						) : (
							<p>Data user berhasil diubah</p>
						),
					didClose: () => fetchData(),
				});
			})
			.catch(() => {
				MySwal.fire({
					title:
						type === "add" ? (
							<p>Gagal menambahkan user</p>
						) : (
							<p>Gagal mengubah data user</p>
						),
					didClose: () => fetchData(),
				});
			});
	};

	// ** Function to handle filter
	const handleFilter = (e) => {
		const value = e.target.value;
		let updatedData = [];
		setSearchValue(value);

		if (value.length) {
			updatedData = appMenuData.filter((item) => {
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

	useEffect(() => {
		console.log(appMenuFormData);
	}, [appMenuFormData]);

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
					: Math.ceil(appMenuData.length / 7) || 1
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
		const keys = Object.keys(appMenuData[0]);

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
					<CardTitle tag="h4">Menu Aplikasi</CardTitle>
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
							onClick={handleForm}
						>
							<Plus size={15} id="add" />
							<span className="align-middle ms-50" id="add">
								Add Record
							</span>
						</Button>
					</div>
				</CardHeader>
				<Row className="justify-content-end mx-0">
					<Col
						className="d-flex align-items-center justify-content-start"
						md="6"
						sm="12"
					>
						<Button
							color={"warning"}
							className="me-1"
							id="edit"
							onClick={handleForm}
						>
							Edit
						</Button>{" "}
						{"  "}
						<Button
							color={"info"}
							id="details"
							onClick={handleForm}
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
						data={searchValue.length ? filteredData : appMenuData}
						progressPending={isFetching}
						progressComponent={
							<Spinner className="m-5" color="primary" />
						}
					/>
				</div>
			</Card>
			{/* <UserForm
				open={modal}
				handleModal={handleModal}
				type={type}
				data={selectedRow}
			/> */}
			{form ? (
				<Card>
					<CardBody>
						<Form>
							<Row className="d-flex justify-content-center align-items-center">
								<Col md="6" sm="12">
									<Row className="mb-1 d-flex justify-content-center align-items-center">
										<Label sm="3" for="empType">
											Nama Aplikasi
										</Label>
										<Col sm="9">
											<Select
												theme={selectThemeColors}
												className="react-select"
												classNamePrefix="select"
												options={appList}
												isClearable={false}
												onChange={(e) =>
													setSelectedApp(e.value)
												}
											/>
										</Col>
									</Row>
								</Col>
								<Col md="6" sm="12">
									<Row className="mb-1 d-flex justify-content-center align-items-center">
										<Label sm="3" for="Status">
											Nama Grup
										</Label>
										<Col sm="9">
											<Select
												theme={selectThemeColors}
												className="react-select"
												classNamePrefix="select"
												options={appGroupList}
												isClearable={false}
												isDisabled={
													selectedApp === undefined
												}
											/>
										</Col>
									</Row>
								</Col>
							</Row>

							<Row className="d-flex justify-content-center align-items-center">
								<Col md="6" sm="12">
									<Row className="mb-1 d-flex justify-content-center align-items-center">
										<Label sm="3" for="NIK">
											Nama Menu
										</Label>
										<Col sm="9">
											<Input
												name="namaMenu"
												id="namaMenu"
												value={appMenuFormData.MenuName}
												onChange={(e) =>
													setAppMenuFormData(
														(prevState) => ({
															...prevState,
															MenuName:
																e.target.value,
														})
													)
												}
											/>
										</Col>
									</Row>
								</Col>
								<Col md="6" sm="12">
									<Row className="mb-1 d-flex justify-content-center align-items-center">
										<Label sm="3" for="Gender">
											Kode Mapping
										</Label>
										<Col sm="9">
											<Input
												name="Gender"
												id="Gender"
												value={
													appMenuFormData.MappingCode
												}
												onChange={(e) =>
													setAppMenuFormData(
														(prevState) => ({
															...prevState,
															MappingCode:
																e.target.value,
														})
													)
												}
											/>
										</Col>
									</Row>
								</Col>
							</Row>

							<Row>
								<Col md="6" sm="12">
									<Row className="mb-1 d-flex justify-content-center align-items-center">
										<Label sm="3" for="Gender">
											Status
										</Label>
										<Col sm="9">
											<Select
												theme={selectThemeColors}
												className="react-select"
												classNamePrefix="select"
												options={[
													{
														value: "1",
														label: "Active",
													},
													{
														value: "0",
														label: "Inactive",
													},
												]}
												isClearable={false}
											/>
										</Col>
									</Row>
								</Col>
							</Row>

							<Row>
								<Col md="6" sm="12">
									<Row className="mb-1 d-flex justify-content-center align-items-center">
										<Label sm="3" for="NIK">
											Urutan Posisi Header
										</Label>
										<Col sm="9">
											<Input
												name="namaMenu"
												id="namaMenu"
												value={
													appMenuFormData.HeaderPos
												}
												onChange={(e) =>
													setAppMenuFormData(
														(prevState) => ({
															...prevState,
															HeaderPos:
																e.target.value,
														})
													)
												}
											/>
										</Col>
									</Row>
								</Col>
							</Row>

							<Row>
								<h5 className="h5">
									Posisi Submenu &#40;jika ada&#41;
								</h5>
							</Row>
							<Row>
								<Col md="6" sm="12">
									<Row className="mb-1">
										<Label sm="3"></Label>
										<Col sm="9" className="mb-1">
											<Input
												name="namaMenu"
												id="namaMenu"
												placeholder="Submenu 1"
												value={
													appMenuFormData.HeaderPos
												}
												onChange={(e) =>
													setAppMenuFormData(
														(prevState) => ({
															...prevState,
															HeaderPos:
																e.target.value,
														})
													)
												}
											/>
										</Col>
										<Label sm="3"></Label>
										<Col sm="9">
											<Input
												name="namaMenu"
												id="namaMenu"
												placeholder="Submenu 2"
												value={
													appMenuFormData.HeaderPos
												}
												onChange={(e) =>
													setAppMenuFormData(
														(prevState) => ({
															...prevState,
															HeaderPos:
																e.target.value,
														})
													)
												}
											/>
										</Col>
									</Row>
								</Col>
								<Col md="6" sm="12">
									<Row className="mb-1">
										<Col sm="9" className="mb-1">
											<Input
												name="namaMenu"
												id="namaMenu"
												placeholder="Submenu 3"
												value={
													appMenuFormData.HeaderPos
												}
												onChange={(e) =>
													setAppMenuFormData(
														(prevState) => ({
															...prevState,
															HeaderPos:
																e.target.value,
														})
													)
												}
											/>
										</Col>
										<Col sm="9">
											<Input
												name="namaMenu"
												id="namaMenu"
												placeholder="Submenu 4"
												value={
													appMenuFormData.HeaderPos
												}
												onChange={(e) =>
													setAppMenuFormData(
														(prevState) => ({
															...prevState,
															HeaderPos:
																e.target.value,
														})
													)
												}
											/>
										</Col>
									</Row>
								</Col>
							</Row>
							<Row>
								<Col className="d-flex">
									<Button
										className="me-1"
										color="primary"
										onClick={submitForm}
									>
										Submit
									</Button>
									<Button
										outline
										color="secondary"
										type="reset"
									>
										Reset
									</Button>
								</Col>
							</Row>
						</Form>
					</CardBody>
					<div ref={ref}></div>
				</Card>
			) : (
				""
			)}
		</Fragment>
	);
};

export default AppMenu;
