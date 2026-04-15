document.addEventListener('DOMContentLoaded', function () {
  var rangeUsage   = document.getElementById('rangeUsage');
  var numUsage     = document.getElementById('numUsage');
  var bottlePrice  = document.getElementById('bottlePrice');
  var dispenserSel = document.getElementById('dispenserCost');
  var customWrap   = document.getElementById('customWrap');
  var customCost   = document.getElementById('customCost');
  var btnCalc      = document.getElementById('btnCalc');
  var btnBack      = document.getElementById('btnBack');
  var screenInput  = document.getElementById('screen-input');
  var screenResult = document.getElementById('screen-result');

  // フィルター代：7,700円(税抜) × 1.1 × 2回 ÷ 12ヶ月 = 1,411.67円 → 約1,412円/月
  var FILTER_MONTHLY = Math.round(7700 * 1.1 * 2 / 12);
  // ガス代：6,000円 ÷ 1,100本 ≒ 5.45円/本
  var GAS_PER_BOTTLE = 6000 / 1100;

  rangeUsage.addEventListener('input', function () { numUsage.value = rangeUsage.value; });
  numUsage.addEventListener('input',   function () { rangeUsage.value = numUsage.value; });

  function syncCustomWrap() {
    customWrap.style.display = dispenserSel.value === 'custom' ? 'block' : 'none';
    if (dispenserSel.value !== 'custom') customCost.classList.remove('error');
  }
  dispenserSel.addEventListener('change', syncCustomWrap);
  dispenserSel.addEventListener('input',  syncCustomWrap);

  function fmtYen(n) {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(n);
  }

  btnCalc.addEventListener('click', function () {
    var usage = parseFloat(numUsage.value)    || 0;
    var price = parseFloat(bottlePrice.value) || 0;
    var cost;

    if (dispenserSel.value === 'custom') {
      cost = parseFloat(customCost.value) || 0;
      if (cost <= 0) {
        customCost.classList.add('error');
        customCost.focus();
        return;
      }
      customCost.classList.remove('error');
    } else {
      cost = parseFloat(dispenserSel.value) || 0;
    }

    document.getElementById('r-usage').textContent = usage + ' 本/日';
    document.getElementById('r-price').textContent = fmtYen(price) + '/本';
    document.getElementById('r-cost').textContent  = fmtYen(cost);

    var bottleMonthly    = usage * price * 30;
    var dispenserMonthly = (usage * GAS_PER_BOTTLE * 30) + FILTER_MONTHLY;
    var savings          = bottleMonthly - dispenserMonthly;

    var savingsEl = document.getElementById('r-savings');
    savingsEl.textContent = fmtYen(Math.floor(savings));
    savingsEl.className   = 'rvalue ' + (savings > 0 ? 'green' : 'red');

    var roiEl = document.getElementById('r-roi');
    roiEl.className = 'rvalue';
    if (savings > 0) {
      var totalMonths = cost / savings;
      var years  = Math.floor(totalMonths / 12);
      var months = Math.ceil(totalMonths % 12);
      var txt = '';
      if (years  > 0) txt += years  + '年';
      if (months > 0) txt += months + 'ヶ月';
      if (txt === '')  txt = '1ヶ月未満';
      roiEl.textContent = txt;
    } else {
      roiEl.textContent = '削減効果なし';
      roiEl.className   = 'rvalue red';
    }

    screenInput.classList.add('hidden');
    screenResult.classList.remove('hidden');
    window.scrollTo(0, 0);
  });

  btnBack.addEventListener('click', function () {
    screenResult.classList.add('hidden');
    screenInput.classList.remove('hidden');
    window.scrollTo(0, 0);
  });
});
