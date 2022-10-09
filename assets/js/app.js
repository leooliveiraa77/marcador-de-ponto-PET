const visor = document.getElementById('visor');
const startBtn = document.getElementById('start-btn');
const modalUser = document.querySelector('#user-modal');
const loginBtn = document.querySelector('#login-btn');
const userInputs = document.getElementById('name-input');
const registerSectionElement = document.getElementById('register-section');
const historicSectionElement = document.getElementById('historic-section');

const justificationBtn = document.getElementById('justification-btn');
const modalJustification = document.getElementById('add-modal');

const dataFromUser = [];
let showTime;
let dateRegister;
let idNumber = 0;
let deleteId; // para passar o id quando tiver erro na calback
let statusApp = true; // para evitar dados duplicados

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
  setInterval('timeApp()', 1000);
};

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

  idNumber++; // como lidar com id caso o valor da variável reinicie mas o valor local storage não
  //vou salvar o id no cache também
  dataFromUser.push(newEntry);
  clearEntryInput();
  renderRegisterElements(newEntry.name, newEntry.timeLogin, newEntry.date, newEntry.id);
  //startHandler(); // caso eu queira esconder o modal depois de cada login.
};

const clearEntryInput = () => {
  userInputs.value = '';
};

const logoutHandler = (id) => {
  if (statusApp) {
    dataFromUser[id].timeLogout = showTime;

    const userData = {
      name: dataFromUser[id].name,
      timeLogin: dataFromUser[id].timeLogin,
      date: dataFromUser[id].date,
      timeLogout: dataFromUser[id].timeLogout,
    };

    localDataHandler(id, userData);

    renderHistoricElements(dataFromUser[id].name, dataFromUser[id].timeLogin, dataFromUser[id].date, dataFromUser[id].timeLogout);
    exportDataSheet(dataFromUser[id].name, dataFromUser[id].timeLogin, dataFromUser[id].timeLogout, dataFromUser[id].date);
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

  logoutBtn.addEventListener('click', logoutHandler.bind(null, id));
};

const renderHistoricElements = (name, login, date, logout) => {
  const numberElHistoric = historicSectionElement.childNodes.length;
  if (numberElHistoric > 2) {
    let lastId = 0;
    console.log(historicSectionElement.lastChild);
    historicSectionElement.firstChild.remove();
    localStorage.removeItem(localStorage.key(lastId)); // aqui
    lastId++;
  }
  const liElement = document.createElement('li');
  liElement.className = 'login-info historic-info';
  liElement.innerHTML = `${name}. Data: ${date}. Horário de entrada: ${login}. Saída: ${logout}`;
  historicSectionElement.append(liElement);
};

const justificationModal = () => {
  modalJustification.classList.add('visible');
};

const deleteElHandler = (id) => {
  registerSectionElement.querySelector(`.btn-${id}`).remove();
};

//Função que envia os dados para a planilha. Ainda não consegui separar os arquivos por meio
//do import e export, pois ao faze-lo, a função timeApp não funciona mais
const exportDataSheet = (name, login, logout, date) => {
  axios
    .post(
      'https://sheetdb.io/api/v1/7x5t54ile9k99',
      {
        data: {
          name: name,
          login: login,
          logout: logout,
          date: date,
        },
      },
      {
        auth: {
          username: 'z3sdpklb',
          password: '53bhuo9kqmksvd2vjsdv',
        },
      }
    )
    .then((response) => {
      console.log(response.status);
      if (response.status === 201) {
        alert('Registrado com sucesso. Até a próxima PETIANO');
        deleteElHandler(deleteId);
        statusApp = true;
      } else {
        alert('Erro ' + response.status);
      }
    })
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('1' + error.response.data);
        console.log('2' + error.response.status);
        console.log('3' + error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log('4' + error.request);
        alert('Erro: ' + error + ' \n Provavelmente sem conexão com internet :(');
        statusApp = true;
      } else {
        console.log('Erro: ' + error.message);
      }
    });
};

const localDataHandler = (id, userData) => {
  //melhor salvar um unico objeto de objetos
  if (localStorage.length > 2) {
    localStorage.setItem(`${id}`, JSON.stringify(userData));
  } else {
    localStorage.setItem(`${id}`, JSON.stringify(userData));
  }
};

const loadUI = () => {
  const haveData = localStorage.length;
  if (haveData > 0) {
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let getPersonData = localStorage.getItem(key);
      let personObject = JSON.parse(getPersonData);

      renderHistoricElements(personObject.name, personObject.timeLogin, personObject.date, personObject.timeLogout);
    }
  }
};

const init = () => {
  timeApp();
  loadUI();
};

startBtn.addEventListener('click', startHandler);
loginBtn.addEventListener('click', loginHandler);

justificationBtn.addEventListener('click', justificationModal);

init();
