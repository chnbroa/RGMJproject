

// 선택이미지 미리보기
// function LoadImg(value) {
//   if (value.files && value.files[0]) {

//     var reader = new FileReader();

//     reader.onload = function (e) {
//       $('#photoImg').attr('src', e.target.result);
//       $('#photoImg').show();
//     }

//     reader.readAsDataURL(value.files[0]);
//   }
// }


// const p = document.getElementById("search_test");

let productData;


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


function progress_bar_apply(structure) {
  //단백질
  const protein = document.getElementById("search_protein");
  const protein_span = document.getElementById("search_protein_span");
  let val = nutrient_cal("단백질", structure["단백질(g)"]) + "%";
  protein.style.width = val;
  protein_span.innerHTML = val;

  //지방
  const province = document.getElementById("search_fatty");
  const province_span = document.getElementById("search_fatty_span");
  val = nutrient_cal("지방", structure["지방(g)"]) + "%";
  province.style.width = val;
  province_span.innerHTML = val;

  //탄수화물
  const carbohydrate = document.getElementById("search_carbohydrate");
  const carbohydrate_span = document.getElementById("search_carbohydrate_span");
  val = nutrient_cal("탄수화물", structure["탄수화물(g)"]) + "%";
  carbohydrate.style.width = val;
  carbohydrate_span.innerHTML = val;

  //콜레스테롤
  const holesterol = document.getElementById("search_cholesterol");
  const holesterol_span = document.getElementById("search_cholesterol_span");
  val = nutrient_cal("콜레스테롤", structure["콜레스테롤(㎎)"]) + "%";
  holesterol.style.width = val;
  holesterol_span.innerHTML = val;


  //총 포화 지방산
  const saturated_fatty = document.getElementById("search_saturated_fatty");
  const saturated_fatty_span = document.getElementById("search_saturated_fatty_span");
  val = nutrient_cal("총 포화 지방산", structure["총 포화 지방산(g)"]) + "%";
  saturated_fatty.style.width = val;
  saturated_fatty_span.innerHTML = val;

  //총 당류

  const sugars = document.getElementById("search_sugars");
  const sugars_span = document.getElementById("search_sugars_span");
  val = nutrient_cal("총당류", structure["총당류(g)"]) + "%";
  sugars.style.width = val;
  sugars_span.innerHTML = val;

  //나트륨
  const nateulyum = document.getElementById("search_nateulyum");
  const nateulyum_span = document.getElementById("search_nateulyum_span");
  val = nutrient_cal("나트륨", structure["나트륨(㎎)"]) + "%";
  nateulyum.style.width = val;
  nateulyum_span.innerHTML = val;
}

function kcal_graph(structure) {

  let val = [{
    label: "하루 권장 Kacl",
    value: 2500
  }, {

    label: structure['1회제공량'] + "g당 Kacl",
    value: Number(structure['에너지(㎉)'])
  }];

  Morris.Donut({
    resize: true,
    element: 'morris-donut-chart',
    data: val,
    colors: ['#414e63', '#e96562']

  });
}

function nutrient_graph(structure) {
  Morris.Bar({
    element: 'morris-bar-chart',
    data: [{
      y: '단백질',
      a: 55,
      b: structure["단백질(g)"]
    }, {
      y: '지방',
      a: 54,
      b: structure["지방(g)"]
    }, {
      y: '탄수화물',
      a: 324,
      b: structure["탄수화물(g)"]
    }, {
      y: '콜레스테롤',
      a: 300,
      b: structure["콜레스테롤(㎎)"]
    }, {
      y: '총 포화 지방산',
      a: 15,
      b: structure["총 포화 지방산(g)"]
    }, {
      y: '총당류',
      a: 100,
      b: structure["총당류(g)"]
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

        //원재료 검색 결과
        material_search_result(data);

        //원재료 테이블 
        material_table(data);

        //1일영향섭취기준(%) progress-bar
        progress_bar_apply(structure);

        //칼로리 원 그래프
        kcal_graph(structure)

        //영양소 그래프
        nutrient_graph(structure)

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

