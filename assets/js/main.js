// 7 324 234 ₽ (добавляем рубли к value)
const priceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0
});
// Находи наши импуты ввода цифр
/** цена автомобиля */
let rangePrice = document.querySelector('#rangePrice')
/** взнос - первая часть оплаты */
let rangePayment = document.querySelector('#rangePayment')
/** расчитываем процент оплаты от покупки*/
let perPayment = document.querySelector('#perPayment')
/** срок аренды */
let rangeTerm = document.querySelector('#rangeTerm')

/** сумма лизинга */
let summa = document.querySelector('#suma')
/** месячная оплата */
let monthly = document.querySelector('#monthly')
/** Форма нашего счетчика */
let form = document.querySelector('#form')

/** cleave - опция форматирования */
const cleaveValSet = {
  numeral: true,
  numeralThousandsGroupStyle: 'thousand',
  delimiter: ' '
}

// Создаем пропуски между тысячными, используя cleave - опцию форматирования
const cleavePrice = new Cleave(rangePrice, cleaveValSet)
const cleavePayment = new Cleave(rangePayment, cleaveValSet)
const cleaveTerm = new Cleave(rangeTerm, cleaveValSet)

const maxPrice = 10000000
const maxPayment = +cleavePrice.getRawValue() * 0.6
const maxTerm = 120

// создаем рассчет при запуске страницы
rent()

/** Отображение и расчет суммы аренды */
form.addEventListener('input', function () {
  rent()
})
//   suma.innerHTML = Math.ceil(Number(payment.value) + this.value * monthlyCount) + ' ₽'

function rent() {
  // Проверка на максимальную стоимость
  let cost = +cleavePrice.getRawValue()
  if (cost > maxPrice) cost = maxPrice

  // Проверка на максимальную оплату
  let pay = +cleavePayment.getRawValue()
  if (pay > maxPayment) pay = maxPayment

  // Проверка на максимальный срок
  let term = +cleaveTerm.getRawValue()
  if(term > 120) term = maxTerm


  /** остаток после первого взноса */
  let odd = cost - pay
  /** Процент к лизингу, по скольку не задано придумываем сами*/
  const perLeasing = 0.14
  /**  месячный процент лизинга */
  let monthRate = (odd * perLeasing / 12)

  /** оплата в месяцах */
  const monthlyRent = (odd * monthRate) / (1 - (1 + monthRate) * (1 - term))
  monthly.innerHTML = priceFormatter.format(monthlyRent)

  /** Считаю сумму лизинга */
  let totalLeasing = monthlyRent * term + pay
  summa.innerHTML = priceFormatter.format(totalLeasing)

  // считаем проценты
  perPayment.innerHTML = Math.ceil(pay * 100 / cost) + ' %'
}

/** Слайдер Цены*/
const sliderPrice = document.querySelector('#sliderPrice')

noUiSlider.create(sliderPrice, {
  start: 3300000,

  connect: 'lower',
  tooltips: false,
  step: 1000,
  range: {
    min: 1500000,
    max: 10000000
  },
  // Создаем пропуски 2 000 000
  format: wNumb({
    decimals: 0,
    thousand: ' ',
    suffix: ''
  })
})

sliderPrice.noUiSlider.on('slide', function () {
  let priceVal = parseInt(sliderPrice.noUiSlider.get(true))
  // передаем значение слайдера инпуту
  rangePrice.value = priceVal

  cleavePrice.setRawValue(priceVal)

  rent()
})

/** Слайдер Оплаты*/
const sliderPay = document.querySelector('#sliderPay')

noUiSlider.create(sliderPay, {
  start: 420000,

  connect: 'lower',
  tooltips: false,
  step: 1000,
  range: {
    min: 100000,
    max: maxPayment
  },
  // Создаем пропуски 2 000 000
  format: wNumb({
    decimals: 0,
    thousand: ' ',
    suffix: ''
  })
})

sliderPay.noUiSlider.on('slide', function () {
  let paymentVal = parseInt(sliderPay.noUiSlider.get(true))
  // передаем значение слайдера инпуту
  rangePayment.value = paymentVal

  cleavePayment.setRawValue(paymentVal)

  rent()
})

/** Слайдер Срока*/
const sliderTerm = document.querySelector('#sliderTerm')

noUiSlider.create(sliderTerm, {
  start: 60,

  connect: 'lower',
  tooltips: true,
  step: 1,
  range: {
    min: 6,
    max: 120
  },
  // Создаем пропуски 2 000 000
  format: wNumb({
    decimals: 0,
    thousand: '',
    suffix: ''
  })
})

sliderTerm.noUiSlider.on('slide', function () {
  let termVal = parseInt(sliderTerm.noUiSlider.get(true))
  // передаем значение слайдера инпуту
  rangeTerm.value = termVal

  cleaveTerm.setRawValue(termVal)

  rent()
})

