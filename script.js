"use strict";

/////////////////////////////////////////////////
// BANKIST APP
// Data

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};
const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};
const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};
const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};
let arr = [account1, account2, account3, account4];
arr.forEach((item) => {
  item.username = item.owner

    .toLowerCase()
    .split(" ")
    .map((val) => {
      return val[0];
    })
    .join("");
});
const accounts = [account1, account2, account3, account4];

// Elements

const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");
const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");
const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");
const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

//////////////////FUNCTIONS

// date

function timeFun() {
  let soat = new Date().toLocaleTimeString();
  let kun = String(new Date().getDate()).padStart(2, 0);
  let oy = String(new Date().getMonth()).padStart(2, 0);
  let yil = new Date().getFullYear();
  labelDate.textContent = `${kun}/${oy}/${yil} ${soat}`;
}
setInterval(timeFun, 1000);

// totalMoney function

const totalMoney = function (obj) {
  let yig = obj.movements.reduce((sum, val) => {
    return sum + val;
  }, 0);
  return yig;
};

let sumIn = 0;
let sumOut = 0;
let komisiya = 0;
const statistic = function (obj) {
  sumOut = obj.movements
    .filter((val) => {
      return val < 0;
    })
    .reduce((sum, val) => {
      return sum + val;
    }, 0);
  sumIn = obj.movements
    .filter((val) => {
      return val > 0;
    })
    .reduce((sum, val) => {
      return sum + val;
    }, 0);
  komisiya = obj.movements
    .filter((val) => {
      return val < 0;
    })
    .map((val) => {
      return (val * obj.interestRate) / 100;
    })
    .reduce((sum, val) => {
      return sum + val;
    }, 0);
};

// ektanTranzaksiya function

const ektanTranzaksiya = function (obj) {
  containerMovements.innerHTML = "";
  obj.movements.forEach((item) => {
    let tekshir = item > 0 ? "deposit" : "withdrawal";
    let html1 = `<div class="movements__row">
    <div class="movements__type movements__type--${tekshir}">2 ${tekshir}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${item}€</div>
  </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html1);
  });
};
// first listener

let kirganUser;
btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  let login = inputLoginUsername.value;
  let parol = Number(inputLoginPin.value);
  kirganUser = arr.find((val) => {
    return val.username === login;
  });
  if (kirganUser?.pin == parol) {
    labelWelcome.textContent = `Welcome ${kirganUser.owner}`;
    containerApp.style.opacity = "1";
    labelWelcome.style.color = "#333";
  } else {
    labelWelcome.textContent = `Try again!`;
    labelWelcome.style.color = "red";
  }
  if (!kirganUser) {
    labelWelcome.textContent = `Try again!`;
    labelWelcome.style.color = "red";
  }
  inputLoginUsername.value = inputLoginPin.value = "";
  ektanTranzaksiya(kirganUser);
  labelBalance.textContent = `${totalMoney(kirganUser)}€`;
  statistic(kirganUser);
  labelSumIn.textContent = sumIn;
  labelSumOut.textContent = Math.abs(sumOut);
  labelSumInterest.textContent = Math.abs(komisiya);
});

// transferMoney function

const transferMoney = function () {
  let transferSum = Number(inputTransferAmount.value);
  let transferwho = inputTransferTo.value;
  let pulOluvchi = arr.find((val) => {
    return val.username === transferwho;
  });
  if (arr.includes(pulOluvchi)) {
    if (labelBalance.textContent < inputTransferAmount.value) {
      alert(
        `Sizni mablagingiz ${labelBalance.textContent}ga teng , Undan kop pulni otkaza olmaysiz`
      );
    } else {
      pulOluvchi.movements.push(transferSum);
      kirganUser.movements.push(-transferSum);
    }
  } else {
    alert("Kechirasiz bizda bunday mijoz yoq");
  }
};

// second listener

btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  transferMoney();
  ektanTranzaksiya(kirganUser);
  totalMoney(kirganUser);
  statistic(kirganUser);
  labelSumIn.textContent = sumIn;
  labelSumOut.textContent = Math.abs(sumOut);
  labelSumInterest.textContent = Math.abs(komisiya);
  labelBalance.textContent = `${totalMoney(kirganUser)}€`;
  inputTransferTo.value = "";
  inputTransferAmount.value = "";
});

// requestLoan function

let limit = Number(labelSumIn.textContent) / 10;

const requestLoan = function () {
  let qarz = Number(inputLoanAmount.value);
  if (qarz < Number(labelSumIn.textContent) / 10) {
    kirganUser.movements.push(qarz);
  } else {
    alert(
      `Siz ${
        Number(labelSumIn.textContent) / 10
      } dan kop qarz ola olmaysiz, Iltimos qayta urining!`
    );
  }
};

// third listener

btnLoan.addEventListener("click", (e) => {
  e.preventDefault();
  requestLoan();
  ektanTranzaksiya(kirganUser);
  totalMoney(kirganUser);
  statistic(kirganUser);
  labelSumIn.textContent = sumIn;
  labelBalance.textContent = `${totalMoney(kirganUser)}€`;
  inputLoanAmount.value = "";
});

// closeAccount function

const closeAccount = function () {
  let closeUser = inputCloseUsername.value;
  let closePin = Number(inputClosePin.value);
  if (kirganUser?.pin == closePin && kirganUser?.username === closeUser) {
    containerApp.style.opacity = "0";
  } else {
    alert("siz xato Ma`lumot kiritdingiz");
    inputCloseUsername.value = "";
    inputClosePin.value = "";
  }
};

// fourth listener

btnClose.addEventListener("click", (e) => {
  e.preventDefault();
  closeAccount();
  let ochuvchi = arr.findIndex((val) => {
    return val.pin === Number(inputClosePin.value);
  });
  arr.splice(ochuvchi, 1);
});
let qu = 1;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  if (qu) {
    kirganUser.movements.sort((a, b) => a - b);
    ektanTranzaksiya(kirganUser);
    qu = 0;
  } else {
    kirganUser.movements = [...movements];
    ektanTranzaksiya(kirganUser);
    qu = 1;
  }
});
// timer
let vaqt = 300;
function timerFun() {
  let vaqtString = String(vaqt).split("");
  let vaqtString1 = Number(vaqtString[0]);
  let a = 60;
  a = a - 1;
  if (a === 0) {
    vaqtString1 - 1;
  }

  labelTimer.textContent = `0${vaqtString1}:a`;
  endTime();
}
setInterval(timerFun, 1000);

// close function
function endTime() {
  if (labelTimer.textContent === "00:00") {
    containerApp.style.opacity = "0";
  }
}

// setTimeout(() => {
//   containerApp.style.opacity = "0";
//   console.log("salom");
// }, 5000);

/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],

  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
