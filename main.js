const validarPhone = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' ', '-'];
let phoneArray = [];
let buttonEditUser = [];
let buttonDeleteUser = [];
let busqueda = '';

// GET - LISTAR USUARIOS

const listarUsuarios = () => {
	fetch(`https://tp-js-2-api-wjfqxquokl.now.sh/users`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	})
		.then(res => res.json())
		.then(data => {
			const rowsData = document.querySelector('#tableBody');
			let nuevoHTML = '';

			data.forEach((user, i) => {
				const fullname = data[i].fullname;
				const email = data[i].email;
				const address = data[i].address;
				const phone = data[i].phone;

				nuevoHTML = nuevoHTML + `
				<tr class="rowsData">
					<td class="firstCell">
						<label class="checkboxContainer">
							<input type="checkbox">
							<span class="checkmark"></span>
						</label>
					</td>
					<td class="smallCell">${fullname}</td>
					<td class="bigCell">${email}</td>
					<td class="smallCell">${address}</td>
					<td class="smallCell">${phone}</td>
					<td  class="lastCell">
						<div class="actions">
							<button><i id="editIcon" class="material-icons" title="Edit">&#xE254;</i></button>
							<button><i id="deleteIcon" class="material-icons" title="Delete" id="delete">&#xE872;</i></button>
						</div>
					</td>
				</tr>`
			});

			rowsData.innerHTML = nuevoHTML;

			buttonEditUser = document.querySelectorAll('#editIcon');
			editarUsuario();
			buttonDeleteUser = document.querySelectorAll('#deleteIcon');
			eliminarUsuario();
		});
};

listarUsuarios();


// POST- AGREGAR USUARIOS

const agregarUsuario = () => {

	const newModal = document.getElementById('newEmployeeModal');
	newModal.innerHTML = `
		<div id="newEmployeeModal" class="display">
			<div class="newModal">
				<div id="modalTitle">
				<h3>Add Employee</h3>
				<i id="close" class="material-icons">close</i>
				</div>
				<div id="modalForm">
				<form method="post">
					<div class="formItemsContainer">
						<div class="formItems">
							<label for="Full Name">Full Name</label>
							<label id="fullnameError"></label>
							<input required="" type="text" name="fullname" id="fullname" value=""  id="fullname" value="">
						</div>
						<div class="formItems">
							<label for="Email">Email</label>
							<label id="emailError"></label>
							<input required="" type="email" name="email" id="email" value="">
						</div>
						<div class="formItems">
							<label for="Address">Address</label>
							<label id="addressError"></label>
							<textarea required="" name="address" id="address" cols="30" rows="10" value=""></textarea>
						</div>					
						<div class="formItems">
							<label for="Phone">Phone</label>
							<label id="phoneError"></label>
							<input required="" type="tel" name="phone" id="phone value="">
						</div>
					</div>
					<div id="modalButtons">
						<div class="modalButtonsContainer">
							<button id="cancel" class="botonVerde">Cancel</button>
							<input id="add" class="botonVerde" type="submit" value="Add">
						</div>
					</div>
				</form>
			</div>
		</div>`

	const modalCloseButton = document.getElementById('close');
	modalCloseButton.onclick = () => newModal.innerHTML = ``;

	const modalCancelButton = document.getElementById('cancel');
	modalCancelButton.onclick = () => newModal.innerHTML = ``;

	const modalAddButton = document.getElementById('add');
	modalAddButton.onclick = () => {
		
		const formularios = document.forms;
		const formAddNewModal = formularios[0];

		formAddNewModal.onsubmit = () => {

			const fullnameValue = formAddNewModal[0].value;
			const emailValue = formAddNewModal[1].value;
			const addressValue = formAddNewModal[2].value;
			const phoneValue = formAddNewModal[3].value;

			phoneArray = phoneValue.split('');

			if (fullnameValue.length > 50) {
				const fullnameLabel = document.getElementById('fullnameError');
				fullnameLabel.innerHTML = '<p>Maximo 50 caracteres</p>';
				fullnameLabel.classList.add('error');
			}
			else if (addressValue.length > 60) {
				const addressLabel = document.getElementById('addressError');
				addressLabel.innerHTML = '<p>Maximo 60 caracteres</p>';
				addressLabel.classList.add('error');
			}
			// else if (phoneArray) {
			// phoneArray.forEach(i => {
			// 	if (validarPhone.includes(phoneArray[i]) == false) {
			// 	const phoneLabel = document.getElementById('phoneError');
			// 	phoneLabel.innerHTML = '<p>Admite numeros, guiones y/o espacios</p>';
			// 	phoneLabel.classList.add('error');	
			// 	}
			// });
			// }
			else {
				let newUser = {
					fullname: `${fullnameValue}`,
					email: `${emailValue}`,
					address: `${addressValue}`,
					phone: `${phoneValue}`,
				};
				fetch(`https://tp-js-2-api-wjfqxquokl.now.sh/users`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newUser),
				})
					.then(newUser => newUser.json())
				newModal.innerHTML = ``;
			};
			listarUsuarios();
		};
	};
};

