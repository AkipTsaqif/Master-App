// ** React Imports
import {
	Fragment,
	useState,
	forwardRef,
	useEffect,
	useCallback,
	useRef,
} from "react";

// ** Import Utils
import { __API, selectData, statusConvert } from "@utils";

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
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

// ** Reactstrap Imports
import {
	Row,
	Col,
	Card,
	Form,
	Input,
	Label,
	Button,
	CardTitle,
	CardHeader,
	CardBody,
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

const Group = () => {
	// ** States
	const [form, setForm] = useState(false);
	const [currentPage, setCurrentPage] = useState(0);
	const [searchValue, setSearchValue] = useState("");
	const [filteredData, setFilteredData] = useState([]);
	const [groupData, setGroupData] = useState([]);
	const [isFetching, setIsFetching] = useState(false);
	const [type, setType] = useState("");
	const [appNameList, setAppNameList] = useState([{ AppName: "All", id: 0 }]);
	const [gID, setGID] = useState();
	const [filteredApp, setFilteredApp] = useState([]);
	const [selectedApp, setSelectedApp] = useState("");
	const [groupFormData, setGroupFormData] = useState({
		id: "",
		appname: "",
		status: 1,
		groupname: "",
	});

	const groupIDRef = useRef();

	const columns = [
		{
			name: "Group ID",
			width: "150px",
			selector: (row) => row.id,
			sortable: (row) => row.id,
		},
		{
			name: "Nama Aplikasi",
			width: "350px",
			selector: (row) => row.appname,
			sortable: (row) => row.appname,
			style: {
				fontWeight: "bold",
			},
		},
		{
			name: "Nama Group",
			width: "350px",
			selector: (row) => row.groupname,
			sortable: (row) => row.groupname,
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
	];

	const fetchData = async () => {
		setIsFetching(true);
		await axios
			.post(__API, {
				Option: "GET GROUP",
			})
			.then((res) => {
				const parse = JSON.parse(res.data);
				setGroupData(parse);
				setFilteredApp(parse);
				setGID(parse[parse.length - 1].id + 1);
				setIsFetching(false);
			});
	};

	useEffect(() => {
		selectData("APP").then((res) => {
			if (res instanceof Object) {
				if (res.hasOwnProperty("APP")) {
					setAppNameList((prevState) => [...prevState, ...res.APP]);
				}
			}
		});
	}, []);

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		console.log(appNameList);
	}, [appNameList]);

	const appHandler = (e) => {
		e.target.value !== "All"
			? setFilteredApp(
					groupData.filter((app) => app.appname === e.target.value)
			  )
			: setFilteredApp(groupData);
		setSelectedApp(e.target.value);
	};

	const appFormHandler = (e) => {
		setGroupFormData((prevState) => ({
			...prevState,
			appname: e.target.value,
		}));
	};

	const statusFormHandler = (e) => {
		console.log(e);
		setGroupFormData((prevState) => ({
			...prevState,
			status: e.target.value,
		}));
	};

	const groupNameFormHandler = (e) => {
		console.log(e);
		setGroupFormData((prevState) => ({
			...prevState,
			groupname: e.target.value,
		}));
	};

	const selectRowHandler = useCallback((state) => {
		if (state.selectedCount === 1) {
			setGroupFormData({
				...state.selectedRows[0],
				status: statusConvert(state.selectedRows[0].status),
			});
			setType("edit");
		} else {
			setGroupFormData({
				id: "",
				appname: "",
				status: 1,
				groupname: "",
			});
			setType("");
		}
	}, []);

	// ** Function to handle form toggle
	const handleForm = (e) => {
		setForm(!form);
		if (e.hasOwnProperty("target")) setType(e.target.id);
		else setType("");
	};

	const submitForm = async () => {
		console.log("submit");
		await axios
			.post(__API, {
				Option: "SUBMIT GROUP",
				Type: type,
				Status: groupFormData.status,
				ID: groupIDRef.current.value,
				App: {
					AppName: groupFormData.appname,
					GroupName: groupFormData.groupname,
				},
			})
			.then(() => {
				MySwal.fire({
					title:
						type === "add" ? (
							<p>
								`Grup untuk aplikasi {groupFormData.AppName}{" "}
								berhasil ditambahkan`
							</p>
						) : (
							<p>Grup berhasil diubah</p>
						),
					didClose: fetchData(),
				});
			})
			.catch(() => {
				MySwal.fire({
					title:
						type === "add" ? (
							<p>Gagal menambahkan grup</p>
						) : (
							<p>Gagal mengubah grup</p>
						),
				});
			});
	};

	// ** Function to handle filter
	const handleFilter = (e) => {
		const value = e.target.value;
		let updatedData = [];
		setSearchValue(value);

		if (value.length) {
			updatedData = filteredApp.filter((item) => {
				const inc =
					(item.appname &&
						item.appname
							.toLowerCase()
							.includes(value.toLowerCase())) ||
					(item.groupname &&
						item.groupname
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
					: Math.ceil(groupData.length / 7) || 1
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
		const keys = Object.keys(groupData[0]);

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
				<CardHeader className="flex-md-row flex-column align-md-items-center align-items-center border-bottom">
					<CardTitle tag="h4">Master Group</CardTitle>
					<div>
						<div>Pilih aplikasi:</div>
						<Input
							type="select"
							id="app"
							name="APP"
							value={selectedApp}
							// disabled={type === "details"}
							onChange={appHandler}
						>
							{appNameList.map((option) => (
								<option key={option.id} value={option.AppName}>
									{option.AppName}
								</option>
							))}
						</Input>
					</div>
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
						data={searchValue.length ? filteredData : filteredApp}
						progressPending={isFetching}
						progressComponent={
							<Spinner className="m-5" color="primary" />
						}
					/>
				</div>
			</Card>
			{form ? (
				<Card>
					<CardBody>
						<Form>
							<Row>
								<Col md="6" sm="12">
									<Row className="mb-1">
										<Label sm="3" for="nameIcons">
											Group ID
										</Label>
										<Col sm="9">
											<Input
												type="text"
												name="name"
												id="nameIcons"
												disabled
												value={
													type === "edit"
														? groupFormData?.id
														: gID
												}
												placeholder="ID"
												innerRef={groupIDRef}
											/>
										</Col>
									</Row>
								</Col>
								<Col md="6" sm="12">
									<Row className="mb-1">
										<Label sm="3" for="EmailIcons">
											Status
										</Label>
										<Col sm="9">
											<Input
												type="select"
												name="status"
												id="Status"
												onChange={statusFormHandler}
												value={
													type === "edit"
														? groupFormData?.status
														: 1
												}
											>
												<option value="1">
													Active
												</option>
												<option value="0">
													Inactive
												</option>
											</Input>
										</Col>
									</Row>
								</Col>
							</Row>

							<Row>
								<Col md="6" sm="12">
									<Row className="mb-1">
										<Label sm="3" for="APP">
											Aplikasi
										</Label>
										<Col sm="9">
											<Input
												name="app"
												type="select"
												id="APP"
												value={
													type === "edit"
														? groupFormData?.appname
														: ""
												}
												onChange={appFormHandler}
											>
												{appNameList.map((option) => (
													<option
														key={option.id}
														value={option.AppName}
													>
														{option.AppName}
													</option>
												))}
											</Input>
										</Col>
									</Row>
								</Col>
								<Col md="6" sm="12">
									<Row className="mb-1">
										<Label sm="3" for="passwordIcons">
											Group Name
										</Label>
										<Col sm="9">
											<Input
												name="groupname"
												id="groupname"
												placeholder="Nama grup...."
												value={
													type === "edit"
														? groupFormData?.groupname
														: ""
												}
												onChange={groupNameFormHandler}
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
				</Card>
			) : (
				""
			)}
		</Fragment>
	);
};

export default Group;
