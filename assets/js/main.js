/** Price */
let rangePrice = document.querySelector('#rangePrice')
/** payment */
let rangePayment = document.querySelector('#rangePayment')
/** per of payment */
let perPayment = document.querySelector('#perPayment')
/** Term */
let rangeTerm = document.querySelector('#rangeTerm')

// inputs:
let price = document.querySelector('#price')
let payment = document.querySelector('#payment')
let term = document.querySelector('#term')

let suma = document.querySelector('#suma')
let monthly = document.querySelector('#monthly')

// Зависимость от ползунков
// Цена
price.oninput = function () {
  // Окрашиваем ползунок прогресса
  var line = (this.value - this.min) / (this.max - this.min) * 100
  this.style.background = 'linear-gradient(to right, #FF9514 0% ' + line + '%, #E1E1E1 ' + line + '%, #E1E1E1 100%)'
  // Выводим значение
  rangePrice.value = parseInt(this.value)
  // считаем проценты
  perPayment.innerHTML = Math.ceil(payment.value * 100 / this.value) + ' %'

  let monthlyCount = Math.ceil((this.value - payment.value) * (0.05 * Math.pow((1 + 0.05), term.value) / (Math.pow((1 + 0.05), term.value) - 1)))
  monthly.innerHTML = monthlyCount + ' ₽'

  suma.innerHTML = Math.ceil(Number(payment.value) + term.value * monthlyCount) + ' ₽'

  
};

// Взнос
payment.oninput = function () {
  // Окрашиваем ползунок прогресса
  var line = (this.value - this.min) / (this.max - this.min) * 100
  this.style.background = 'linear-gradient(to right, #FF9514 0% ' + line + '%, #E1E1E1 ' + line + '%, #E1E1E1 100%)'
  // Выводим значение
  rangePayment.value = parseInt(this.value)
  // считаем проценты
  perPayment.innerHTML = Math.ceil(this.value * 100 / price.value) + ' %'

  let monthlyCount = Math.ceil((price.value - this.value) * (0.05 * Math.pow((1 + 0.05), term.value) / (Math.pow((1 + 0.05), term.value) - 1)))
  monthly.innerHTML = monthlyCount + ' ₽'

  suma.innerHTML = Math.ceil(Number(this.value) + term.value * monthlyCount) + ' ₽'

  ra
};

// Срок
term.oninput = function () {
  // Окрашиваем ползунок прогресса
  var line = (this.value - this.min) / (this.max - this.min) * 100
  this.style.background = 'linear-gradient(to right, #FF9514 0% ' + line + '%, #E1E1E1 ' + line + '%, #E1E1E1 100%)'
  // Выводим значение
  rangeTerm.value = parseInt(this.value)

  let monthlyCount = Math.ceil((price.value - payment.value) * (0.05 * Math.pow((1 + 0.05), this.value) / (Math.pow((1 + 0.05), this.value) - 1)))
  monthly.innerHTML = monthlyCount + ' ₽'

  suma.innerHTML = Math.ceil(Number(payment.value) + this.value * monthlyCount) + ' ₽'
};

console.log('3')