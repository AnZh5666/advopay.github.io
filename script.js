const sudList = [
  "Областной",
  "Ленинский",
  "Дзержинский",
  "Промышленный",
  "Центральный",
  "Оренбургский",
  "Мировой Ленинский",
  "Мировой Дзержинский",
  "Мировой Промышленный",
  "Мировой Центральный",
  "Мировой Оренбургский",
];
const mvdList = [
  "СЧ СУ области",
  "СЧ СУ города",
  "ОП№1",
  "ОП№2",
  "ОП№3",
  "ОП№4",
  "ОП№5",
  "ОП№6",
  "ОП№7",
];
const skList = [
  "ОВД1",
  "ОВД2",
  "ОВД3",
  "СО по ЮАО",
  "СО по САО",
  "Оренбургский МСО",
];

const selectSud = document.querySelector(".select-sud");
const selectMvd = document.querySelector(".select-mvd");
const selectSk = document.querySelector(".select-sk");
let arrObj = [];

/*   Функция получения из базы данных всех клиентов и заполнения таблицы*/
async function getData() {
  let response = await fetch(
    "https://648a8b9517f1536d65e93b38.mockapi.io/oplata/",
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

/*    Функция отправления в базу данных нового клиента */
function addNewClient(obj) {
  fetch("https://648a8b9517f1536d65e93b38.mockapi.io/oplata", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(obj),
  })
    .then((res) => {
      if (res.ok) {
        getData();
        return res.json();
      }
    })
    .catch((error) => {
      console.log(error);
    });

}


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
  const tableBody = document.querySelector(".table-body");
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


/* Функция создания строки в таблице модального окна  */         /* ПЕРЕПИСАТЬ !!! в качестве аргумента массив и его перебрать */
const creatPayTable = (item, index) => {
  return `
        <tr class="worked">
            <th scope="row">${index + 1}</th>
            <td class="organ">${item.organ}</td>
            <td class="organName">${item.organName}</td>
            <td class="officialName">${item.officialName}</td>
            <td class="client">
            ${item.clientName}</td>
            <td class="date">${item.date}</td>
            <td class="cost">${item.cost}</td>
            <td class="td-del"><button class="btn btn-del" onclick="delClient(${index}, ${item.id
    })">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-archive" viewBox="0 0 16 16">
                    <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5zm13-3H1v2h14zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
                </svg>
            </td>
         </tr>
      `;
};

/* Функция удаления конкретного клиента из таблицы и базы данных */
/* const delClient = async (index, item) => {
  await fetch(`https://648a8b9517f1536d65e93b38.mockapi.io/oplata/${item}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (res.ok) {
       
        return res.json();
      }
    })
    .catch((error) => {
      console.log(error);
    });
 
  if (sum == 0) {
    total.innerHTML = "";
  }
  sum = sum - arrObj[index].cost;
  arrObj.splice(index, 1);
  creatPayTable(index)
  getData() 
 
  
}; */

/* функия переворачивания даты в нужный формат DD.MM.YY */
function getDate(str) {
  let options = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  };
  let date = new Date(str);
  return date.toLocaleString("ru", options);
}

/* Получение данных из инпутов формы и создания из них объекта, который добавляется в таблицу и в базу данных*/
const formInput = document.querySelector(".needs-validation");
formInput.addEventListener("submit", function (e) {
  e.preventDefault()
  e.stopPropagation();
   

  let obj = {};
  if (this.elements[0].checked) {
    obj = {
      organ: this.elements[0].value,
      organName: this.elements[1].value,
      officialName: this.elements[6].value,
      clientName: this.elements[7].value.trim().toLowerCase(),
      date: getDate(this.elements[8].value),
      cost: +this.elements[9].value,
    };
    
     
    selectSud.hidden = true;
    selectMvd.hidden = true;
    selectSk.hidden = true;
    this.reset();
    

    arrObj.push(obj);
    fillBodyTable(arrObj);
    addNewClient(obj);
   
  } if (this.elements[2].checked) {
    obj = {
      organ: this.elements[2].value,
      organName: this.elements[3].value,
      officialName: this.elements[6].value,
      clientName: this.elements[7].value.trim().toLowerCase(),
      date: getDate(this.elements[8].value),
      cost: this.elements[9].value,
    };
    
    selectSud.hidden = true;
    selectMvd.hidden = true;
    selectSk.hidden = true;
    this.reset();
     
    arrObj.push(obj);
    fillBodyTable(arrObj);
    addNewClient(obj);
   
  } if (this.elements[4].checked && this.elements !== "") {
    obj = {
      organ: this.elements[4].value,
      organName: this.elements[5].value,
      officialName: this.elements[6].value,
      clientName: this.elements[7].value.trim().toLowerCase(),
      date: getDate(this.elements[8].value),
      cost: this.elements[9].value,
    };
     
    selectSud.hidden = true;
    selectMvd.hidden = true;
    selectSk.hidden = true;
    this.reset();
    
    arrObj.push(obj);
    fillBodyTable(arrObj);
    addNewClient(obj);
   
  }
  else {
    alert("Заполните поля");
  }

});


/*  Функция добавление необходимых option в select в форме */
const addListToSelect = (item, el) => {
  el.forEach((i) => {
    item.innerHTML += `             
            <option value="${i}">${i}</option>
    `;
  });
};

/* Показывание или скрывание определенных селектов, в зависимости от выбранной радиокнопки */
const radioBtn = document.querySelectorAll(".form-check>input[type='radio']");

radioBtn.forEach((i) => {
  i.addEventListener("click", function () {

    switch (this.value) {
      case "суд":
        selectSud.hidden = false;
        selectMvd.hidden = true;
        selectSk.hidden = true;

        addListToSelect(selectSud, sudList);
        break;
      case "умвд":
        selectMvd.hidden = false;
        selectSud.hidden = true;
        selectSk.hidden = true;

        addListToSelect(selectMvd, mvdList);
        break;
      case "ск":
        selectSk.hidden = false;
        selectSud.hidden = true;
        selectMvd.hidden = true;

        addListToSelect(selectSk, skList);
        break;
      default:
        break;
    }
  });
});

/* выбор конкретного клиента в таблицы и вывод всез записей о нем в модальном окне */
document.querySelector(".table-pay").addEventListener("click", function (e) {
  let target = e.target;
  const modalTable = document.querySelector(".modal-table");
  modalTable.innerHTML = "";

  if (target.className != "client") {
    return;
  } else {
    let arrClient = [];
    let sum2 = 0;
    let nameClient = target.textContent;

    arrObj.map((item) => {
      if (nameClient === item.clientName) {
        arrClient.push(item);
        arrClient.sort(
          (a, b) => moment(a.date, "DD.MM.YYYY") - moment(b.date, "DD.MM.YYYY")
        );
      }
    });
    sum2 = arrClient.reduce((acc, elem) => acc + +elem.cost, 0);

    arrClient.map((item, index) => {
      modalTable.innerHTML += creatPayTable(item, index);
    });
    const totalModal = document.querySelector(".total-modal");
    totalModal.innerHTML = sum2;
    arrClient = [];
  }
});


