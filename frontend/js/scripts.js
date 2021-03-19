
let form;
let inputBusca;
let btnBuscar;
let divFilteredUsers;
let divStatisticsData;
let filteredList;
let allUsersList;
let spanFilteredUsersCount;
let spanStatisticsTitle;

let numberFormat = null;

window.addEventListener('load', () => {
  
  startState();
  getAllUsersList();

});

const startState = () => {
  numberFormat = Intl.NumberFormat('pt-BR');

  form = document.querySelector('form');
  inputBusca = document.querySelector("#inputBusca");
  btnBuscar = document.querySelector("#btnBuscar");
  divFilteredUsers = document.querySelector("#divFilteredUsers");
  divStatisticsData = document.querySelector("#divStatisticsData");
  spanFilteredUsersCount = document.querySelector("#spanFilteredUsersCount");
  spanStatisticsTitle = document.querySelector("#spanStatisticsTitle");

  form.addEventListener('submit', handleFormSubmit);
  inputBusca.addEventListener('keyup', typingEvent);
  btnBuscar.addEventListener('click', doSearch);

  clearLists();
}

clearLists = () => {
  divFilteredUsers.innerHTML = '';
  divUsersStatistics.innerHTML = '';
  
  divFilteredUsers.appendChild(spanFilteredUsersCount);
  divUsersStatistics.appendChild(spanStatisticsTitle);
}

handleFormSubmit = (event) => {
  event.preventDefault();
}

typingEvent = (event) => {
  if(event.key === 'Enter') {
    doSearch();
  }
}

doSearch = () => {
  const searchName = inputBusca.value.toLowerCase();
  if(searchName !== '') {
    clearLists();
    const filteredUsers = allUsersList.filter(user => user.name.toLowerCase().includes(searchName));
    renderFilteredUsers(filteredUsers);
    renderStatisticsData(filteredUsers);
  }
}

renderFilteredUsers = (filteredUsers) => {
  const filteredUsersCount = filteredUsers.length;
  if(filteredUsersCount > 0) {
    spanFilteredUsersCount.innerHTML = `${filteredUsersCount} usuário(s) encontrados(s)`;
  }
  else {
    spanFilteredUsersCount.innerHTML = 'Nenhum usuário filtrado';
  }
  filteredUsers.forEach(userFiltered => {
    const {id, name, age, picture} = userFiltered;
    const filteredUsersHTML = `
      <div class='divUsersData'>
        <div id='${id}'>
          <img src='${picture}' alt='${name}' class='picture waves-effect waves-circle' />
          <span>${name}, ${age} anos</span>
        </div>
      </div>
    `;
    divFilteredUsers.innerHTML += filteredUsersHTML;
  });
}

renderStatisticsData = (filteredUsers) => {

  const filteredUsersCount = filteredUsers.length;
  if(filteredUsersCount > 0) {
    spanStatisticsTitle.innerHTML = 'Estatísticas';

    const malesCount = filteredUsers.filter(user => user.gender == 'male').length;
    const femalesCount = filteredUsers.filter(user => user.gender == 'female').length
    const ageSum = filteredUsers.reduce((accumulator, cur) => {
      return accumulator + cur.age;
    }, 0);
    const ageAverage = numberFormat.format(ageSum / filteredUsersCount);
    const statisticsDataHTML = `
    <div class='divStatisticsData'>
      <ul>
        <li>Sexo masculino: ${malesCount}</li>
        <li>Sexo feminino: ${femalesCount}</li>
        <li>Soma das idades: ${ageSum}</li>
        <li>Média das idade: ${ageAverage}</li>
      </ul>
    </div>
  `;

    divUsersStatistics.innerHTML += statisticsDataHTML;
  }
  else {
    spanStatisticsTitle.innerHTML = 'Nada a ser exibido';
  }
  
}

async function getAllUsersList() {

  const resource = await fetch('http://localhost:3001/users');
  const users = await resource.json();

  allUsersList = users.map(user => {

    const {login, name, dob, picture, gender} = user;

    return {
      id: login.uuid,
      name: `${name.first} ${name.last}`,
      age: dob.age,
      picture: picture.thumbnail,
      gender: gender
    }
    
  })
}