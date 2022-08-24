// ** React Imports
import { useState, useRef } from "react";

// ** Utils
import { __API } from "../../../utility/Utils";

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

const UserForm = ({ open, handleModal, type }) => {
	const nikRef = useRef();
	const usernameRef = useRef();

	const [userForm, setUserForm] = useState({
		EmpType: "Tetap",
		NIK: "",
		Username: "",
		Status: 1,
		Gender: "Male",
	});

	let title;
	if (type === "add") title = "Add User";
	else if (type === "edit") title = "Edit User";
	else if (type === "details") title = "User Details";

	const formHandler = (e) => {
		setUserForm((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	const submitForm = async () => {
		console.log(userForm);
		await axios
			.post(__API, {
				Option: "SUBMIT USER",
				Type: type,
				User: {
					EmpType: userForm.EmpType,
					NIK: nikRef.current.value,
					Username: usernameRef.current.value,
					Status: userForm.Status,
					Gender: userForm.Gender,
				},
			})
			.then(() => {
				MySwal.fire({
					title: <p>User berhasil ditambahkan!</p>,
					didClose: () => handleModal(),
				});
			})
			.catch(() => {
				MySwal.fire({
					title: <p>Gagal menambahkan user!</p>,
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
							onChange={formHandler}
						>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
						</Input>
					</InputGroup>
				</div>
				<Button className="me-1" color="primary" onClick={submitForm}>
					Submit
				</Button>
				<Button color="secondary" onClick={handleModal} outline>
					Cancel
				</Button>
			</ModalBody>
		</Modal>
	);
};

export default UserForm;
