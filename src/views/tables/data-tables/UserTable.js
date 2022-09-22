// ** React Imports
import { useState, useEffect, useCallback, forwardRef } from "react";
import { useLocation } from "react-router-dom";

import { __API } from "@utils";

// ** Third Party Imports
import axios from "axios";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";

// ** Reactstrap Imports
import {
	Card,
	CardHeader,
	CardTitle,
	Col,
	Input,
	Label,
	Row,
	Spinner,
} from "reactstrap";

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
	<div className="form-check">
		<Input type="checkbox" ref={ref} {...props} />
	</div>
));

const UserTable = ({ setSelectedRow }) => {
	const [isFetching, setIsFetching] = useState(false);
	const [dataUser, setDataUser] = useState([]);
	const [searchValue, setSearchValue] = useState("");
	const [filteredData, setFilteredData] = useState([]);

	const location = useLocation();
	console.log(location);

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
			style: {
				fontWeight: "bold",
			},
		},
	];

	const fetchData = async () => {
		setIsFetching(true);
		await axios
			.post(__API, {
				Option: "GET ALL LEGACY USER DATA",
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
		setSelectedRow(state.selectedRows[0]);
	});

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

	return (
		<Card>
			<Row className="justify-content-end mx-0">
				<Col
					className="d-flex align-items-center justify-content-start"
					md="6"
					sm="12"
				>
					<CardTitle tag="h4" className="mb-0">
						Master User Table
					</CardTitle>
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
					paginationPerPage={3}
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
	);
};

export default UserTable;
