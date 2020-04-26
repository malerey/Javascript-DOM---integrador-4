// Flor, en primer lugar mil disculpas por la tardanza de esta correccion. 

// 1. Tu trabajo esta fantastico en general. Cumple a la perfeccion el diseño solicitado, 
// todo funciona como se espera y la comunicacion con la API esta muy bien lograda. 
// En general, un trabajo excelente. 

// 2. Un comentario en general es que estas escribiendo el fetch a la manera "larga" que
// en esta API es innecesaria siempre que hagas un get
// Quiero decir, vos escribis en general esto:

// fetch(`https://tp-js-2-api-wjfqxquokl.now.sh/users`, {
// 	method: 'GET',
// 	headers: { 'Content-Type': 'application/json' },
// })

// pero tanto el metodo GET como esos headers son los que JavaScript pone por default, 
// por lo que podriamos escribir esto

// fetch(`https://tp-js-2-api-wjfqxquokl.now.sh/users`)

// sin que cambie el comportamiento (solo en metodo GET: en POST, PUT y DELETE hay que aclarar el metodo)

// 3. Como bien notaste vos, hay mucho codigo que se repite y que deberia estar en una funcion. 
// Por ejemplo, toda la construccion de la tabla tras hacer el fetch, se repite tanto en filtrarUsuario() como en 
// listarUsuarios(). Tambien la validacion del form en editar y agregar usuario. 

// 4. Tus botones de editar y borrar tardan en arrancar porque estas llamando innecesariamente algunas funciones
// en mostrarUsuarios() (te comente en donde), y eso hace que la pagina tarde en responder

// Te deje varios comentarios en el codigo para clarificar algunas cosas, pero son todas cositas a mejorar, 
// tu trabajo es muy bueno realmente!!



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

				// Ojo aca, estamos usando data[i], que es una construccion que necesitamos en el for, 
				// pero innecesaria en el forEach o map. 

				// El forEach nos permite recorrer un array y a cada elemento de ese array le va a asignar
				// el nombre que nosotras hayamos puesto en el primer parametro (en este caso, user)
				// No es buena practica escribir data[i] en este caso, sino user
				// El comportamiento es exactamente el mismo, y la sintaxis sera mas clara. 


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

							// no entiendo por que aca estas llamando a las funciones editarUsuario() y eliminarUsuario(). 
				// No queremos que se ejecuten apenas se muestran los datos, sino solamente cuando se hace clic 
				// en los botones. 
				// Tal como esta ahora el codigo, se ejecutan ambas funciones apenas se cargan los usuarios, 
				// (lo podes comprobar poniendo un console log al comienzo de esas funciones)
				// haciendo que la API reciba dos llamadas innecesarias y que la pagina tarde un poquito mas en cargar. 
				// Ambas llamadas deberian borrarse. 
				// Si te quedan dudas sobre esto escribime. 

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
// aca falta un e.preventDefault()
// Fijate que si escribo por ej un nombre muy largo, 
// el error parpadea antes de que el formulario se envie, sin mostrarmelo bien

			const fullnameValue = formAddNewModal[0].value;
			const emailValue = formAddNewModal[1].value;
			const addressValue = formAddNewModal[2].value;
			const phoneValue = formAddNewModal[3].value;

			phoneArray = phoneValue.split('');

			// ojo en esta validacion: estas usando un if/else
			// eso significa que solo voy a tener un solo error, 
			// si escribo un nombre largo y una direccion larga, 
			// solo voy a ver el error en el nombre, 
			// cuando deberia ver un error en ambos. 

			// Deberian ser dos if sueltos. 
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

			// Es buena idea la de transformar el telefono en un array para validarlo
			// Lo que falló es que ahora tenemos dos arrays (phoneArray y validarPhone), 
			// por lo que deberiamos hacer dos loops.
			// Por ejemplo

// else if (phoneArray.length) {
// 			phoneArray.forEach(character => {
// 				if (!validarPhone.includes(character)) {
// 				const phoneLabel = document.getElementById('phoneError');
// 				phoneLabel.innerHTML = '<p>Admite numeros, guiones y/o espacios</p>';
// 				phoneLabel.classList.add('error');	
// 				}
// 			})
// 		}

// Otra cosa a tomar en cuenta es que un array, aunque este vacio, siempre se valida como true
// Asi que si escribimos if (phoneArray) siempre vamos a entrar al if
// Si queremos entrar solamente si el usuario escribio algo en el campo, por ejemplo, 
// deberiamos escribir phoneArray.length 


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
			// Notaste que la lista de usuarios no se actualiza despues de agregar un usuario nuevo,
			// a pesar de que estas llamando a esta funcion?
			// Eso es porque el "fetch" tarda un poquito en ejercutarse (entre que se llama a la API y eso)
			// JavaScript deja el fetch ejecutar, y sigue haciendo el resto del codigo, 
			// que en este caso es esta funcion listarUsuarios(). 
			// El resultado: listamos los usuarios *antes* de que se termine el fetch, y por lo tanto, 
			// antes de que se agregue el usuario nuevo
			// Si queremos que algo ocurra cuando termina un fetch, hay que ponerlo adentro de un .then 
			// Y no aca afuera. 
			// Si agregamos un segundo .then y ponemos esta funcion ahi vas a ver que la lista de usuarios se actualiza bien. 
			// O sea, en la linea 235, apretar enter y agregar esto:
			//  .then(data => listarUsuarios())

			// listarUsuarios();
		};
	};
};

const buttonAddNewEmployee = document.getElementById('buttonAddNewEmployee');
buttonAddNewEmployee.onmouseenter = () => buttonAddNewEmployee.classList.add('oscurecer');
buttonAddNewEmployee.onmouseleave = () => buttonAddNewEmployee.classList.remove('oscurecer');
buttonAddNewEmployee.onclick = () => agregarUsuario();


// GET - FILTRAR USUARIOS

const filtrarUsuario = (busqueda) => {

	// esta muy bien este chequeo al principio, para no hacer un fetch innecesario
	// Lo podemos mejorar asi:
	// if (!busqueda) {
		// tanto el string vacio como undefined valen en !busqueda asi que el funcionamiento seria el mismo, 
		// pero el codigo seria mas claro 
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
					// mismo comentario al forEach que te hice antes
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

// mismo comentario que antes, estas dos llamadas a las funciones son innecesarias 
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
// este primer fetch parece innecesario
// recorda que los fetch tardan tiempo, asi que para editar un usuario
// estamos gastando 1 o 2 segundos del tiempo del usuario
// Y veo que la variable "data" del primer fetch no se usa en ningun lado,
// por lo que todo el fetch podria sacarse
// Fijate como se puede mejorar esta funcion 
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

							// La textarea no muestra la direccion porque el elemento <textarea> de html no tiene un atributo "value"
							// sino que debemos escribir entre la etiqueta de apertura y de cierre
							// asi
							// <textarea required="" name="address" id="address" cols="30" rows="10">${address}</textarea>


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