const buttonAddNewEmployee = document.getElementById('buttonAddNewEmployee');
buttonAddNewEmployee.onmouseenter = () => buttonAddNewEmployee.classList.add('oscurecer');
buttonAddNewEmployee.onmouseleave = () => buttonAddNewEmployee.classList.remove('oscurecer');
buttonAddNewEmployee.onclick = () => agregarUsuario();


// GET - FILTRAR USUARIOS

const filtrarUsuario = (busqueda) => {

	if (busqueda == '' || busqueda == undefined) {
		listarUsuarios();
	} else {
		fetch(`https://tp-js-2-api-wjfqxquokl.now.sh/users?search=${busqueda}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		})
			.then(res => res.json())
			.then(data => {
				const rowsData = document.querySelector('#tableBody');
				let nuevoHTML = '';
			
				data.forEach((user, i) => {
					const fullname = data[i].fullname;
					const email = data[i].email;
					const address = data[i].address;
					const phone = data[i].phone;

					nuevoHTML = nuevoHTML + `
					<tr class="rowsData">
						<td class="firstCell">
							<label class="checkboxContainer">
								<input type="checkbox">
								<span class="checkmark"></span>
							</label>
						</td>
						<td class="smallCell">${fullname}</td>
						<td class="bigCell">${email}</td>
						<td class="smallCell">${address}</td>
						<td class="smallCell">${phone}</td>
						<td  class="lastCell">
							<div class="actions">
								<button><i id="editIcon" class="material-icons" title="Edit">&#xE254;</i></button>
								<button><i id="deleteIcon" class="material-icons" title="Delete" id="delete">&#xE872;</i></button>
							</div>
						</td>
					</tr>`
				});

				rowsData.innerHTML = nuevoHTML;

				buttonEditUser = document.querySelectorAll('#editIcon');
				editarUsuario(busqueda);
				buttonDeleteUser = document.querySelectorAll('#deleteIcon');
				eliminarUsuario(busqueda);
			});
	};
};

const filterButton = document.getElementById('filtrar');
filterButton.onclick = () => {
	const form = document.forms[0];
	const filterSubmit = form.elements[0];
	busqueda = filterSubmit.value;

	form.onsubmit = e => {
		e.preventDefault();
		filtrarUsuario(busqueda);
	};
};


// PUT - EDITAR USUARIOS

const editarUsuario = () => {
	fetch(`https://tp-js-2-api-wjfqxquokl.now.sh/users`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	})
		.then(res => res.json())
		.then(data => {
			fetch(`https://tp-js-2-api-wjfqxquokl.now.sh/users?search=${busqueda}`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			})
				.then(res => res.json())
				.then(data => {
					
					buttonEditUser.forEach((user, i) => {
						const datosUsuario = data[i]
						const idValue = datosUsuario.id;

						buttonEditUser[i].onclick = () => {
							const datosUsuario = data[i]
							const fullname = datosUsuario.fullname;
							const email = datosUsuario.email;
							const address = datosUsuario.address;
							const phone = datosUsuario.phone;

							const editModal = document.getElementById('editUserModal');
							editModal.innerHTML = `
							<div id="editUserModal" class="display">
								<div class="editModal">
									<div id="modalTitle">
									<h3>Edit Employee</h3>
									<i id="close" class="material-icons">close</i>
									</div>
									<div id="modalForm">
									<form method="post" id="editUserForm">
										<div class="formItemsContainer">
											<div class="formItems">
												<label for="Full Name">Full Name</label>
												<label id="fullnameEditError"></label>
												<input required="" type="text" name="fullname" id="fullname" value="${fullname}">
											</div>
											<div class="formItems">
												<label for="Email">Email</label>
												<label id="emailEditError"></label>
												<input required="" type="email" name="email" id="email" value="${email}">
											</div>
											<div class="formItems">
												<label for="Address">Address</label>
												<label id="addressEditError"></label>
												<textarea required="" name="address" id="address" cols="30" rows="10" value="${address}"></textarea>
											</div>					
											<div class="formItems">
												<label for="Phone">Phone</label>
												<label id="phoneEditError"></label>
												<input required="" type="tel" name="phone" id="phone" value="${phone}">
											</div>
										</div>
										<div id="modalButtons">
											<div class="modalButtonsContainer">
												<button id="cancel" class="botonVerde">Cancel</button>
												<input id="save" class="botonVerde" type="submit" value="Save">
											</div>
										</div>
									</form>
								</div>
							</div>`

							const modalCloseButton = document.getElementById('close');
							modalCloseButton.onclick = () => editModal.innerHTML = ``;

							const modalCancelButton = document.getElementById('cancel');
							modalCancelButton.onclick = () => editModal.innerHTML = ``;

							const modalSaveButton = document.getElementById('save');
							modalSaveButton.onclick = () => {

								const editForm = document.getElementById('editUserForm');
								editForm.onsubmit = e => {
									e.preventDefault();
									const editFullname = editForm[0].value;
									const editEmail = editForm[1].value;
									const editAddress = editForm[2].value;
									const editPhone = editForm[3].value;

									phoneArray = editPhone.split('');

									if (editFullname.length > 50) {
										const fullnameEditLabel = document.getElementById('fullnameEditError');
										fullnameEditLabel.innerHTML = '<p>Maximo 50 caracteres</p>';
										fullnameEditLabel.classList.add('error');
									}
									else if (editAddress.length > 60) {
										const addressEditLabel = document.getElementById('addressEditError');
										addressEditLabel.innerHTML = '<p>Maximo 60 caracteres</p>';
										addressEditLabel.classList.add('error');
									}
									// else if (phoneArray) {
									// phoneArray.forEach(i => {
									// 	if (validarPhone.includes(phoneArray[i]) == false) {
									// 	const phoneEditLabel = document.getElementById('phoneError');
									// 	phoneEditLabel.innerHTML = '<p>Admite numeros, guiones y/o espacios</p>';
									// 	phoneEditLabel.classList.add('error');	
									// 	}
									// });
									// }
									else {
										fetch(`https://tp-js-2-api-wjfqxquokl.now.sh/users/${idValue}`, {
											method: 'PUT',
											headers: { 'Content-Type': 'application/json' },
											body: JSON.stringify({
												fullname: `${editFullname}`,
												email: `${editEmail}`,
												address: `${editAddress}`,
												phone: `${editPhone}`,
											}),
										})
											.then(res => res.json());
										editModal.innerHTML = ``;
										fetch(`https://tp-js-2-api-wjfqxquokl.now.sh/users?search=${busqueda}`, {
											method: 'GET',
											headers: { 'Content-Type': 'application/json' },
										})
											.then(res => res.json())
										filtrarUsuario(busqueda);
									};
								};
							};
						};
					});
				});
		});
};


// DELETE - ELIMINAR USUARIOS

const eliminarUsuario = () => {
	fetch(`https://tp-js-2-api-wjfqxquokl.now.sh/users`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	})
		.then(res => res.json())
		.then(data => {
			fetch(`https://tp-js-2-api-wjfqxquokl.now.sh/users?search=${busqueda}`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			})
				.then(res => res.json())
				.then(data => {
					
					buttonDeleteUser.forEach((user, i) => {
						
						buttonDeleteUser[i].onclick = () => {
							const datosUsuario = data[i]
							const idValue = datosUsuario.id;

							const deleteModal = document.getElementById('deleteUserModal');
							deleteModal.innerHTML = `
									<div id="deleteUserModal" class="display">
										<div class="deleteModal">
											<div id="modalTitle">
												<h3>Delete Employee</h3>
												<i id="close" class="material-icons">close</i>
											</div>
											<div id="modalMsg">
												<h4>Are you sure you want to delete these Records?</h4>
												<p>This action cannot be undone.</p>
											</div>
											<div id="modalButtons">
												<div class="modalButtonsContainer">
													<button id="cancel" class="botonVerde">Cancel</button>
													<input id="delete" class="botonVerde" type="submit" value="Delete">
												</div>
											</div>
										</div>		
								</div>`

							const modalCloseButton = document.getElementById('close');
							modalCloseButton.onclick = () => deleteModal.innerHTML = ``;
							
							const modalCancelButton = document.getElementById('cancel');
							modalCancelButton.onclick = () => deleteModal.innerHTML = ``;
							
							const modalDeleteButton = document.getElementById('delete');
							modalDeleteButton.onclick = () => {
								
								fetch(`https://tp-js-2-api-wjfqxquokl.now.sh/users/${idValue}`, {
									method: 'DELETE',
									headers: { 'Content-Type': 'application/json' },
								})
									.then(data => data.json())
								deleteModal.innerHTML = ``;
								fetch(`https://tp-js-2-api-wjfqxquokl.now.sh/users?search=${busqueda}`, {
									method: 'GET',
									headers: { 'Content-Type': 'application/json' },
								})
									.then(res => res.json())
								filtrarUsuario(busqueda);
							};
						};
					});
				});
		});
};