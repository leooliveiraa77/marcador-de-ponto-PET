const visor = document.getElementById('visor');
const startBtn = document.getElementById('start-btn');
const modalUser = document.querySelector('#user-modal');
const loginBtn = document.querySelector('#login-btn');
const userInputs = document.getElementById('name-input');
const registerSectionElement = document.getElementById('register-section');
const historicSectionElement = document.getElementById('historic-section');

let showTime;
let idNumber = 0;
const dataFromUser = [];

const fixingTwoDigits = (digit) => {
  if (digit < 10) {
    return `0${digit}`;
  } else {
    return digit;
  }
};

const timeApp = () => {
  let momentoatual = new Date();

  let hours = momentoatual.getHours();
  let minutes = momentoatual.getMinutes();
  let seconds = momentoatual.getSeconds();

  let strHours = new String(hours);
  let strMinutes = new String(minutes);
  let strSeconds = new String(seconds);

  showTime = `${fixingTwoDigits(strHours)}:${fixingTwoDigits(strMinutes)}:${fixingTwoDigits(strSeconds)}`;
  visor.innerHTML = showTime;
  setTimeout('timeApp()', 1000);
};

timeApp();

const startHandler = () => {
  modalUser.classList.toggle('visible');
};

const loginHandler = () => {
  const usernameInput = userInputs.value;

  if (!usernameInput || typeof usernameInput !== 'string' || usernameInput.length < 5) {
    return alert`Entrada invalida`;
  }

  const newEntry = {
    id: idNumber,
    name: usernameInput,
    timeLogin: showTime,
    timeLogout: undefined,
  };

  idNumber++;

  dataFromUser.push(newEntry);
  clearMovieInput();
  renderRegisterElements(newEntry.name, newEntry.timeLogin, newEntry.id);
  //startHandler(); // caso eu queira esconder o modal depois de cada login.
  console.log(dataFromUser);
};

const clearMovieInput = () => {
  userInputs.value = '';
};

const logoutHandler = (id) => {
  let logIndex = 0;
  for (const log of dataFromUser) {
    if (log.id === id) {
      break;
    }
    logIndex++;
  }
  dataFromUser[id].timeLogout = showTime;
  console.log('id:', id);
  registerSectionElement.querySelector(`.btn-${id}`).remove();
  console.log(dataFromUser);

  let historicName = dataFromUser[id].name;
  let historiclogin = dataFromUser[id].timeLogin;
  let historiclogout = dataFromUser[id].timeLogout;

  renderHistoricElements(historicName, historiclogin, historiclogout);
};

const renderRegisterElements = (name, login, id) => {
  const paragraphElement = document.createElement('li');
  paragraphElement.className = `login-info btn-${id}`;
  paragraphElement.innerHTML = `${name}, horário de entrada: ${login} <button id="btn-${id}" class="logout-btn">Sair</button>`;
  registerSectionElement.append(paragraphElement);

  const logoutBtn = document.querySelector(`#btn-${id}`);

  logoutBtn.addEventListener('click', logoutHandler.bind(null, id));
};

const renderHistoricElements = (name, login, logout) => {
  const liElement = document.createElement('li');
  liElement.className = 'login-info historic-info';
  liElement.innerHTML = `${name}. Entrada: ${login}. Saída: ${logout}`;
  historicSectionElement.append(liElement);
};

startBtn.addEventListener('click', startHandler);
loginBtn.addEventListener('click', loginHandler);
