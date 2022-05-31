const xl = require('excel4node');

const wb = new xl.Workbook();

const ws = wb.addWorksheet('Registro de horários');

const data = [
  {
    name: 'Leonardo Castro',
    login: '8:23:55',
    logout: '10:30:15',
    date: '30-05-2022',
  },
];

const headingColumnNames = ['name', 'login', 'logout', 'date'];

let headingColumnIndex = 1;

headingColumnNames.forEach((heading) => {
  ws.cell(1, headingColumnIndex++).string(heading);
});

let rowIndex = 2;

data.forEach((record) => {
  let columnIndex = 1;
  Object.keys(record).forEach((columnName) => {
    ws.cell(rowIndex, columnIndex++).string(record[columnName]);
  });
  rowIndex++;
});

let fileName = 1;

const exportData = () => {
  wb.write(`Registros de horario PET ${fileName}.xlsx`);
  fileName++;
};
exportData();
