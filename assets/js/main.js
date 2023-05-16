
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

  Morris.Donut({
    element: 'morris-donut-chart',
    data: [{
      label: "하루 권장 Kacl",
      value: 2500
    }, {

      label: structure['1회제공량'] + "g당 Kacl",
      value: structure['에너지(㎉)']
    }],
    colors: [
      '#414e63',
      '#e96562'
    ],
    resize: true
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

        //1일영향섭취기준(%) progress-bar
        progress_bar_apply(structure);

        //칼로리 원 그래프
        kcal_graph(structure)

        //영양소 그래프
        nutrient_graph(structure)
        // let key = Object.keys(data["search_result"]);
        // let name_key = Object.keys(data["search_result"]["대표_원재료_명"]).length;
        // console.log(name_key);
        // let str = ' ';
        // for (let j = 0; j < name_key; j++) {
        //   str += data["search_result"][key[1]][j]
        //   str += ', ';
        // }
        // p.innerText = str;

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




// // clg tab
// // nfn tab

