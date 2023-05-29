


let productData;


function print_storage_data(data) {
  if (data == undefined) { return 0; }
  else { return data }
}

function nutrient_data_save(data) {
  let structure = {};
  const user_name = localStorage.getItem('savedData');
  const storage_chk = localStorage.getItem(user_name);
  let key = Object.keys(data);
  if (storage_chk) {
    structure = JSON.parse(localStorage.getItem(user_name));
    //로컬스토리지에 있을경우 불러와서더해준다.
    for (let i in key) {
      if (key[i] == "단백질(g)") { structure['단백질'] += data[key[i]][0]; }
      else if (key[i] == "지방(g)") { structure['지방'] += data[key[i]][0]; }
      else if (key[i] == "탄수화물(g)") { structure['탄수화물'] += data[key[i]][0]; }
      else if (key[i] == "콜레스테롤(㎎)") { structure['콜레스테롤'] += data[key[i]][0]; }
      else if (key[i] == "총 포화 지방산(g)") { structure['총 포화 지방산'] += data[key[i]][0]; }
      else if (key[i] == "나트륨(㎎)") { structure['나트륨'] += data[key[i]][0]; }
      else if (key[i] == "에너지(㎉)") { structure['칼로리'] += data[key[i]][0]; }
      else if (key[i] == "총당류(g)") { structure['총당류'] += data[key[i]][0]; }
    }

  }
  else {
    for (let i in key) {
      if (key[i] == "단백질(g)") { structure['단백질'] = data[key[i]][0]; }
      else if (key[i] == "지방(g)") { structure['지방'] = data[key[i]][0]; }
      else if (key[i] == "탄수화물(g)") { structure['탄수화물'] = data[key[i]][0]; }
      else if (key[i] == "콜레스테롤(㎎)") { structure['콜레스테롤'] = data[key[i]][0]; }
      else if (key[i] == "총 포화 지방산(g)") { structure['총 포화 지방산'] = data[key[i]][0]; }
      else if (key[i] == "나트륨(㎎)") { structure['나트륨'] = data[key[i]][0]; }
      else if (key[i] == "에너지(㎉)") { structure['칼로리'] = data[key[i]][0]; }
      else if (key[i] == "총당류(g)") { structure['총당류'] = data[key[i]][0]; }
    }
  }
  localStorage.setItem(user_name, JSON.stringify(structure));
  return structure;
}


async function speech_text(text) {
  const speech = new SpeechSynthesisUtterance();
  speech.lang = 'ko-KR';
  speech.text = text;
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1;
  window.speechSynthesis.speak(speech);
}


function material_search_result(data) {
  const red = document.querySelector('.red_result');
  const blue = document.querySelector('.blue_result');
  const yellow = document.querySelector('.yellow_result');

  let key = Object.keys(data["search_result"]['대표_원재료_명']);
  let y_cnt = 0;
  let r_cnt = 0;
  let b_cnt = 0;

  for (let i in key) {
    if (data['search_result']["사용_조건_기준_내용"][i] != null) y_cnt++;
    if (data['search_result']["사용_여부"][i] == "Y") b_cnt++;
    else r_cnt++;
  }
  b_cnt = b_cnt - (y_cnt + r_cnt);

  red.innerHTML = r_cnt;
  blue.innerHTML = b_cnt;
  yellow.innerHTML = y_cnt;
}

function material_table(data) {
  const tableBody = document.getElementById("table-body");
  let key = Object.keys(data["search_result"]['대표_원재료_명']);
  for (let i in key) {
    let row = document.createElement("tr");
    row.innerHTML = `
    <td>${Number(i) + 1}</td>
    <td>${data['search_result']['원재료코드'][i]}</td>
    <td>${data['search_result']['대표_원재료_명'][i]}</td>
    <td>${data['search_result']['사용_조건_기준_내용'][i]}</td>
    <td>${data['search_result']['사용_여부'][i]}</td>
    <td>${data['search_result']['출처_내용'][i]}</td>
  `;
    tableBody.appendChild(row);
  }
}

// 영양성분 계산기
//  표시 영양성분 값/ 영양소 기준치에서의 기준치값 * 100 
function nutrient_cal(idx, val) {
  let standard_val;
  switch (idx) {
    case '단백질':
      standard_val = 55;
      break;
    case '지방':
      standard_val = 54;
      break;
    case '탄수화물':
      standard_val = 324;
      break;
    case '나트륨':
      standard_val = 2000;
      break;
    case '콜레스테롤':
      standard_val = 300;
      break;
    case '총 포화 지방산':
      standard_val = 15;
      break;
    case '총당류':
      standard_val = 100;
      break;
    default:
      console.log("영양소계산 오류");
      return 0;
  }
  let result = Math.round(val / standard_val * 100);
  return result;
}


