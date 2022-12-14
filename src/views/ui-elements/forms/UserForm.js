// ** React Imports
import { useState, useRef, useEffect } from "react";

// ** Utils
import { __API, statusConvert } from "../../../utility/Utils";

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
	EmpType: "Tetap",
	NIK: "",
	Username: "",
	Status: 1,
	Gender: "Male",
};

const UserForm = ({ open, handleModal, type, data }) => {
	const nikRef = useRef();
	const usernameRef = useRef();

	const [userForm, setUserForm] = useState(initFormState);

	let title;
	if (type === "add") title = "Tambah User Baru";
	else if (type === "edit") title = "Ubah Data User";
	else if (type === "details") title = "Detail User";

	const formHandler = (e) => {
		setUserForm((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	useEffect(() => {
		if (data.length === 1) {
			setUserForm({
				EmpType: data[0].type,
				NIK: data[0].nik,
				Username: data[0].username,
				Status: statusConvert(data[0].status),
				Gender: data[0].gender,
			});
		} else if (data.length === 0) setUserForm(initFormState);
	}, [data]);

	useEffect(() => {
		console.log(userForm);
	}, [userForm]);

	const submitForm = async () => {
		console.log(userForm);
		await axios
			.post(__API, {
				Option: "SUBMIT USER",
				Type: type,
				Status: userForm.Status,
				User: {
					EmpType: userForm.EmpType,
					NIK: nikRef.current.value,
					Username: usernameRef.current.value,
					Gender: userForm.Gender,
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
					didClose: () => handleModal("reload"),
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
					<Label className="form-label" for="type">
						Type
					</Label>
					<InputGroup>
						<InputGroupText>
							<Briefcase size={15} />
						</InputGroupText>
						<Input
							type="select"
							id="type"
							name="EmpType"
							value={userForm.EmpType}
							disabled={type === "details"}
							onChange={formHandler}
						>
							<option value="Tetap">HRIS</option>
							<option value="NON_HRIS">NON HRIS</option>
						</Input>
					</InputGroup>
				</div>
				<div className="mb-1">
					<Label className="form-label" for="nik">
						NIK
					</Label>
					<InputGroup>
						<InputGroupText>
							<Hash size={15} />
						</InputGroupText>
						<Input
							id="nik"
							name="nik"
							type="number"
							defaultValue={
								userForm.NIK.length !== 0 ? userForm.NIK : ""
							}
							disabled={type === "details"}
							placeholder="123456789"
							innerRef={nikRef}
						/>
					</InputGroup>
				</div>
				<div className="mb-1">
					<Label className="form-label" for="username">
						Username
					</Label>
					<InputGroup>
						<InputGroupText>
							<User size={15} />
						</InputGroupText>
						<Input
							id="username"
							name="username"
							defaultValue={
								userForm.Username.length !== 0
									? userForm.Username
									: ""
							}
							disabled={type === "details"}
							placeholder="Akip Tsaqif"
							innerRef={usernameRef}
						/>
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
							value={userForm.Status}
							disabled={type === "details"}
							onChange={formHandler}
						>
							<option value="1">Active</option>
							<option value="0">Inactive</option>
						</Input>
					</InputGroup>
				</div>
				<div className="mb-1">
					<Label className="form-label" for="username">
						Gender
					</Label>
					<InputGroup>
						<InputGroupText>
							<User size={15} />
						</InputGroupText>
						<Input
							type="select"
							id="gender"
							name="Gender"
							value={userForm.Gender}
							disabled={type === "details"}
							onChange={formHandler}
						>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
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

export default UserForm;
