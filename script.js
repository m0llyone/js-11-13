'use strict';

let alex = {
  id: 1,
  name: 'alex',
  email: 'alex@gmail.com',
  address: 'Minsk',
  phone: '432-42-88',
};

let karina = {
  id: 2,
  name: 'karina',
  email: 'karina@gmail.com',
  address: 'Vitebsk',
  phone: '231-12-44',
};

class User {
  constructor(person) {
    this.data = person;
  }

  edit(editPerson) {
    this.data = editPerson;
  }

  get() {
    return this.data;
  }
}

let user = new User();

class Contacts {
  constructor(data) {
    this.data = [];
  }

  add(person) {
    const editPerson = new User(person);
    this.data = [...this.data, editPerson.data];
  }

  edit(id, data) {
    const contacts = this.data.map((element) => {
      if (element.id === id) {
        return { ...element, ...data };
      }
      return element;
    });
    user.edit.call(this, contacts);
  }

  remove(id) {
    return (this.data = this.data.filter((item) => item.id !== id));
  }

  get() {
    return this.data;
  }
}

const contacts = new Contacts();
// console.log(contacts)
// contacts.add(alex)
// contacts.add(karina)
// contacts.remove(1)
// contacts.edit(2, {name: 'andrey'})

class ContactsApp extends Contacts {
  constructor() {
    super();
    this.render();
    this.id = 1;
    this.getData();
  }

  setCookie(nam, value) {
    // let date = new Date ()
    // date.setDate(date.getDate() + 10)
    document.cookie = `${nam}=${value}; path=/; max-age = 36000`;
  }

  handleLocalStorage() {
    if (!this.data.length) return localStorage.removeItem('contacts');
    localStorage.setItem('contacts', JSON.stringify(this.data));
    this.setCookie('storageExpiration', 'true');
  }

  render() {
    const form = document.querySelector('.form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const { elements } = form;
      this.person = {};

      Array.from(elements)
        .filter((element) => element.name)
        .forEach((element) => {
          const { name, value } = element;
          this.person[name] = value;
          this.person.id = this.id;
          element.value = '';
        });
      super.add(this.person);
      this.onAdd();
      this.handleLocalStorage();
    });
  }

  onAdd() {
    const contacts = document.querySelector('.contacts__list');
    this.contact = document.createElement('div');
    this.contact.className = 'contact__it';
    this.contact.setAttribute('id', this.id);
    this.id++;
    this.contactInfo = document.createElement('div');
    this.contactInfo.className = 'contact__info';
    this.name = document.createElement('div');
    this.email = document.createElement('div');
    this.address = document.createElement('div');
    this.phone = document.createElement('div');

    this.buttonContainer = document.createElement('div');
    this.buttonContainer.className = 'buttonContainer';
    this.editButton = document.createElement('button');
    this.editButton.classList.add('editButton', 'button');
    this.editButton.innerHTML = 'Edit';

    this.removeButton = document.createElement('button');
    this.removeButton.classList.add('removeButton', 'button');
    this.removeButton.innerHTML = 'Remove';
    this.buttonContainer.append(this.editButton, this.removeButton);
    this.contactInfo.append(
      this.name,
      this.email,
      this.address,
      this.phone,
      this.buttonContainer
    );
    this.contact.append(this.contactInfo, this.buttonContainer);
    contacts.append(this.contact);

    // const regPhone = /\+(375|7|380|80)\((29|44|33|25)\)\d{3}\-\d{2}\-\d{2}/;
    // const regEmail = /^[^0-9]{1}[a-zA-Z0-9]{1,15}\@[a-z]{2,8}.[a-z0-9]{2,11}/;

    this.data.find((element) => {
      this.name.innerHTML = `name: ${element.name}`;
      this.email.innerHTML = `email: ${element.email}`;
      this.address.innerHTML = `address: ${element.address}`;
      this.phone.innerHTML = `phone: ${element.phone}`;
    });
    this.onRemove();
    this.onEdit();
    this.handleLocalStorage();
  }

  onEdit() {
    this.editButton.addEventListener('click', (event) => {
      event.preventDefault();
      const { target } = event;
      const editContact = {};
      const parent = target.closest('.contact__it');
      this.name.innerHTML = editContact.name =
        prompt('Введите новое имя') || this.name.textContent;
      this.email.innerHTML = editContact.email =
        prompt('Введите новую почту') || this.email.textContent;
      this.address.innerHTML = editContact.address =
        prompt('Введите новый адрес') || this.address.textContent;
      this.phone.innerHTML = editContact.phone =
        prompt('Введите новый телефон') || this.phone.textContent;

      super.edit(+parent.id, editContact);
      this.handleLocalStorage();
    });
  }

  onRemove() {
    this.removeButton.addEventListener('click', (event) => {
      event.preventDefault();
      const { target } = event;
      const parent = target.closest('.contact__it ');
      super.remove(+parent.id);
      parent.remove();
      this.handleLocalStorage();
    });
  }

  async getData() {
    if (!localStorage.getItem('contacts')) {
      let response = await fetch('https://jsonplaceholder.typicode.com/users');
      this.data = await response.json();
      this.handleLocalStorage();
    }
  }
}

window.addEventListener('load', () => {
  if (!document.cookie.includes('storageExpiration'))
    return localStorage.removeItem('contacts');
});

const contactsApp = new ContactsApp();
