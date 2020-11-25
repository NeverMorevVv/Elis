// общая цена
// function totalSum() {
//   let sum = 0;
//   allCost = $('.basket_price p').text()
//   data = allCost.split('$');
//   for (var i = 0; i < data.length; i++) {
//     sum += +(data[i]);
//   }
//   $('#tp').text(sum + '$');
// }
// totalSum();

// кнопки Del
// $(".button_delete").on("click", del);
//
// function del() {
//   var qwe = confirm("Вы действительно желаете удалить этот товар из корзины?");
//   if (qwe) {
//     $.ajax({
//       url: '/mycart', // путь к обработчику
//       type: 'GET', // метод передачи данных
//       data: {
//         data_id: $(this).children().attr('data_id')
//       },
//       success: function(response) {
//         $('body').html(response);
//         footerMoover();
//       }
//     });
//   }
// }

// кнопки кол-ва
// z = $(".quantity button").on("click", changeQuantity);
//
// function changeQuantity() {
//   $.ajax({
//     url: '/mycart', // путь к обработчику
//     type: 'GET', // метод передачи данных
//     data: {
//       data_id: this.dataset.id,
//       data_count: this.dataset.count
//     },
//     success: function(response) {
//       $('body').html(response);
//       footerMoover();
//     }
//   });
// }




// кнопки buy_now
var btnsByNow = $(".button_buy_now");
// var filterSet = new Set();


// // Заполняем filterSet
// function filterSetLoader() {
//   if (localStorage.length > 0) {
//     arrByNow = JSON.parse(localStorage.getItem('arrByNow'));
//     for (var i = 0; i < arrByNow.length; i++) {
//       filterSet.add(arrByNow[i]);
//     }
//   }
// }
// filterSetLoader();


btnsByNow.on("click", byNow);

function byNow() {
  // if (btnsByNow.length > 1) {
  //   filterSet.add($(this).data("id"));
  //   arrByNow = [...filterSet];
  //   localStorage.setItem("arrByNow", JSON.stringify(arrByNow));
  // }
  const idAdd = $(this).data("id");
  console.log(idAdd);
  const send = JSON.stringify(idAdd);
  console.log(send);
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:5000/mycart');
  xhr.responseType = 'json';
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.withCredentials = true;
  xhr.send(send);

  xhr.onload = () => {
    console.log('success! 👍');
  };
  xhr.onerror = () => {
    console.log('Something went wrong! ❌');
    console.log(xhr.response);
  };
}

// mousedown
// var myCartButton = document.getElementById('basket');
//
// function sendSata() {
//   if (arrByNow) {
//     const sendArr = JSON.stringify(arrByNow);
//     const xhr = new XMLHttpRequest();
//     xhr.open('POST', 'http://localhost:5000/mycart');
//     xhr.responseType = 'json';
//     xhr.setRequestHeader('Content-Type', 'application/json');
//     xhr.send(sendArr);
//
//     xhr.onload = () => {
//       console.log('success! 👍');
//     };
//     xhr.onerror = () => {
//       console.log('Something went wrong! ❌');
//       console.log(xhr.response);
//     };
//   };
// };
// if (myCartButton) {
//   sendSata();
// }

// menu checkbox
// var pos = document.getElementsByClassName('card_product');
// var checkbox = document.getElementsByTagName('input');
//
// for (var i = 0; i < checkbox.length; i++) {
//   checkbox[i].addEventListener('change', () => {
//     hide(event.target);
//     footerMoover();
//   })
// }
//
// function hide() {
//   if (event.target.checked && checkbox[0].checked == true) {
//     checkbox[0].checked = false
//
//   }
//   if (event.target == checkbox[0]) {
//     for (var i = 1; i < checkbox.length; i++) {
//       checkbox[0].checked = true
//       checkbox[i].checked = false
//     }
//   }
//   for (var i = 0; i < pos.length; i++) {
//     if (checkbox[0].checked == true) {
//       pos[i].setAttribute("style", "display:block");
//     } else {
//       pos[i].setAttribute("style", "display:none");
//     }
//   }
//   for (var i = 0; i < checkbox.length; i++) {
//     if (checkbox[i].checked == true) {
//       let name = checkbox[i].name;
//       for (var y = 0; y < pos.length; y++) {
//         if (pos[y].dataset.category === name) {
//           pos[y].setAttribute("style", "display:block");
//         }
//       }
//     }
//   }
// }

//  footerMoover
var footer = document.querySelector('footer');
var body = document.querySelector('body');

function footerMoover() {
  let screenHeight = screen.height;
  if (screenHeight > (body.clientHeight + footer.clientHeight)) {
    footer.setAttribute("style", "position: absolute; bottom: 0; width: 100%;");
    // footer.setAttribute("style", "width: 100%");
  } else {
    footer.setAttribute("style", "position: relative;");
  }
}
window.addEventListener('load', footerMoover);
