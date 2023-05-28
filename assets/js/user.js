function saveData() {
  // 사용자가 입력한 데이터를 가져옵니다.
  const data = document.getElementById('user_id').innerText;

  // 데이터를 로컬 스토리지에 저장합니다.
  localStorage.setItem('savedData', data)
}


//새로고침 user_id 유지
window.onload = function () {
  const savedData = localStorage.getItem('savedData');
  const login_div = document.querySelector('.login');
  const card_div = document.querySelector('.dashboard-cards');
  if (savedData) {
    document.getElementById('user_id').textContent = savedData;
    login_div.classList.add('display_tog');
    card_div.classList.remove('display_tog');
  }
};


function saveName() {
  // 기존에 저장된 데이터를 가져옵니다.
  const storedNames = localStorage.getItem('user_names');
  const id_show = document.querySelector("#user_id");
  // 이름을 HTML 요소에서 가져옵니다.
  const name = document.getElementById('icon_prefix').value;
  if (name == "") {
    console.log("이름입력오류(NULL)");
    return;
  }
  id_show.innerHTML = name;
  // 새로운 이름을 배열에 추가합니다.
  let namesArray = [];

  if (storedNames) {
    // 기존 데이터가 있는 경우, 기존 데이터를 파싱하여 배열로 변환합니다.
    namesArray = JSON.parse(storedNames);
  }

  // 중복된 이름이 있는지 확인합니다.
  if (!namesArray.includes(name)) {
    namesArray.push(name);
  }

  // 업데이트된 데이터를 다시 로컬 스토리지에 저장합니다.
  saveData();
  localStorage.setItem('user_names', JSON.stringify(namesArray));

  //로그인 부분 display non
  const login_div = document.querySelector('.login');
  const card_div = document.querySelector('.dashboard-cards');
  login_div.classList.add('display_tog');
  card_div.classList.remove('display_tog');
}


function logout() {
  localStorage.setItem('savedData', "");
  const id_show = document.querySelector("#user_id");
  id_show.innerHTML = "";


  const login_div = document.querySelector('.login');
  const card_div = document.querySelector('.dashboard-cards');
  card_div.classList.add('display_tog');
  login_div.classList.remove('display_tog');
}