function progress_bar_apply() {
  const user_name = localStorage.getItem('savedData');
  let structure = {};
  structure = JSON.parse(localStorage.getItem(user_name));

  //단백질
  const protein = document.getElementById("search_protein");
  const protein_span = document.getElementById("search_protein_span");
  let val = nutrient_cal("단백질", print_storage_data(structure["단백질"])) + "%";
  protein.style.width = val;
  protein_span.innerHTML = val;

  //지방
  const province = document.getElementById("search_fatty");
  const province_span = document.getElementById("search_fatty_span");
  val = nutrient_cal("지방", print_storage_data(structure["지방"])) + "%";
  province.style.width = val;
  province_span.innerHTML = val;

  //탄수화물
  const carbohydrate = document.getElementById("search_carbohydrate");
  const carbohydrate_span = document.getElementById("search_carbohydrate_span");
  val = nutrient_cal("탄수화물", print_storage_data(structure["탄수화물"])) + "%";
  carbohydrate.style.width = val;
  carbohydrate_span.innerHTML = val;

  //콜레스테롤
  const holesterol = document.getElementById("search_cholesterol");
  const holesterol_span = document.getElementById("search_cholesterol_span");
  val = nutrient_cal("콜레스테롤", print_storage_data(structure["콜레스테롤"])) + "%";
  holesterol.style.width = val;
  holesterol_span.innerHTML = val;


  //총 포화 지방산
  const saturated_fatty = document.getElementById("search_saturated_fatty");
  const saturated_fatty_span = document.getElementById("search_saturated_fatty_span");
  val = nutrient_cal("총 포화 지방산", print_storage_data(structure["총 포화 지방산"])) + "%";
  saturated_fatty.style.width = val;
  saturated_fatty_span.innerHTML = val;

  //총 당류

  const sugars = document.getElementById("search_sugars");
  const sugars_span = document.getElementById("search_sugars_span");
  val = nutrient_cal("총당류", print_storage_data(structure["총당류"])) + "%";
  sugars.style.width = val;
  sugars_span.innerHTML = val;

  //나트륨
  const nateulyum = document.getElementById("search_nateulyum");
  const nateulyum_span = document.getElementById("search_nateulyum_span");
  val = nutrient_cal("나트륨", print_storage_data(structure["나트륨"])) + "%";
  nateulyum.style.width = val;
  nateulyum_span.innerHTML = val;
}


function progress_bar_result_apply(structure) {
  //검색결과 
  //단백질
  const protein = document.getElementById("search_protein_r");
  const protein_span = document.getElementById("search_protein_span_r");
  let val = nutrient_cal("단백질", print_storage_data(structure["단백질(g)"])) + "%";
  protein.style.width = val;
  protein_span.innerHTML = val;

  //지방
  const province = document.getElementById("search_fatty_r");
  const province_span = document.getElementById("search_fatty_span_r");
  val = nutrient_cal("지방", print_storage_data(structure["지방(g)"])) + "%";
  province.style.width = val;
  province_span.innerHTML = val;

  //탄수화물
  const carbohydrate = document.getElementById("search_carbohydrate_r");
  const carbohydrate_span = document.getElementById("search_carbohydrate_span_r");
  val = nutrient_cal("탄수화물", print_storage_data(structure["탄수화물(g)"])) + "%";
  carbohydrate.style.width = val;
  carbohydrate_span.innerHTML = val;

  //콜레스테롤
  const holesterol = document.getElementById("search_cholesterol_r");
  const holesterol_span = document.getElementById("search_cholesterol_span_r");
  val = nutrient_cal("콜레스테롤", print_storage_data(structure["콜레스테롤(㎎)"])) + "%";
  holesterol.style.width = val;
  holesterol_span.innerHTML = val;


  //총 포화 지방산
  const saturated_fatty = document.getElementById("search_saturated_fatty_r");
  const saturated_fatty_span = document.getElementById("search_saturated_fatty_span_r");
  val = nutrient_cal("총 포화 지방산", print_storage_data(structure["총 포화 지방산(g)"])) + "%";
  saturated_fatty.style.width = val;
  saturated_fatty_span.innerHTML = val;

  //총 당류

  const sugars = document.getElementById("search_sugars_r");
  const sugars_span = document.getElementById("search_sugars_span_r");
  val = nutrient_cal("총당류", print_storage_data(structure["총당류(g)"])) + "%";
  sugars.style.width = val;
  sugars_span.innerHTML = val;

  //나트륨
  const nateulyum = document.getElementById("search_nateulyum_r");
  const nateulyum_span = document.getElementById("search_nateulyum_span_r");
  val = nutrient_cal("나트륨", print_storage_data(structure["나트륨(㎎)"])) + "%";
  nateulyum.style.width = val;
  nateulyum_span.innerHTML = val;
}


function kcal_graph() {
  const user_name = localStorage.getItem('savedData');
  let structure = {};
  structure = JSON.parse(localStorage.getItem(user_name));

  let val = [{
    label: "하루 권장 Kacl",
    value: 2500
  }, {

    label: "섭취 Kacl",
    value: print_storage_data(structure['칼로리'])
  }];

  Morris.Donut({
    resize: true,
    element: 'morris-donut-chart',
    data: val,
    colors: ['#414e63', '#e96562']

  });
}