// Проверка ввода инпут Price
rangePrice.addEventListener('input', function () {
  let value = +cleavePrice.getRawValue()

  // Слайдер тоже меняет свое состояние при вводе
  sliderPrice.noUiSlider.set(value)

  // проверка на максимальную стоимость
  if (value > 10000000) {
    rangePrice.closest('.item__meaning').classList.add('item__meaning--error')
  } else {
    rangePrice.closest('.item__meaning').classList.remove('item__meaning--error')
  }

  // Зависимость превоначального взноса от цены
  let percentMin = value * 0.1
  let percentMax = value * 0.6

  sliderPay.noUiSlider.updateOptions({
    range: {
      min: percentMin,
      max: percentMax
    }
  })
})

// сброс инпута цены, при введении большого число пользователем
rangePrice.addEventListener('change', function () {
  let value = +cleavePrice.getRawValue()

  if (value > maxPrice) {
    rangePrice.closest('.item__meaning').classList.remove('item__meaning--error')
    cleavePrice.setRawValue(maxPrice)
  }
})

// Проверка ввода инпут Payment
rangePayment.addEventListener('input', function () {
  let value = +cleavePayment.getRawValue()

  // Слайдер тоже меняет свое состояние при вводе
  sliderPay.noUiSlider.set(value)

  // проверка на максимальный ввод
  if (value > maxPayment) {
    rangePayment.closest('.item__meaning').classList.add('item__meaning--error')
  } else {
    rangePayment.closest('.item__meaning').classList.remove('item__meaning--error')
  }
})

// сброс инпута цены, при введении большого число пользователем
rangePayment.addEventListener('change', function () {
  let value = +cleavePayment.getRawValue()

  if (value > maxPayment) {
    rangePayment.closest('.item__meaning').classList.remove('item__meaning--error')
    cleavePayment.setRawValue(maxPayment)
  }
})

// Проверка ввода инпут Term
rangeTerm.addEventListener('input', function () {
  let value = +cleaveTerm.getRawValue()

  // Слайдер тоже меняет свое состояние при вводе
  sliderTerm.noUiSlider.set(value)

  // проверка на максимальный ввод
  if (value > maxTerm) {
    rangeTerm.closest('.item__meaning').classList.add('item__meaning--error')
  } else {
    rangeTerm.closest('.item__meaning').classList.remove('item__meaning--error')
  }
})

// сброс инпута цены, при введении большого число пользователем
rangeTerm.addEventListener('change', function () {
  let value = +cleaveTerm.getRawValue()

  if (value > maxTerm) {
    rangeTerm.closest('.item__meaning').classList.remove('item__meaning--error')
    cleaveTerm.setRawValue(maxTerm)
  }
})
// // inputs:
// let price = document.querySelector('#price')
// let payment = document.querySelector('#payment')
// let term = document.querySelector('#term')

// let suma = document.querySelector('#suma')
// let monthly = document.querySelector('#monthly')

// // Зависимость от ползунков
// // Цена
// price.oninput = function () {
//   // Окрашиваем ползунок прогресса
//   var line = (this.value - this.min) / (this.max - this.min) * 100
//   this.style.background = 'linear-gradient(to right, #FF9514 0% ' + line + '%, #E1E1E1 ' + line + '%, #E1E1E1 100%)'
//   // Выводим значение
//   rangePrice.value = parseInt(this.value)
//   // считаем проценты
//   perPayment.innerHTML = Math.ceil(payment.value * 100 / this.value) + ' %'

//   let monthlyCount = Math.ceil((this.value - payment.value) * (0.05 * Math.pow((1 + 0.05), term.value) / (Math.pow((1 + 0.05), term.value) - 1)))
//   monthly.innerHTML = monthlyCount + ' ₽'

//   suma.innerHTML = Math.ceil(Number(payment.value) + term.value * monthlyCount) + ' ₽'

  
// };

// // Взнос
// payment.oninput = function () {
//   // Окрашиваем ползунок прогресса
//   var line = (this.value - this.min) / (this.max - this.min) * 100
//   this.style.background = 'linear-gradient(to right, #FF9514 0% ' + line + '%, #E1E1E1 ' + line + '%, #E1E1E1 100%)'
//   // Выводим значение
//   rangePayment.value = parseInt(this.value)
//   // считаем проценты
//   perPayment.innerHTML = Math.ceil(this.value * 100 / price.value) + ' %'

//   let monthlyCount = Math.ceil((price.value - this.value) * (0.05 * Math.pow((1 + 0.05), term.value) / (Math.pow((1 + 0.05), term.value) - 1)))
//   monthly.innerHTML = monthlyCount + ' ₽'

//   suma.innerHTML = Math.ceil(Number(this.value) + term.value * monthlyCount) + ' ₽'

//   ra
// };

// // Срок
// term.oninput = function () {
//   // Окрашиваем ползунок прогресса
//   var line = (this.value - this.min) / (this.max - this.min) * 100
//   this.style.background = 'linear-gradient(to right, #FF9514 0% ' + line + '%, #E1E1E1 ' + line + '%, #E1E1E1 100%)'
//   // Выводим значение
//   rangeTerm.value = parseInt(this.value)

//   let monthlyCount = Math.ceil((price.value - payment.value) * (0.05 * Math.pow((1 + 0.05), this.value) / (Math.pow((1 + 0.05), this.value) - 1)))
//   monthly.innerHTML = monthlyCount + ' ₽'

//   suma.innerHTML = Math.ceil(Number(payment.value) + this.value * monthlyCount) + ' ₽'
// };