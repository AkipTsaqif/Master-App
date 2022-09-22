// ** React Imports
import {
	Fragment,
	useState,
	forwardRef,
	useEffect,
	useCallback,
	useRef,
} from "react";

// ** Utils
import { __API, formatDate, selectThemeColors, statusConvert } from "@utils";

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
const initFormState = {
	AppName: "",
	GroupName: "",
	RoleName: "",
	RoleDesc: "",
	RoleType: "Static",
	Status: "Active",
};

const Role = () => {
	const [roleData, setRoleData] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [searchValue, setSearchValue] = useState("");
	const [filteredData, setFilteredData] = useState([]);
	const [form, setForm] = useState(false);
	const [type, setType] = useState("");
	const [appList, setAppList] = useState([]);
	const [groupList, setGroupList] = useState([]);
	const [roleFormData, setRoleFormData] = useState(initFormState);
	const [selectedApp, setSelectedApp] = useState();
	const [selectedID, setSelectedID] = useState();
	const [isFetching, setIsFetching] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false);
	const [isFromTable, setIsFromTable] = useState(false);

	const ref = useRef(null);
	const timerRef = useRef(null);

	const columns = [
		{
			name: "Nama Role",
			minWidth: "150px",
			selector: (row) => row.RoleName,
			sortable: (row) => row.RoleName,
			wrap: true,
			style: {
				fontWeight: "bold",
			},
		},
		{
			name: "Deskripsi",
			width: "200px",
			selector: (row) => row.RoleDesc,
			sortable: (row) => row.RoleDesc,
		},
		{
			name: "Tipe",
			width: "90px",
			selector: (row) => row.RoleType,
			sortable: (row) => row.RoleType,
		},
		{
			name: "Grup",
			width: "200px",
			selector: (row) => row.GroupName,
			sortable: (row) => row.GroupName,
			style: {
				fontWeight: "bold",
			},
		},
		{
			name: "Aplikasi",
			width: "200px",
			selector: (row) => row.AppName,
			sortable: (row) => row.AppName,
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
			width: "150px",
			selector: (row) => row.Modified_Date,
			sortable: (row) => row.Modified_Date,
			format: (row) => formatDate(row.Modified_Date),
			right: true,
		},
		{
			name: "Modified By",
			width: "150px",
			selector: (row) => row.Modified_By,
			sortable: (row) => row.Modified_By,
		},
	];

	const fetchData = async () => {
		if (type === "edit") {
			setRoleFormData(initFormState);
			setForm(false);
			setType("add");
		}
		setIsFetching(true);
		await axios
			.post(__API, {
				Option: "GET ROLE",
			})
			.then((res) => {
				setRoleData(JSON.parse(res.data));
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

	useEffect(() => {
		fetchData();
		fetchAppList();
	}, []);

	const fetchGroupList = async () => {
		await axios
			.post(__API, {
				Option: "GET GROUP",
				App: {
					AppName: roleFormData.AppName,
				},
			})
			.then((res) => {
				const group = JSON.parse(res.data).map((item) => {
					return {
						value: item.groupname,
						label: item.groupname,
					};
				});
				setGroupList(group);
			});
	};

	useEffect(() => {
		if (selectedApp !== undefined) fetchGroupList();
		if (!isFromTable) {
			setRoleFormData((prevState) => ({
				...prevState,
				GroupName: null,
			}));
		}
	}, [selectedApp, isFromTable]);

	useEffect(() => {
		if (form) {
			timerRef.current = setTimeout(
				() => ref.current.scrollIntoView({ behavior: "smooth" }),
				100
			);
		}
	}, [form]);

	const selectRowHandler = useCallback((state) => {
		if (state.selectedCount !== 0) {
			setIsDisabled(true);
			setIsFromTable(true);
			setForm(true);
			setSelectedID(state.selectedRows[0].ID);
			setSelectedApp(state.selectedRows[0].AppName);
			setRoleFormData((prevState) => ({
				...prevState,
				AppName: state.selectedRows[0].AppName,
				GroupName: state.selectedRows[0].GroupName,
				RoleName: state.selectedRows[0].RoleName,
				RoleDesc: state.selectedRows[0].RoleDesc,
				RoleType: state.selectedRows[0].RoleType,
				Status: state.selectedRows[0].Status,
			}));
		} else {
			setForm(false);
			setIsDisabled(false);
			setIsFromTable(false);
			setSelectedID(null);
			setRoleFormData(initFormState);
		}
	}, []);

	// ** Function to handle Modal toggle
	const handleForm = (e) => {
		setForm(true);
		setIsDisabled(false);
		if (e.hasOwnProperty("target")) setType(e.target.id);
		else setType("");
	};

	useEffect(() => {
		return () => clearTimeout(timerRef.current);
	}, []);

	const submitForm = async () => {
		console.log(roleFormData);
		await axios
			.post(__API, {
				Option: "SUBMIT ROLE",
				Type: type,
				Status: statusConvert(roleFormData.Status),
				ID: selectedID,
				App: {
					AppName: roleFormData.AppName,
					GroupName: roleFormData.GroupName,
				},
				Role: {
					RoleName: roleFormData.RoleName,
					RoleDesc: roleFormData.RoleDesc,
					RoleType: roleFormData.RoleType,
				},
			})
			.then(() => {
				MySwal.fire({
					title:
						type === "add" ? (
							<p>Role baru berhasil ditambahkan</p>
						) : (
							<p>Data role berhasil diubah</p>
						),
					didClose: () => fetchData(),
				});
			})
			.catch(() => {
				MySwal.fire({
					title:
						type === "add" ? (
							<p>Gagal menambahkan role baru</p>
						) : (
							<p>Gagal mengubah data role</p>
						),
					didClose: () => fetchData(),
				});
			});
	};

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
					<CardTitle tag="h4">Master Role</CardTitle>
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
					></Col>
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
						data={searchValue.length ? filteredData : roleData}
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
						<Button
							color={isDisabled ? "warning" : "secondary"}
							className="me-1"
							id="edit"
							disabled={!isDisabled}
							onClick={handleForm}
						>
							Edit
						</Button>
						<hr />
						<Form>
							<Row className="d-flex justify-content-center align-items-center">
								<Col md="6" sm="12">
									<Row className="mb-1 d-flex justify-content-center align-items-center">
										<Label sm="3" for="empType">
											Tipe Role
										</Label>
										<Col sm="9">
											<Select
												theme={selectThemeColors}
												className="react-select"
												classNamePrefix="select"
												options={[
													{
														value: "Static",
														label: "Static",
													},
													{
														value: "Hierarki",
														label: "Hierarki",
													},
												]}
												isClearable={false}
												isDisabled={isDisabled}
												onChange={(e) => {
													setRoleFormData(
														(prevState) => ({
															...prevState,
															RoleType: e.value,
														})
													);
												}}
												value={{
													value: roleFormData?.RoleType,
													label: roleFormData?.RoleType,
												}}
											/>
										</Col>
									</Row>
								</Col>
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
														value: "Active",
														label: "Active",
													},
													{
														value: "Inactive",
														label: "Inactive",
													},
												]}
												isClearable={false}
												isDisabled={isDisabled}
												onChange={(e) => {
													setRoleFormData(
														(prevState) => ({
															...prevState,
															Status: e.value,
														})
													);
												}}
												value={{
													value: roleFormData?.Status,
													label: roleFormData?.Status,
												}}
											/>
										</Col>
									</Row>
								</Col>
							</Row>
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
												isDisabled={isDisabled}
												onChange={(e) => {
													setSelectedApp(e.value);
													setRoleFormData(
														(prevState) => ({
															...prevState,
															AppName: e.value,
														})
													);
												}}
												value={{
													value: roleFormData?.AppName,
													label: roleFormData?.AppName,
												}}
											/>
										</Col>
									</Row>
								</Col>
								<Col md="6" sm="12">
									<Row className="mb-1 d-flex justify-content-center align-items-center">
										<Label sm="3" for="Status">
											Grup
										</Label>
										<Col sm="9">
											<Select
												theme={selectThemeColors}
												className="react-select"
												classNamePrefix="select"
												options={groupList}
												isClearable={false}
												isDisabled={
													roleFormData.AppName ===
														"" || isDisabled
												}
												onChange={(e) => {
													setRoleFormData(
														(prevState) => ({
															...prevState,
															GroupName: e.value,
														})
													);
												}}
												value={{
													value: roleFormData?.GroupName,
													label: roleFormData?.GroupName,
												}}
											/>
										</Col>
									</Row>
								</Col>
							</Row>

							<Row className="d-flex justify-content-center align-items-center">
								<Col md="6" sm="12">
									<Row className="mb-1 d-flex justify-content-center align-items-center">
										<Label sm="3" for="NIK">
											Nama Role
										</Label>
										<Col sm="9">
											<Input
												name="namaMenu"
												id="namaMenu"
												value={roleFormData.RoleName}
												disabled={isDisabled}
												onChange={(e) =>
													setRoleFormData(
														(prevState) => ({
															...prevState,
															RoleName:
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
										<Label sm="3" for="NIK">
											Deskripsi Role
										</Label>
										<Col sm="9">
											<Input
												name="namaMenu"
												id="namaMenu"
												value={roleFormData.RoleDesc}
												disabled={isDisabled}
												onChange={(e) =>
													setRoleFormData(
														(prevState) => ({
															...prevState,
															RoleDesc:
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

export default Role;
