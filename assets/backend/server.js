function exportDataSheet(name, login, logout, date) {
  axios
    .post(
      'https://sheetdb.io/api/v1/7x5t54ile9k99',
      {
        data: {
          name: name,
          login: login ,
          logout: logout,
          date: date
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
      console.log(response.data);
    });
}

export {exportDataSheet};


