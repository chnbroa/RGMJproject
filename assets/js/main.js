
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
  const province = document.getElementById("search_province");
  const province_span = document.getElementById("search_province_span");
  val = nutrient_cal("지방", structure["지방(g)"]) + "%";
  province.style.width = val;
  province_span.innerHTML = val;

  //탄수화물
  const carbohydrate = document.getElementById("search_carbohydrate");
  const carbohydrate_span = document.getElementById("search_carbohydrate_span");
  val = nutrient_cal("탄수화물", structure["탄수화물(g)"]) + "%";
  carbohydrate.style.width = val;
  carbohydrate_span.innerHTML = val;

  //나트륨
  const nateulyum = document.getElementById("search_nateulyum");
  const nateulyum_span = document.getElementById("search_nateulyum_span");
  val = nutrient_cal("나트륨", structure["나트륨(㎎)"]) + "%";
  nateulyum.style.width = val;
  nateulyum_span.innerHTML = val;

}

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
        for (let i in key) {
          console.log(key[i]);
          console.log(data["search_food"][key[i]][0]);
          structure[key[i]] = data["search_food"][key[i]][0]
        }
        speech_text(structure['식품명']);
        document.getElementById('speech_text_button').addEventListener('click', function () {
          speech_text(structure['식품명']);
        });

        //1일영향섭취기준(%) progress-bar
        progress_bar_apply(structure);


        // let key = Object.keys(data["search_result"]);
        // let name_key = Object.keys(data["search_result"]["대표_원재료_명"]).length;
        // console.log(name_key);
        // let str = ' ';
        // for (let j = 0; j < name_key; j++) {
        //   str += data["search_result"][key[1]][j]
        //   str += ', ';
        // }
        // p.innerText = str;
        return data
      })
      .catch(error => {
        console.error('Error sending image:', error);
      });
  });
}




// async function f() {
//   let response = await fetch('./test.json');
//   let user = await response.json();
//   console.log(user["search_result"]);
//   let key = Object.keys(user["search_result"]);
//   let name_key = Object.keys(user["search_result"]["대표_원재료_명"]).length;
//   console.log(name_key);
//   for (let j = 0; j < name_key; j++) {
//     for (let i in key) {
//       console.log(user["search_result"][key[i]][j])
//     }
//     console.log("\n");
//   }


//   return user;
//   // await fetch("./test.json")
//   //   .then(response => {
//   //     return response.json();
//   //   })
//   // .then(jsondata => console.log(jsondata));
// }

// async function ff() {
//   let response = await fetch('./test.json');
//   let user = await response.json();
//   console.log(user["search_result"]);
//   let key = Object.keys(user["search_result"]);
//   let name_key = Object.keys(user["search_result"]["대표_원재료_명"]).length;
//   console.log(name_key);
//   let str = ' ';
//   for (let j = 0; j < name_key; j++) {
//     str += user["search_result"][key[1]][j]
//     str += ', ';
//   }
//   console.log(str);
//   return str
// }


// async function fff() {
//   let response = await fetch('./test.json');
//   let user = await response.json();
//   console.log(user["search_food"]['식품명'][0]);


//   let str = ' ';
//   // for (let j = 0; j < name_key; j++) {
//   //   console.log(user["search_food"][key[1]][j]);
//   // }
//   return str
// }




// let test = fff();
// // const result = await test.json();
// console.log(test);
// // clg tab
// // nfn tab