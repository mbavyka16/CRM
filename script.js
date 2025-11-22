let contactsWrap, contactsCount = 0, addContactsAndBTNWrap,
	addContactsBTN, modalWindowMode, clientsTable, addChangeModal, newClientH2,
	changeClientH2Wrap, idChangeModal, surnameInp, surnameLBL, nameInp, nameLBL, 
	lastnameInp, lastnameLBL, сlientIdChangeDel, cancelNewClientBtn, delClientBtn,
	emptyDiv, loadingOrEmptyDiv, loadingIcon, delConfirmModalBG, delConfirmBtn,
	cancelDelBtn, delModalCloseBtn, idTH, fioTH, createdDateTimeTH, updatedDateTimeTH,
	sortColumnSortMode = "id-ascending", searchField, timeout, searched = false,
	openedContact = null, contactClicked = false;

async function getAllClients()
{
	const RESPONSE = await fetch("http://localhost:3000/api/clients");
	const CLIENTS = await RESPONSE.json();
	return CLIENTS;
}

function closeClearAddChangeModal(modal, surnameInp, surnameLBL, nameInp, nameLBL, lastnameInp, lastnameLBL, errorsDiv, contactsWrap)
{
	document.body.classList.remove("overflow-hidden");
	modal.classList.remove("show-add-change-modal");
	surnameInp.value = nameInp.value = lastnameInp.value = "";
	surnameLBL.classList.remove("label-up");
	nameLBL.classList.remove("label-up");
	lastnameLBL.classList.remove("label-up");
	contactsWrap.innerHTML = "";
	errorsDiv.textContent = "";
	errorsDiv.classList.remove("show-error-msg");
	addContactsAndBTNWrap.classList.remove("mb0");
	addContactsAndBTNWrap.classList.remove("bigger-padding");
	addContactsBTN.classList.remove("display-none");
	contactsWrap.classList.remove("mb0");
	contactsCount = 0;
}

function delContactBtnShowHide(contactDataElem, deleteBtnElem)
{
	if(contactDataElem.value)
	{
		deleteBtnElem.classList.add("show-delete-contact");
		contactDataElem.classList.add("less-width");
	}
	else
	{
		deleteBtnElem.classList.remove("show-delete-contact");
		contactDataElem.classList.remove("less-width");
	}
}

let openedSelect = null, selectClicked = false;

function selectShowHide(currentTypeWrap)
{
	if(openedSelect === null)
	{
		currentTypeWrap.classList.add("show-select");
		openedSelect = currentTypeWrap;
		selectClicked = true;
	}
	else if(currentTypeWrap === openedSelect)
	{
		currentTypeWrap.classList.remove("show-select");
		openedSelect = null;
		selectClicked = true;
	}
	else
	{
		currentTypeWrap.classList.add("show-select");
		openedSelect.classList.remove("show-select");
		openedSelect = currentTypeWrap;
		selectClicked = true;
	}

}

