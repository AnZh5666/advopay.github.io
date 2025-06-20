
let arrObj = [];

async function getData() {
  let response = await fetch(
    "https://648a8b9517f1536d65e93b38.mockapi.io/payIn2024",
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Permissions-Policy": "Origin",
      },
    }
  );
  let result = await response.json();

  arrObj = Object.keys(result).map((key) => result[key]);
  arrObj.sort((a, b) => moment(a.date, "DD.MM.YYYY") - moment(b.date, "DD.MM.YYYY")); // выстраивание в хронолигическом порядке по дате убывания
  fillBodyTable(arrObj);
}
getData().catch(alert);

/* Функция написания получаемой фамилии клиента с заглавной буквы bинициалы с заглавных букв*/
function f1(a) {
  let b = 0
  let c = 0;
  let result = a.split("")
  result[0] = result[0].toUpperCase()
  for (let i = 0; i < result.length; i++) {
    if (result[i] === " " || result[i] === ".") {
      b = result.indexOf(result[i]) + 1;
      result[b] = result[b].toUpperCase();
    }
  }
  return result.join('');
}

/* Функция создания новой записи с клиентом в таблице */
const createStringTable = (item, index) => {
  return `
        <tr class="worked">
            <th scope="row">${index + 1}</th>
            <td class="organ">${item.organ}</td>
            <td class="organName">${item.organName}</td>
            <td class="officialName">${item.officialName}</td>
            <td class="client" data-bs-toggle="modal" data-bs-target="#exampleModal">${f1(item.clientName)
    }</td>
            <td class="date">${item.date}</td>
            <td class="cost">${item.cost}</td>
        </tr>          
    `;
};

/* Функия заполнения таблицы всеми объектами */
function fillBodyTable(obj) {
  const tableBody = document.querySelector(".table-payed");
  const headerSum = document.querySelector('.header-sum')
  tableBody.innerHTML = "";
  obj.forEach((item, index) => {
    tableBody.innerHTML += createStringTable(item, index);
  });
  sum = obj.reduce((acc, elem) => acc + +elem.cost, 0);
  const visible = document.querySelector(".vis");
  visible.hidden = false;
  const total = document.querySelector(".total");
  total.innerHTML = Math.round(sum);
  headerSum.textContent = Math.round(sum);
}