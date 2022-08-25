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
	AppName: "",
	Keterangan: "",
	Status: 1,
};

const AppForm = ({ open, handleModal, type, data }) => {
	const appRef = useRef();
	const ketRef = useRef();

	const [appForm, setAppForm] = useState(initFormState);

	let title;
	if (type === "add") title = "Tambah Aplikasi Baru";
	else if (type === "edit") title = "Ubah Data Aplikasi";
	else if (type === "details") title = "Detail Aplikasi";

	const formHandler = (e) => {
		setAppForm((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	useEffect(() => {
		if (data.length === 1) {
			setAppForm({
				AppName: data[0].appname,
				Keterangan: data[0].ket,
				Status: statusConvert(data[0].status),
			});
		} else if (data.length === 0) setAppForm(initFormState);
	}, [data]);

	useEffect(() => {
		console.log(appForm);
	}, [appForm]);

	const submitForm = async () => {
		console.log(appForm);
		await axios
			.post(__API, {
				Option: "SUBMIT APP",
				Type: type,
				Status: appForm.Status,
				App: {
					AppName: appRef.current.value,
					Keterangan: ketRef.current.value,
				},
			})
			.then(() => {
				MySwal.fire({
					title:
						type === "add" ? (
							<p>Aplikasi berhasil ditambahkan</p>
						) : (
							<p>Data aplikasi berhasil diubah</p>
						),
					didClose: () => handleModal("reload"),
				});
			})
			.catch(() => {
				MySwal.fire({
					title:
						type === "add" ? (
							<p>Gagal menambahkan aplikasi</p>
						) : (
							<p>Gagal mengubah data aplikasi</p>
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
						Nama Aplikasi
					</Label>
					<InputGroup>
						<InputGroupText>
							<Hash size={15} />
						</InputGroupText>
						<Input
							id="appname"
							name="appname"
							defaultValue={
								appForm.AppName.length !== 0
									? appForm.AppName
									: ""
							}
							disabled={type === "details"}
							placeholder="K2...."
							innerRef={appRef}
						/>
					</InputGroup>
				</div>
				<div className="mb-1">
					<Label className="form-label" for="username">
						Keterangan
					</Label>
					<InputGroup>
						<InputGroupText>
							<User size={15} />
						</InputGroupText>
						<Input
							id="ket"
							name="ket"
							defaultValue={
								appForm.Keterangan.length !== 0
									? appForm.Keterangan
									: ""
							}
							disabled={type === "details"}
							placeholder="Keterangan...."
							innerRef={ketRef}
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
							value={appForm.Status}
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

export default AppForm;