function sortClients(clients) 
{
	switch(sortColumnSortMode)
	{
		case "id-ascending":
			return clients.sort((client1, client2) => { 
				if(client1.id < client2.id) return -1;
				if(client1.id > client2.id) return 1;
				if(client1.id === client2.id) return 0;
			});
		case "id-descending":
			return clients.sort((client1, client2) => { 
				if(client1.id > client2.id) return -1;
				if(client1.id < client2.id) return 1;
				if(client1.id === client2.id) return 0;
			});
		case "fio-ascending":
			return clients.sort((client1, client2) => {
				if((client1.surname.toLowerCase() + client1.name.toLowerCase() + client1.lastName.toLowerCase()) < (client2.surname.toLowerCase() + client2.name.toLowerCase() + client2.lastName.toLowerCase())) return -1;
				if((client1.surname.toLowerCase() + client1.name.toLowerCase() + client1.lastName.toLowerCase()) > (client2.surname.toLowerCase() + client2.name.toLowerCase() + client2.lastName.toLowerCase())) return 1;
				if((client1.surname.toLowerCase() + client1.name.toLowerCase() + client1.lastName.toLowerCase()) === (client2.surname.toLowerCase() + client2.name.toLowerCase() + client2.lastName.toLowerCase())) return 0;
			});
		case "fio-descending":
			return clients.sort((client1, client2) => {
				if((client1.surname.toLowerCase() + client1.name.toLowerCase() + client1.lastName.toLowerCase()) > (client2.surname.toLowerCase() + client2.name.toLowerCase() + client2.lastName.toLowerCase())) return -1;
				if((client1.surname.toLowerCase() + client1.name.toLowerCase() + client1.lastName.toLowerCase()) < (client2.surname.toLowerCase() + client2.name.toLowerCase() + client2.lastName.toLowerCase())) return 1;
				if((client1.surname.toLowerCase() + client1.name.toLowerCase() + client1.lastName.toLowerCase()) === (client2.surname.toLowerCase() + client2.name.toLowerCase() + client2.lastName.toLowerCase())) return 0;
			});
		case "createdAt-ascending":
			return clients.sort((client1, client2) => {
				if(new Date(client1.createdAt).getTime() < new Date(client2.createdAt).getTime()) return -1;
				if(new Date(client1.createdAt).getTime() > new Date(client2.createdAt).getTime()) return 1;
				if(new Date(client1.createdAt).getTime() === new Date(client2.createdAt).getTime()) return 0;
			});
		case "createdAt-descending":
			return clients.sort((client1, client2) => {
				if(new Date(client1.createdAt).getTime() > new Date(client2.createdAt).getTime()) return -1;
				if(new Date(client1.createdAt).getTime() < new Date(client2.createdAt).getTime()) return 1;
				if(new Date(client1.createdAt).getTime() === new Date(client2.createdAt).getTime()) return 0;
			});
		case "updatedAt-ascending":
			return clients.sort((client1, client2) => {
				if(new Date(client1.updatedAt).getTime() < new Date(client2.updatedAt).getTime()) return -1;
				if(new Date(client1.updatedAt).getTime() > new Date(client2.updatedAt).getTime()) return 1;
				if(new Date(client1.updatedAt).getTime() === new Date(client2.updatedAt).getTime()) return 0;
			});
		case "updatedAt-descending":
			return clients.sort((client1, client2) => {
				if(new Date(client1.updatedAt).getTime() > new Date(client2.updatedAt).getTime()) return -1;
				if(new Date(client1.updatedAt).getTime() < new Date(client2.updatedAt).getTime()) return 1;
				if(new Date(client1.updatedAt).getTime() === new Date(client2.updatedAt).getTime()) return 0;
			});
	}
}

