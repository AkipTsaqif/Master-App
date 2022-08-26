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
	DivName: "",
	DivDesc: "",
	Status: 1,
};

const DivForm = ({ open, handleModal, type, data }) => {
	const divNameRef = useRef();
	const descRef = useRef();

	const [divForm, setDivForm] = useState(initFormState);

	let title;
	if (type === "add") title = "Tambah Divisi Baru";
	else if (type === "edit") title = "Ubah Data Divisi";
	else if (type === "details") title = "Detail Divisi";

	const formHandler = (e) => {
		setDivForm((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	useEffect(() => {
		if (data.length === 1) {
			setDivForm({
				DivName: data[0].name,
				DivDesc: data[0].desc,
				Status: statusConvert(data[0].status),
			});
		} else if (data.length === 0) setDivForm(initFormState);
	}, [data]);

	const submitForm = async () => {
		await axios
			.post(__API, {
				Option: "SUBMIT DIVISION",
				Type: type,
				Status: divForm.Status,
				Div: {
					DivName: divNameRef.current.value,
					DivDesc: descRef.current.value,
				},
			})
			.then(() => {
				MySwal.fire({
					title:
						type === "add" ? (
							<p>Divisi berhasil ditambahkan</p>
						) : (
							<p>Data Divisi berhasil diubah</p>
						),
					didClose: () => handleModal("reload"),
				});
			})
			.catch(() => {
				MySwal.fire({
					title:
						type === "add" ? (
							<p>Gagal menambahkan divisi</p>
						) : (
							<p>Gagal mengubah data divisi</p>
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
						Nama Divisi
					</Label>
					<InputGroup>
						<InputGroupText>
							<Hash size={15} />
						</InputGroupText>
						<Input
							id="divname"
							name="divname"
							defaultValue={
								divForm.DivName.length !== 0
									? divForm.DivName
									: ""
							}
							disabled={type === "details"}
							placeholder="K2...."
							innerRef={divNameRef}
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
								divForm.DivDesc.length !== 0
									? divForm.DivDesc
									: ""
							}
							disabled={type === "details"}
							placeholder="Keterangan...."
							innerRef={descRef}
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
							value={divForm.Status}
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

export default DivForm;
