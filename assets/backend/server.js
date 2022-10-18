import { deleteElHandler, deleteId, statusHandler, updateStorage } from '../js/app.js';

export const exportDataSheet = (name, login, logout, date) => {
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
        updateStorage(name);
        statusHandler();
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
        statusHandler();
        console.log('Erro: ' + error.message);
      }
    });
};