function createContact(contactType, contactData)
{
	contactsCount++;
	if(contactsCount === 1) addContactsAndBTNWrap.classList.add("bigger-padding");
	const CONTACT_WRAPPER = document.createElement("div");
	CONTACT_WRAPPER.classList.add("contact-wrapper");
	CONTACT_WRAPPER.id = "contact" + contactsCount;

	const CONTACT_TYPE_WRAP = document.createElement("div");
	CONTACT_TYPE_WRAP.classList.add("contact-type-wrapper");
	const CONTACT_TYPE = document.createElement("span");
	CONTACT_TYPE.id = "contact" + contactsCount + "-type";
	CONTACT_TYPE.classList.add("contact-type");
	if(contactType !== undefined) CONTACT_TYPE.textContent = contactType;
	else CONTACT_TYPE.textContent = "Телефон";
	CONTACT_TYPE_WRAP.append(CONTACT_TYPE);
	const CONTACT_TYPE_SELECT = document.createElement("ul");
	CONTACT_TYPE_SELECT.classList.add("contact-type-select");

	for(let i = 0; i < 5; i++)
	{
		let selectItem = document.createElement("li");
		selectItem.classList.add("contact-select-item");
		switch(i)
		{
			case 0:
				selectItem.id = "contact" + contactsCount + "-select-phone";
				selectItem.textContent = "Телефон";
				break;
			case 1:
				selectItem.id = "contact" + contactsCount + "-select-email";
				selectItem.textContent = "Email";
				break;
			case 2:
				selectItem.id = "contact" + contactsCount + "-select-fb";
				selectItem.textContent = "Facebook";
				break;
			case 3:
				selectItem.id = "contact" + contactsCount + "-select-vk";
				selectItem.textContent = "VK";
				break;
			case 4:
				selectItem.id = "contact" + contactsCount + "-select-other";
				selectItem.textContent = "Другое";
				break;
		}
		selectItem.addEventListener("click", (e) => {
			let contactNumber;
			if(selectItem.id.charAt(8) === "-") contactNumber = selectItem.id.charAt(7);
			else contactNumber = 10;
			document.getElementById("contact" + contactNumber +"-type").textContent = selectItem.textContent;
			openedSelect.classList.toggle("show-select");
			openedSelect = null;
			secondClickAfterSelectOpened = false;
			e.stopPropagation();
		});
		CONTACT_TYPE_SELECT.append(selectItem);
	}
	CONTACT_TYPE_WRAP.append(CONTACT_TYPE_SELECT);
	CONTACT_TYPE_WRAP.addEventListener("click", () => {
		selectShowHide(CONTACT_TYPE_WRAP);
	});
	CONTACT_WRAPPER.append(CONTACT_TYPE_WRAP);

	const CONTACT_DATA = document.createElement("input");
	CONTACT_DATA.classList.add("contact-data");
	CONTACT_DATA.id = "contact" + contactsCount + "-data";
	CONTACT_DATA.type = "text";
	CONTACT_DATA.placeholder = document.documentElement.clientWidth < 768 ? "Введите данные" : "Введите данные контакта";
	CONTACT_WRAPPER.append(CONTACT_DATA);

	const DEL_CONTACT_BTN = document.createElement("div");
	DEL_CONTACT_BTN.classList.add("delete-contact");
	DEL_CONTACT_BTN.id = "delete-contact" + contactsCount;

	CONTACT_DATA.addEventListener("input", () => {
		delContactBtnShowHide(CONTACT_DATA, DEL_CONTACT_BTN);
	});
	if(contactData !== undefined)
	{
		CONTACT_DATA.value = contactData;
		delContactBtnShowHide(CONTACT_DATA, DEL_CONTACT_BTN);
	}

	DEL_CONTACT_BTN.addEventListener("click", () => {
		const CONTACTS_ELEMENTS = { 
			contactsData: document.getElementsByClassName("contact-data")
		};
		CONTACTS_ELEMENTS.contactsTypes = document.getElementsByClassName("contact-type");
		const CONTACTS_VALUES = {contactsData: [], contactsTypes: []};
		let deletingContactNumber, contactNumber;
		if(DEL_CONTACT_BTN.id.length === 16) deletingContactNumber = 10;
		else deletingContactNumber = DEL_CONTACT_BTN.id.charAt(14);
		for(let i = 0; i < CONTACTS_ELEMENTS.contactsData.length; i++)
		{
			if(CONTACTS_ELEMENTS.contactsData[i].id.length === 14) contactNumber = 10;
			else contactNumber = CONTACTS_ELEMENTS.contactsData[i].id.charAt(7);
			if(Number(deletingContactNumber) !== Number(contactNumber))
			{
				CONTACTS_VALUES.contactsData.push(CONTACTS_ELEMENTS.contactsData[i].value);
				CONTACTS_VALUES.contactsTypes.push(CONTACTS_ELEMENTS.contactsTypes[i].textContent);
			}
			else continue;
		}
		contactsCount = 0;
		contactsWrap.innerHTML = "";
		for(let i = 0; i < CONTACTS_VALUES.contactsData.length; i++)
		{
			createContact(CONTACTS_VALUES.contactsTypes[i], CONTACTS_VALUES.contactsData[i]);
		}
		if(contactsCount === 0) addContactsAndBTNWrap.classList.remove("bigger-padding");
		if(addContactsBTN.classList.contains("display-none"))
		{
			addContactsBTN.classList.remove("display-none");
			contactsWrap.classList.remove("mb0");
		}
	});
	
	CONTACT_WRAPPER.append(DEL_CONTACT_BTN);
	contactsWrap.append(CONTACT_WRAPPER);
	if(contactsCount === 10)
	{
		addContactsBTN.classList.add("display-none");
		contactsWrap.classList.add("mb0");
	}
}

function getAllContacts()
{
	const CONTACT_TYPE_DATA_ELEMENTS = {
		typeElements: document.getElementsByClassName("contact-type"),
		dataElements: document.getElementsByClassName("contact-data")
	};
	let contacts = [];
	for(let i = 0; i < CONTACT_TYPE_DATA_ELEMENTS.typeElements.length; i++)
	{
		contacts.push({
			type: CONTACT_TYPE_DATA_ELEMENTS.typeElements[i].textContent,
			value: CONTACT_TYPE_DATA_ELEMENTS.dataElements[i].value.trim()
		});
	}
	return contacts;
}


