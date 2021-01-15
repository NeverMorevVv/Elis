// общая цена
function totalSum() {
  let sum = 0;
  var total = 0;
  sumArr = [];
  allCost = $('.basket_price span').text(
    function(i, val) {
      sumArr.push(val)
    })
  sumArr.forEach(item => {
    total += Number(item)
  })
  $('#tp').text(total + ' грн.');
}

document.addEventListener("DOMContentLoaded", () => {
  totalSum();
});


// цена за позицию товара
function sumInLine() {
  const field = $(".basket_field")

  for (var i = 0; i < field.length; i++) {
    let searchEl = field[i].querySelector('.show');
    let elText = searchEl.textContent;
    console.log('searchEl', searchEl, 'elText', elText);

    let searchCost = field[i].querySelector('.cost');
    let costText = searchCost.textContent;
    console.log('searchCost', searchCost, 'costText', costText)
    let totalCost = costText * elText;
    if (costText != totalCost) {
      searchCost.innerHTML = totalCost;
    }
  }
};

$(".show").bind("DOMSubtreeModified", function() {
  sumInLine();
});


// кнопки buy_now
var btnsByNow = $(".button_buy_now");

btnsByNow.on("click", byNow);

function byNow() {
  const idAdd = $(this).data("id");
  const send = JSON.stringify(idAdd);
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:5000/mycart');
  xhr.responseType = 'json';
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader("Value", "Item");
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


// удаление товара из корзины
var btns = $(".button_delete");
btns.on("click", del);

function del() {
  const qwe = confirm("Вы действительно желаете удалить этот товар из корзины?");
  if (qwe) {
    let idDel = $(this).data("id");
    idDel = "del=" + idDel;
    const send = JSON.stringify(idDel);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/mycart');
    xhr.responseType = 'json';
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader("Value", "Delete");
    xhr.withCredentials = true;
    xhr.send(send);

    xhr.onload = () => {
      console.log('success! 👍');
    };
    xhr.onerror = () => {
      console.log('Something went wrong! ❌');
      console.log(xhr.response);
    };

    $(this).parent().remove();
  }
}


// изменение количества товаров
var btnsPlus = $("button[data-count='plus']");
btnsPlus.on("click", plus);

function plus() {
  let idPlus = $(this).data("id");
  idPlus = "pls=" + idPlus;
  const send = JSON.stringify(idPlus);
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:5000/mycart');
  xhr.responseType = 'json';
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader("Value", "Plus");
  xhr.withCredentials = true;
  xhr.send(send);

  xhr.onload = () => {
    let id = xhr.response.id;
    $(`span[data-id="${id}"]`).text(xhr.response.quantity);
  };
  xhr.onerror = () => {
    console.log('Something went wrong! ❌');
    console.log(xhr.response);
  };
  sumInLine();
}

var btnsMinus = $("button[data-count='minus']");
btnsMinus.on("click", minus);

function minus() {
  let idMinus = $(this).data("id");
  idMinus = "mns=" + idMinus;
  const send = JSON.stringify(idMinus);
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:5000/mycart');
  xhr.responseType = 'json';
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader("Value", "Minus");
  xhr.withCredentials = true;
  xhr.send(send);

  xhr.onload = () => {
    let id = xhr.response.id;
    $(`span[data-id="${id}"]`).text(xhr.response.quantity);
  };
  xhr.onerror = () => {
    console.log(xhr.response);
  };
}
