import { exportDataSheet } from '../backend/server.js';

const visor = document.getElementById('visor');
const startBtn = document.getElementById('start-btn');
const modalUser = document.querySelector('#user-modal');
const loginBtn = document.querySelector('#login-btn');
const userInputs = document.getElementById('name-input');
const registerSectionElement = document.getElementById('register-section');
const historicSectionElement = document.getElementById('historic-section');

const justificationBtn = document.getElementById('justification-btn');
const modalJustification = document.getElementById('add-modal');

let dataFromUser = [];
const dataFromUserLogout = [];
let showTime;
let dateRegister;
let idNumber = 0;
export let statusApp = true; // para evitar dados duplicados
export let deleteId; // para passar o id quando tiver erro na calback

const fixingTwoDigits = (digit) => {
  if (digit < 10) {
    return `0${digit}`;
  } else {
    return digit;
  }
};

function timeApp() {
  let momentoatual = new Date();

  let hours = momentoatual.getHours();
  let minutes = momentoatual.getMinutes();
  let seconds = momentoatual.getSeconds();

  let dayNow = momentoatual.getDate();
  let monthNow = momentoatual.getMonth() + 1;
  let yearNow = momentoatual.getFullYear();

  let strHours = new String(hours);
  let strMinutes = new String(minutes);
  let strSeconds = new String(seconds);

  let strDay = new String(dayNow);
  let strMonth = new String(monthNow);
  let strYear = new String(yearNow);

  dateRegister = `${fixingTwoDigits(strDay)}-${fixingTwoDigits(strMonth)}-${strYear}`;

  showTime = `${fixingTwoDigits(strHours)}:${fixingTwoDigits(strMinutes)}:${fixingTwoDigits(strSeconds)}`;
  visor.innerHTML = showTime;
}

const startHandler = () => {
  modalUser.classList.toggle('visible');
};

const loginHandler = () => {
  const usernameInput = userInputs.value;

  if (!usernameInput || !isNaN(usernameInput) || usernameInput.length < 5) {
    return alert`Entrada invalida`;
  }

  const newEntry = {
    id: idNumber,
    name: usernameInput,
    timeLogin: showTime,
    timeLogout: undefined,
    date: dateRegister,
  };
  idNumber++; // posso retirar o ID
  dataFromUser.push(newEntry);
  localDataHandler('myLogin', dataFromUser);

  clearEntryInput();
  renderRegisterElements(newEntry.name, newEntry.timeLogin, newEntry.date, newEntry.id);
  //startHandler(); // caso eu queira esconder o modal depois de cada login.
  //subId: dataFromUser.indexOf(newEntry)
};

const clearEntryInput = () => {
  userInputs.value = '';
};

const logoutHandler = (name, login, date, id) => {
  if (statusApp) {
    //dataFromUser[id].timeLogout = showTime ? console.log('null showTime') : console.log('null showTime');

    const userData = {
      name: name,
      timeLogin: login,
      date: date,
      timeLogout: showTime,
    };
    dataFromUserLogout.push(userData);

    localDataHandler('myHistory', dataFromUserLogout);

    renderHistoricElements(userData.name, userData.timeLogin, userData.date, userData.timeLogout);
    exportDataSheet(userData.name, userData.timeLogin, userData.timeLogout, userData.date);

    deleteId = id;
  }
  statusApp = false;

  //registerSectionElement.querySelector(`.btn-${id}`).remove(); // como parar a função?
};

const renderRegisterElements = (name, login, date, id) => {
  const paragraphElement = document.createElement('li');
  paragraphElement.className = `login-info btn-${id}`;
  paragraphElement.innerHTML = `${name}. Data: ${date}. Horário de entrada: ${login} <button id="btn-${id}" class="logout-btn">Sair</button>`;
  registerSectionElement.append(paragraphElement);

  const logoutBtn = document.querySelector(`#btn-${id}`);
  logoutBtn.addEventListener('click', logoutHandler.bind(null, name, login, date, id));
};

const renderHistoricElements = (name, login, date, logout) => {
  const numberElHistoric = historicSectionElement.childNodes.length;
  if (numberElHistoric > 3) {
    historicSectionElement.firstChild.remove();
  }
  const liElement = document.createElement('li');
  liElement.className = 'login-info historic-info';
  liElement.innerHTML = `${name}. Data: ${date}. Horário de entrada: ${login}. Saída: ${logout}`;
  historicSectionElement.append(liElement);
};

const justificationModal = () => {
  modalJustification.classList.add('visible');
};

export const deleteElHandler = (id) => {
  registerSectionElement.querySelector(`.btn-${id}`).remove();
};

const localDataHandler = (name, userData) => {
  localStorage.setItem(`${name}`, JSON.stringify(userData));
};

const loadUI = (dataPackage) => {
  let hasData = localStorage.getItem(dataPackage);
  if (!hasData) {
    console.log('working..');
    return;
  }

  //const haveData = localStorage.length; deletar

  if (dataPackage === 'myHistory') {
    let getPersonData = localStorage.getItem(dataPackage);
    let personObject = JSON.parse(getPersonData);
    for (let i = 0; i < personObject.length; i++) {
      renderHistoricElements(personObject[i].name, personObject[i].timeLogin, personObject[i].date, personObject[i].timeLogout);
    }
  } else if (dataPackage === 'myLogin') {
    let getPersonData = localStorage.getItem(dataPackage);
    let personObject = JSON.parse(getPersonData);
    for (let i = 0; i < personObject.length; i++) {
      renderRegisterElements(personObject[i].name, personObject[i].timeLogin, personObject[i].date, personObject[i].id);
    }
  }
};

export const statusHandler = () => {
  // função para evitar dois clicks e inforamções duplicadas
  statusApp = true;
};

export const updateStorage = (name) => {
  for (let i = 0; i < dataFromUser.length; i++) {
    if (dataFromUser[i].name === name) {
      console.log('executando - name: ' + name + ' element: ' + dataFromUser[i].name);
      dataFromUser.splice(i, 1);
      localDataHandler('myLogin', dataFromUser);
    }
  }
};

const init = () => {
  setInterval(timeApp, 1000);
  const recoveryData = localStorage.getItem('myLogin');
  const recoveryArray = JSON.parse(recoveryData);
  dataFromUser = recoveryArray ? recoveryArray : new Array();
  console.log(dataFromUser);
  loadUI('myLogin');
  loadUI('myHistory');
};

justificationBtn.addEventListener('click', () => {
  //provisório
  localStorage.clear();
});

startBtn.addEventListener('click', startHandler);
loginBtn.addEventListener('click', loginHandler);

init();