function generateClientsTable(clients)
{
	clientsTable.innerHTML = "";
	for(const client of clients)
	{
		const CLIENT_TR = document.createElement("tr");
		CLIENT_TR.id = `tr${client.id}`;
		const ID_TD = document.createElement("td");
		ID_TD.classList.add("id-td");
		ID_TD.textContent = client.id;

		const FIO_TD = document.createElement("td");
		FIO_TD.classList.add("fio-td");
		FIO_TD.textContent = `${client.surname} ${client.name} ${client.lastName}`;

		const CREATION_TIME_TD = document.createElement("td");
		const CREATION_DATE_DIV = document.createElement("div");
		CREATION_TIME_TD.classList.add("datetime-created-td");
		const CREATION_TIME_WRAP = document.createElement("div");
		CREATION_TIME_WRAP.classList.add("times");
		const CREATION_TIME = new Date(client.createdAt);
		CREATION_DATE_DIV.textContent = `${CREATION_TIME.getDate()}.${CREATION_TIME.getMonth() < 9 ? "0" + (CREATION_TIME.getMonth() + 1) : CREATION_TIME.getMonth() + 1}.${CREATION_TIME.getFullYear()}`;
		const CREATION_TIME_DIV = document.createElement("div");
		CREATION_TIME_DIV.classList.add("gray-time");
		CREATION_TIME_DIV.textContent = `${CREATION_TIME.getHours()}:${CREATION_TIME.getMinutes() < 10 ? "0" + CREATION_TIME.getMinutes() : CREATION_TIME.getMinutes()}`;
		CREATION_TIME_WRAP.append(CREATION_DATE_DIV);
		CREATION_TIME_WRAP.append(CREATION_TIME_DIV);
		CREATION_TIME_TD.append(CREATION_TIME_WRAP);

		const UPDATED_TIME_TD = document.createElement("td");
		const UPDATED_DATE_DIV = document.createElement("div");
		UPDATED_TIME_TD.classList.add("datetime-updated-td");
		const UPDATED_TIME_WRAP = document.createElement("div");
		UPDATED_TIME_WRAP.classList.add("times");
		const UPDATED_TIME = new Date(client.updatedAt);
		UPDATED_DATE_DIV.textContent = `${UPDATED_TIME.getDate()}.${UPDATED_TIME.getMonth() < 9 ? "0" + (UPDATED_TIME.getMonth() + 1) : UPDATED_TIME.getMonth() + 1}.${UPDATED_TIME.getFullYear()}`;
		const UPDATED_TIME_DIV = document.createElement("div");
		UPDATED_TIME_DIV.classList.add("gray-time");
		UPDATED_TIME_DIV.textContent = `${UPDATED_TIME.getHours()}:${UPDATED_TIME.getMinutes() < 10 ? "0" + UPDATED_TIME.getMinutes() : UPDATED_TIME.getMinutes()}`;
		UPDATED_TIME_WRAP.append(UPDATED_DATE_DIV);
		UPDATED_TIME_WRAP.append(UPDATED_TIME_DIV);
		UPDATED_TIME_TD.append(UPDATED_TIME_WRAP);

		const CONTACTS_TD = document.createElement("td");
		CONTACTS_TD.classList.add("contacts-td");
		const CONTACTS_WRAP = document.createElement("div");
		CONTACTS_WRAP.classList.add("contacts-td-wrapper");
		CONTACTS_TD.append(CONTACTS_WRAP);
		let contactsCounter = 0;
		for(const contact of client.contacts)
		{
			contactsCounter++;
			const CONTACT_WRAP = document.createElement("div");
			CONTACT_WRAP.classList.add("t-contact-wrapper");
			if(contactsCounter > 4)
				CONTACT_WRAP.classList.add("hidden-contact", "hc" + client.id);
			if(contactsCounter === 5)
			{
				const SHOW_HIDDEN_CONTACTS = document.createElement("div");
				SHOW_HIDDEN_CONTACTS.classList.add("show-hidden-contacts");
				SHOW_HIDDEN_CONTACTS.textContent = "+" + (client.contacts.length - 4);
				SHOW_HIDDEN_CONTACTS.addEventListener("click", () => {
					const HIDDEN_CONTACTS = document.getElementsByClassName("hc" + client.id);
					for(const HIDDEN_CONTACT of HIDDEN_CONTACTS)
					{
						HIDDEN_CONTACT.classList.remove("hidden-contact");
					}
					SHOW_HIDDEN_CONTACTS.remove();
				});
				CONTACTS_WRAP.append(SHOW_HIDDEN_CONTACTS);
			}
			const CONTACT_IMG = document.createElement("img");
			switch(contact.type)
			{
				case "Телефон":
					CONTACT_IMG.src = "imgs/table-clients/phone-icon.svg";
					CONTACT_IMG.alt = "Иконка телефона";
					break;
				case "Email":
					CONTACT_IMG.src = "imgs/table-clients/email-icon.svg";
					CONTACT_IMG.alt = "Иконка электронной почты";
					break;
				case "Facebook":
					CONTACT_IMG.src = "imgs/table-clients/fb-icon.svg";
					CONTACT_IMG.alt = "Иконка Facebook";
					break;
				case "VK":
					CONTACT_IMG.src = "imgs/table-clients/vk-icon.svg";
					CONTACT_IMG.alt = "Иконка VK";
					break;
				case "Другое":
					CONTACT_IMG.src = "imgs/table-clients/other-contact-icon.svg";
					CONTACT_IMG.alt = "Иконка контакта";
					break;
			}
			CONTACT_WRAP.append(CONTACT_IMG);
			const CONTACT_DATA_WRAP = document.createElement("div");
			CONTACT_DATA_WRAP.classList.add("t-contact-data-wrapper");
			CONTACT_WRAP.append(CONTACT_DATA_WRAP);
			const CONTACT_DATA = document.createElement("div");
			CONTACT_DATA.classList.add("t-contact-data");
			CONTACT_DATA.innerHTML = contact.type + ":\u00A0";
			const CONTACT_VALUE_NBSP_NBH = contact.value.replace(/\s/g, "\u00A0").replace(/-/g, "\u2011");
			CONTACT_DATA.innerHTML += "<span class='contact-value-b'>" + CONTACT_VALUE_NBSP_NBH + "</span>";
			CONTACT_DATA_WRAP.append(CONTACT_DATA);
			CONTACT_DATA_WRAP.addEventListener("click", e => {
				e.stopPropagation();
			});
			const CONTACT_EMPTY_SPACE = document.createElement("div");
			CONTACT_EMPTY_SPACE.classList.add("empty-space-in-contact-data");
			CONTACT_DATA_WRAP.append(CONTACT_EMPTY_SPACE);
			CONTACTS_WRAP.append(CONTACT_WRAP);
			CONTACT_WRAP.addEventListener("click", () => {
				if(document.documentElement.clientWidth < 1023) 
				{
					CONTACT_WRAP.classList.add("contact-clicked");
					if(openedContact !== null)
					{
						openedContact.classList.remove("contact-clicked");
					}
					openedContact = CONTACT_WRAP;
					contactClicked = true;
				}
			});
		}

		const ACTIONS_TD = document.createElement("td");
		ACTIONS_TD.classList.add("actions-td");
		const CHANGE_BTN = document.createElement("button");
		CHANGE_BTN.textContent = "Изменить";
		CHANGE_BTN.addEventListener("click", async () => {
			modalWindowMode = "changing";
			document.body.classList.add("overflow-hidden");
			let response = await fetch(`http://localhost:3000/api/clients/${client.id}`);
			const FRESH_CLIENT_DATA = await response.json();
			surnameInp.value = FRESH_CLIENT_DATA.surname;
			surnameLBL.classList.add("label-up");
			nameInp.value = FRESH_CLIENT_DATA.name;
			nameLBL.classList.add("label-up");
			if(FRESH_CLIENT_DATA.lastName !== "")
			{
				lastnameLBL.classList.add("label-up");
				lastnameInp.value = FRESH_CLIENT_DATA.lastName;
			}
			сlientIdChangeDel = FRESH_CLIENT_DATA.id;
			delClientBtn.classList.remove("dn");
			cancelNewClientBtn.classList.add("dn");
			addChangeModal.classList.add("show-add-change-modal");
			newClientH2.classList.add("dn");
			changeClientH2Wrap.classList.remove("dn");
			idChangeModal.textContent = `ID: ${FRESH_CLIENT_DATA.id}`;
			for(const contact of FRESH_CLIENT_DATA.contacts)
				createContact(contact.type, contact.value);
		});
		const ACTIONS_WRAP = document.createElement("div");
		ACTIONS_WRAP.append(CHANGE_BTN);
		ACTIONS_TD.append(ACTIONS_WRAP);

		const DELETE_BTN = document.createElement("button");
		DELETE_BTN.classList.add("delete-btn");
		DELETE_BTN.textContent = "Удалить";
		DELETE_BTN.addEventListener("click", () => {
			сlientIdChangeDel = client.id;
			document.body.classList.add("overflow-hidden");
			delConfirmModalBG.classList.add("db");
		});
		ACTIONS_WRAP.append(DELETE_BTN);

		CLIENT_TR.append(ID_TD);
		CLIENT_TR.append(FIO_TD);
		CLIENT_TR.append(CREATION_TIME_TD);
		CLIENT_TR.append(UPDATED_TIME_TD);
		CLIENT_TR.append(CONTACTS_TD);
		CLIENT_TR.append(ACTIONS_TD);
		clientsTable.append(CLIENT_TR);
	}
}

