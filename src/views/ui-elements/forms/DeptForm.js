// ** React Imports
import { useState, useRef, useEffect } from "react";

// ** Utils
import { __API, statusConvert, selectData } from "../../../utility/Utils";

// ** Third Party Components
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { User, Briefcase, Calendar, X, Hash } from "react-feather";

// ** Reactstrap Imports
import {
	Modal,
	Input,
	Label,
	Button,
	ModalHeader,
	ModalBody,
	InputGroup,
	InputGroupText,
} from "reactstrap";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";

const MySwal = withReactContent(Swal);
const initFormState = {
	DeptName: "",
	Desc: "",
	LOB: "3HA03",
	Divisi: "FAITIA",
	Status: 1,
};

const selectDataOptions = ["LOB", "DIVISI"];

const DeptForm = ({ open, handleModal, type, data }) => {
	const deptNameRef = useRef();
	const descRef = useRef();

	const [deptForm, setDeptForm] = useState(initFormState);
	const [lob, setLob] = useState([]);
	const [divisi, setDivisi] = useState([]);

	let title;
	if (type === "add") title = "Tambah Departemen Baru";
	else if (type === "edit") title = "Ubah Data Departemen";
	else if (type === "details") title = "Detail Departemen";

	useEffect(() => {
		selectData(selectDataOptions).then((res) => {
			if (res instanceof Object) {
				if (res.hasOwnProperty(selectDataOptions[0])) {
					setLob(res[selectDataOptions[0]]);
				}
				if (res.hasOwnProperty(selectDataOptions[1])) {
					setDivisi(res[selectDataOptions[1]]);
				}
			}
		});
	}, []);

	const formHandler = (e) => {
		setDeptForm((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	useEffect(() => {
		if (data.length === 1) {
			setDeptForm({
				DeptName: data[0].name,
				Desc: data[0].desc,
				LOB: data[0].lob,
				Divisi: data[0].div,
				Status: statusConvert(data[0].status),
			});
		} else if (data.length === 0) setDeptForm(initFormState);
	}, [data]);

	const submitForm = async () => {
		await axios
			.post(__API, {
				Option: "SUBMIT DEPARTMENT",
				Type: type,
				Status: deptForm.Status,
				LOB: deptForm.LOB,
				Dept: {
					DeptName: deptNameRef.current.value,
					DeptDesc: descRef.current.value,
					DeptDiv: deptForm.Divisi,
				},
			})
			.then(() => {
				MySwal.fire({
					title:
						type === "add" ? (
							<p>Departemen berhasil ditambahkan</p>
						) : (
							<p>Data departemen berhasil diubah</p>
						),
					didClose: () => handleModal("reload"),
				});
			})
			.catch(() => {
				MySwal.fire({
					title:
						type === "add" ? (
							<p>Gagal menambahkan departemen</p>
						) : (
							<p>Gagal mengubah data departemen</p>
						),
					didClose: () => handleModal(),
				});
			});
	};

	// ** Custom close btn
	const CloseBtn = (
		<X className="cursor-pointer" size={15} onClick={handleModal} />
	);

	return (
		<Modal
			isOpen={open}
			toggle={handleModal}
			className="sidebar-lg"
			modalClassName="modal-slide-in"
			contentClassName="pt-0"
		>
			<ModalHeader
				className="mb-1"
				toggle={handleModal}
				close={CloseBtn}
				tag="div"
			>
				<h5 className="modal-title">{title}</h5>
			</ModalHeader>
			<ModalBody className="flex-grow-1">
				<div className="mb-1">
					<Label className="form-label" for="nik">
						Nama Departemen
					</Label>
					<InputGroup>
						<InputGroupText>
							<Hash size={15} />
						</InputGroupText>
						<Input
							id="deptname"
							name="deptname"
							defaultValue={
								deptForm.DeptName.length !== 0
									? deptForm.DeptName
									: ""
							}
							disabled={type === "details"}
							placeholder="K2...."
							innerRef={deptNameRef}
						/>
					</InputGroup>
				</div>
				<div className="mb-1">
					<Label className="form-label" for="username">
						Deskripsi
					</Label>
					<InputGroup>
						<InputGroupText>
							<User size={15} />
						</InputGroupText>
						<Input
							id="desc"
							name="Desc"
							defaultValue={
								deptForm.Desc.length !== 0 ? deptForm.Desc : ""
							}
							disabled={type === "details"}
							placeholder="Keterangan...."
							innerRef={descRef}
						/>
					</InputGroup>
				</div>
				<div className="mb-1">
					<Label className="form-label" for="type">
						LOB
					</Label>
					<InputGroup>
						<InputGroupText>
							<Briefcase size={15} />
						</InputGroupText>
						<Input
							type="select"
							id="lob"
							name="LOB"
							value={deptForm.LOB}
							disabled={type === "details"}
							onChange={formHandler}
						>
							{lob.map((option) => (
								<option key={option.id} value={option.Name}>
									{`${option.Name} - ${option.Description}`}
								</option>
							))}
						</Input>
					</InputGroup>
				</div>
				<div className="mb-1">
					<Label className="form-label" for="type">
						Divisi
					</Label>
					<InputGroup>
						<InputGroupText>
							<Briefcase size={15} />
						</InputGroupText>
						<Input
							type="select"
							id="divisi"
							name="Divisi"
							value={deptForm.Divisi}
							disabled={type === "details"}
							onChange={formHandler}
						>
							{divisi.map((option) => (
								<option key={option.id} value={option.Name}>
									{option.Name}
								</option>
							))}
						</Input>
					</InputGroup>
				</div>
				<div className="mb-1">
					<Label className="form-label" for="status">
						Status
					</Label>
					<InputGroup>
						<InputGroupText>
							<Calendar size={15} />
						</InputGroupText>
						<Input
							type="select"
							id="status"
							name="Status"
							value={deptForm.Status}
							disabled={type === "details"}
							onChange={formHandler}
						>
							<option value="1">Active</option>
							<option value="0">Inactive</option>
						</Input>
					</InputGroup>
				</div>
				{type === "details" ? (
					""
				) : (
					<Button
						className="me-1"
						color="primary"
						onClick={submitForm}
					>
						Submit
					</Button>
				)}
				<Button color="secondary" onClick={handleModal} outline>
					Cancel
				</Button>
			</ModalBody>
		</Modal>
	);
};

export default DeptForm;