function nutrient_graph() {
  const user_name = localStorage.getItem('savedData');
  let structure = {};
  structure = JSON.parse(localStorage.getItem(user_name));

  Morris.Bar({
    element: 'morris-bar-chart',
    data: [{
      y: '단백질',
      a: 55,
      b: print_storage_data(structure["단백질"])
    }, {
      y: '지방',
      a: 54,
      b: print_storage_data(structure["지방"])
    }, {
      y: '탄수화물',
      a: 324,
      b: print_storage_data(structure["탄수화물"])
    }, {
      y: '콜레스테롤',
      a: 300,
      b: print_storage_data(structure["콜레스테롤"])
    }, {
      y: '총 포화 지방산',
      a: 15,
      b: print_storage_data(structure["총 포화 지방산"])
    }, {
      y: '총당류',
      a: 100,
      b: print_storage_data(structure["총당류"])
    }
    ],
    xkey: 'y',
    ykeys: ['a', 'b'],
    labels: ['기준치', '검색 결과'],
    barColors: [
      '#e96562', '#414e63',
      '#A8E9DC'
    ],
    hideHover: 'auto',
    resize: true
  });

}



const row_toggle = document.querySelectorAll('.row_toggle');

window.onload = function () {
  //새로고침 user_id 유지
  const savedData = localStorage.getItem('savedData');
  const login_div = document.querySelector('.login');
  const card_div = document.querySelector('.dashboard-cards');
  if (savedData) {
    document.getElementById('user_id').textContent = savedData;
    login_div.classList.add('display_tog');
    card_div.classList.remove('display_tog');
  }
  const storage_chk = localStorage.getItem(savedData);
  if (storage_chk) {

    //1일영향섭취기준(%) progress-bar
    progress_bar_apply();

    // //칼로리 원 그래프
    // kcal_graph();

    // //영양소 그래프
    // nutrient_graph();

    const row_save = document.querySelectorAll('.row_save');

    row_save.forEach(element => {
      element.classList.remove('row_toggle');
    });


  }


  const imageInput = document.querySelector('input[type="file"]');

  // 카메라 버튼

  $(".camera_search").click(function () {
    $("#photoFile").click();
  });

  // 사진 선택 후
  $("#photoFile").on('change', function () {

    // 파일명만 추출
    if (window.FileReader) {  // modern browser
      var filename = $(this)[0].files[0].name;
    } else {  // old IE
      var filename = $(this).val().split('/').pop().split('\\').pop();  // 파일명만 추출
    }

    // var fileSize = document.getElementById("photoFile").files[0].size;
    // console.log( "파일사이즈 : " + $("#photoFile")[0].files[0].size );
    console.log("파일사이즈 : " + $(this)[0].files[0].size);
    console.log("파일명 : " + filename);
    console.log($(this));

    // LoadImg($("#photoFile")[0]);

    // Create a FormData object to send the image
    const formData = new FormData();
    // Append the selected image file to the FormData object
    formData.append('image', imageInput.files[0]);

    // Send a POST request to the Flask server with the FormData object
    fetch('http://chnbroa011.iptime.org:666/convert', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        productData = data;
        console.log(data); // Print the JSON data to the console
        let structure = {};
        let key = Object.keys(data["search_food"]);

        for (let i in key) { structure[key[i]] = data["search_food"][key[i]][0] }


        speech_text(structure['식품명']);
        document.getElementById('speech_text_button').addEventListener('click', function () {
          speech_text(structure['식품명']);
        });

        let structure_local = nutrient_data_save(data["search_food"]);

        //원재료 검색 결과
        material_search_result(data);

        //원재료 테이블 
        material_table(data);

        //1일영향섭취기준(%) progress-bar
        progress_bar_apply();

        //칼로리 원 그래프
        kcal_graph();

        //영양소 그래프
        nutrient_graph();

        progress_bar_result_apply(structure);

        //그래프 토글
        row_toggle.forEach(element => {
          element.classList.remove('row_toggle');
        });

        return data
      })
      .catch(error => {
        console.error('Error sending image:', error);
      });
  });
}

//하단 메뉴

//화면 캡처
// 버튼 클릭 이벤트 핸들러
document.querySelector('.capture_page').addEventListener('click', function () {
  html2canvas(document.body).then((canvas) => {
    // 캔버스를 이미지로 변환
    const imgData = canvas.toDataURL("image/png");

    const imgWidth = 210; // 가로(mm) (A4)
    const pageHeight = imgWidth * 1.414; // 세로 길이 (A4)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
    });

    let heightLeft = imgHeight;
    let position = 0;

    // 첫 페이지 출력
    doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 한 페이지 이상일 경우 루프 돌면서 출력
    while (heightLeft >= 20) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    doc.save("capture.pdf");
  });
});



// // clg tab
// // nfn tab