document.addEventListener("DOMContentLoaded", async () => {

	idTH = document.getElementById("id-th");
	fioTH = document.getElementById("fio-th");
	createdDateTimeTH = document.getElementById("datetime-created-th");
	updatedDateTimeTH = document.getElementById("datetime-updated-th");
	const AYA = document.getElementById("aya");

	loadingOrEmptyDiv = document.getElementById("loading-or-empty");
	loadingIcon = document.getElementById("loading");
	emptyDiv = document.getElementById("empty");
	const ADD_CLIENT_BTN = document.getElementById("add-client-btn");
	addChangeModal = document.getElementById("modal-add-change-wrapper");
	newClientH2 = document.getElementById("new-client-h2");
	changeClientH2Wrap = document.getElementById("change-client-h2-wrap");
	idChangeModal = document.getElementById("id-change-modal");
	const CLOSE_addChangeModal_BTN = document.getElementById("modal-close-btn");
	const ERRORS_DIV = document.getElementById("error-msg");
	cancelNewClientBtn = document.getElementById("cancel-new-client-btn");
	delClientBtn = document.getElementById("delete-client-btn");
	
	surnameInp = document.getElementById("surname-inp");
	surnameLBL = document.getElementById("surname-label");
	nameInp = document.getElementById("name-inp");
	nameLBL = document.getElementById("name-label");
	lastnameInp = document.getElementById("lastname-inp");
	lastnameLBL = document.getElementById("lastname-label");

	clientsTable = document.getElementById("clients-table");
	addContactsBTN = document.getElementById("add-contact-btn");
	addContactsAndBTNWrap = document.getElementById("add-contacts-and-btn-wrapper");
	contactsWrap = document.getElementById("add-contacts-wrapper");
	delConfirmModalBG = document.getElementById("delete-confirm-modal-bg");
	delConfirmBtn = document.getElementById("delconfirm-client-btn");
	cancelDelBtn = document.getElementById("cancel-delete-btn");
	delModalCloseBtn = document.getElementById("delete-modal-close-btn");
	searchField = document.getElementById("search-field");

	const SAVE_BTN = document.getElementById("save-client-btn");


	let clients = await getAllClients();

	if(clients.length === 0)
	{
		loadingIcon.classList.add("display-none");
		emptyDiv.classList.remove("display-none");
	}
	else
	{
		loadingOrEmptyDiv.classList.add("dn");
		clientsTable.classList.add("dt");
		clients = sortClients(clients);
		generateClientsTable(clients);
	}

	// С О Б Ы Т И Я \(*_*)/

	ADD_CLIENT_BTN.addEventListener("click", () => {
		modalWindowMode = "adding";
		document.body.classList.add("overflow-hidden");
		addChangeModal.classList.add("show-add-change-modal");
		newClientH2.classList.remove("dn");
		changeClientH2Wrap.classList.add("dn");
		cancelNewClientBtn.classList.remove("dn");
		delClientBtn.classList.add("dn");
	});

	addChangeModal.addEventListener("click", e => {
		if(e.target === addChangeModal)
		closeClearAddChangeModal(addChangeModal, surnameInp, surnameLBL, nameInp, nameLBL, lastnameInp, lastnameLBL, ERRORS_DIV, contactsWrap);
	});

	CLOSE_addChangeModal_BTN.addEventListener("click", () => {
		closeClearAddChangeModal(addChangeModal, surnameInp, surnameLBL, nameInp, nameLBL, lastnameInp, lastnameLBL, ERRORS_DIV, contactsWrap);
	});

	cancelNewClientBtn.addEventListener("click", e => {
		e.preventDefault();
		closeClearAddChangeModal(addChangeModal, surnameInp, surnameLBL, nameInp, nameLBL, lastnameInp, lastnameLBL, ERRORS_DIV, contactsWrap);
	});
	delClientBtn.addEventListener("click", () => {
		document.getElementById(`tr${сlientIdChangeDel}`).remove();
		fetch("http://localhost:3000/api/clients/" + сlientIdChangeDel, {
			method: "DELETE"
		});
		if(clientsTable.children.length == 0)
		{
			loadingOrEmptyDiv.classList.remove("dn");
			loadingIcon.classList.add("display-none");
			emptyDiv.classList.remove("display-none");
			clientsTable.classList.remove("dt");
		}
		closeClearAddChangeModal(addChangeModal, surnameInp, surnameLBL, nameInp, nameLBL, lastnameInp, lastnameLBL, ERRORS_DIV, contactsWrap);
	});

	surnameInp.addEventListener("focus", () => {
		surnameLBL.classList.add("label-up");
	});
	surnameInp.addEventListener("blur", () => {
		if(surnameInp.value === "") surnameLBL.classList.remove("label-up");
	});

	nameInp.addEventListener("focus", () => {
		nameLBL.classList.add("label-up");
	});
	nameInp.addEventListener("blur", () => {
		if(nameInp.value === "") nameLBL.classList.remove("label-up");
	});

	lastnameInp.addEventListener("focus", () => {
		lastnameLBL.classList.add("label-up");
	});
	lastnameInp.addEventListener("blur", () => {
		if(lastnameInp.value === "") lastnameLBL.classList.remove("label-up");
	});

	addContactsBTN.addEventListener("click", () => {
		createContact();
	});

	// Обработчик события для закрытия меню выбора типа контакта по клику вне этого меню
	window.addEventListener("click", e => {
		if(!selectClicked && openedSelect !== null)
		{
			openedSelect.classList.remove("show-select");
			openedSelect = null;
			selectClicked = false;
		}
		if(selectClicked) selectClicked = false;
		if(openedContact !== null && !contactClicked)
		{
			openedContact.classList.remove("contact-clicked");
			openedContact = null;
		}
		contactClicked = false;
	});

	SAVE_BTN.addEventListener("click", async e => {
		e.preventDefault();
		SAVE_BTN.classList.add("saving");
		const CONTACTS = getAllContacts();
		switch(modalWindowMode)
		{
			case "adding":
				let responseSave = await fetch("http://localhost:3000/api/clients", {
					method: "POST",
					body: JSON.stringify({
						surname: surnameInp.value.trim(),
						name: nameInp.value.trim(),
						lastName: lastnameInp.value.trim(),
						contacts: CONTACTS
					}),
					headers: {
						"Content-Type": "application/json"
					}
				});
				if(responseSave.ok)
				{
					closeClearAddChangeModal(addChangeModal, surnameInp, surnameLBL, nameInp, nameLBL, lastnameInp, lastnameLBL, ERRORS_DIV, contactsWrap);
					loadingOrEmptyDiv.classList.add("dn");
					if(searched)
					{
						const response = await fetch(`http://localhost:3000/api/clients/?search=${searchField.value}`);
						clients = await response.json();
					}
					else clients = await getAllClients();
					clients = sortClients(clients);
					clientsTable.classList.add("dt");
					generateClientsTable(clients);
				}
				else
				{
					let responseBody = await responseSave.json();
					addContactsAndBTNWrap.classList.add("mb0");
					ERRORS_DIV.textContent = "Ошибка: ";
					ERRORS_DIV.classList.add("show-error-msg");
					if(responseSave.status === 422)
					{
						for(let i = 0; i < responseBody.errors.length; i++)
						{
							if(i === responseBody.errors.length - 1)
								ERRORS_DIV.textContent += responseBody.errors[i].message;
							else
								ERRORS_DIV.textContent += responseBody.errors[i].message + "; ";
						}
					}
					else
					{
						ERRORS_DIV.textContent += "Что-то пошло не так...";
					}
				}
				SAVE_BTN.classList.remove("saving");
				break;
			case "changing":
				let responseChange = await fetch("http://localhost:3000/api/clients/" + сlientIdChangeDel, {
					method: "PATCH",
					body: JSON.stringify({
						surname: surnameInp.value.trim(),
						name: nameInp.value.trim(),
						lastName: lastnameInp.value.trim(),
						contacts: CONTACTS
					}),
					headers: {
						"Content-Type": "application/json"
					}
				});
				if(responseChange.ok)
				{
					closeClearAddChangeModal(addChangeModal, surnameInp, surnameLBL, nameInp, nameLBL, lastnameInp, lastnameLBL, ERRORS_DIV, contactsWrap);
					loadingOrEmptyDiv.classList.add("dn");
					if(searched)
					{
						const response = await fetch(`http://localhost:3000/api/clients/?search=${searchField.value}`);
						clients = await response.json();
					}
					else clients = await getAllClients();
					clients = sortClients(clients);
					generateClientsTable(clients);
				}
				else
				{
					let responseBody = await responseChange.json();
					addContactsAndBTNWrap.classList.add("mb0");
					ERRORS_DIV.textContent = "Ошибка: ";
					ERRORS_DIV.classList.add("show-error-msg");
					if(responseChange.status === 422)
					{
						for(let i = 0; i < responseBody.errors.length; i++)
						{
							if(i === responseBody.errors.length - 1)
								ERRORS_DIV.textContent += responseBody.errors[i].message;
							else
								ERRORS_DIV.textContent += responseBody.errors[i].message + "; ";
						}
					}
					else
					{
						ERRORS_DIV.textContent += "Что-то пошло не так...";
					}
				}
				SAVE_BTN.classList.remove("saving");
				break;
		}
	});
	
	delConfirmModalBG.addEventListener("click", e => {
		if(e.target === delConfirmModalBG) delConfirmModalBG.classList.remove("db");
		document.body.classList.remove("overflow-hidden");
	});
	delModalCloseBtn.addEventListener("click", () => {
		delConfirmModalBG.classList.remove("db");
		document.body.classList.remove("overflow-hidden");
	});
	delConfirmBtn.addEventListener("click", () => {
		fetch("http://localhost:3000/api/clients/" + сlientIdChangeDel, {
			method: "DELETE"
		});
		delConfirmModalBG.classList.remove("db");
		document.getElementById(`tr${сlientIdChangeDel}`).remove();
		for(let i = 0; i < clients.length; i++)
		{
			if(clients[i].id === сlientIdChangeDel) clients.splice(i, 1);
		}
		if(clientsTable.children.length == 0)
		{
			loadingOrEmptyDiv.classList.remove("dn");
			loadingIcon.classList.add("display-none");
			emptyDiv.classList.remove("display-none");
			clientsTable.classList.remove("dt");
		}
		document.body.classList.remove("overflow-hidden");
	});
	cancelDelBtn.addEventListener("click", () => {
		document.body.classList.remove("overflow-hidden");
		delConfirmModalBG.classList.remove("db");
	});

	// С О Р Т И Р О В К А

	idTH.addEventListener("click", () => {
		if(sortColumnSortMode === "id-ascending") 
		{
			sortColumnSortMode = "id-descending";
			idTH.classList.add("descending");
		}
		else if(sortColumnSortMode === "id-descending")
		{
			sortColumnSortMode = "id-ascending";
			idTH.classList.remove("descending");

		}
		else
		{
			idTH.classList.add("sorted");
			const previousSort = sortColumnSortMode.split("-")[0];
			sortColumnSortMode = "id-ascending";
			switch(previousSort)
			{
				case "fio":
					AYA.textContent = "А-Я";
					fioTH.classList.remove("sorted", "descending");
					break;
				case "createdAt":
					createdDateTimeTH.classList.remove("sorted", "descending");
					break;
				case "updatedAt":
					updatedDateTimeTH.classList.remove("sorted", "descending");
					break;
			}
		}
		clients = sortClients(clients);
		generateClientsTable(clients);
	});
	fioTH.addEventListener("click", () => {
		if(sortColumnSortMode === "fio-ascending") 
		{
			AYA.textContent = "Я-А";
			sortColumnSortMode = "fio-descending";
			fioTH.classList.add("descending");
		}
		else if(sortColumnSortMode === "fio-descending")
		{
			AYA.textContent = "А-Я";
			sortColumnSortMode = "fio-ascending";
			fioTH.classList.remove("descending");
		}
		else
		{
			fioTH.classList.add("sorted");
			const previousSort = sortColumnSortMode.split("-")[0];
			sortColumnSortMode = "fio-ascending";
			switch(previousSort)
			{
				case "id":
					idTH.classList.remove("sorted", "descending");
					break;
				case "createdAt":
					createdDateTimeTH.classList.remove("sorted", "descending");
					break;
				case "updatedAt":
					updatedDateTimeTH.classList.remove("sorted", "descending");
					break;
			}
		}
		clients = sortClients(clients);
		generateClientsTable(clients);
	});
	createdDateTimeTH.addEventListener("click", () => {
		if(sortColumnSortMode === "createdAt-ascending") 
		{
			sortColumnSortMode = "createdAt-descending";
			createdDateTimeTH.classList.add("descending");
		}
		else if(sortColumnSortMode === "createdAt-descending")
		{
			sortColumnSortMode = "createdAt-ascending";
			createdDateTimeTH.classList.remove("descending");

		}
		else
		{
			createdDateTimeTH.classList.add("sorted");
			const previousSort = sortColumnSortMode.split("-")[0];
			sortColumnSortMode = "createdAt-ascending";
			switch(previousSort)
			{
				case "id":
					idTH.classList.remove("sorted", "descending");
					break;
				case "fio":
					AYA.textContent = "А-Я";
					fioTH.classList.remove("sorted", "descending");
					break;
				case "updatedAt":
					updatedDateTimeTH.classList.remove("sorted", "descending");
					break;
			}
		}
		clients = sortClients(clients);
		generateClientsTable(clients);
	});
	updatedDateTimeTH.addEventListener("click", () => {
		if(sortColumnSortMode === "updatedAt-ascending") 
		{
			sortColumnSortMode = "updatedAt-descending";
			updatedDateTimeTH.classList.add("descending");
		}
		else if(sortColumnSortMode === "updatedAt-descending")
		{
			sortColumnSortMode = "updatedAt-ascending";
			updatedDateTimeTH.classList.remove("descending");

		}
		else
		{
			updatedDateTimeTH.classList.add("sorted");
			const previousSort = sortColumnSortMode.split("-")[0];
			sortColumnSortMode = "updatedAt-ascending";
			switch(previousSort)
			{
				case "id":
					idTH.classList.remove("sorted", "descending");
					break;
				case "fio":
					AYA.textContent = "А-Я";
					fioTH.classList.remove("sorted", "descending");
					break;
				case "createdAt":
					createdDateTimeTH.classList.remove("sorted", "descending");
					break;
			}
		}
		clients = sortClients(clients);
		generateClientsTable(clients);
	});

	// П О И С К \(0_0)/

	searchField.addEventListener("input", async () => {
		clearTimeout(timeout);
		searched = !!searchField.value;
		timeout = setTimeout(async () => {
			const response = await fetch(`http://localhost:3000/api/clients/?search=${searchField.value}`);
			clients = await response.json();
			clients = sortClients(clients);
			generateClientsTable(clients);
		}, 300);
	});
});