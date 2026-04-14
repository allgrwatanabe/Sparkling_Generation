document.addEventListener('DOMContentLoaded', function () {
  var rangeUsage   = document.getElementById('rangeUsage');
  var numUsage     = document.getElementById('numUsage');
  var bottlePrice  = document.getElementById('bottlePrice');
  var btnCalc      = document.getElementById('btnCalc');
  var btnBack      = document.getElementById('btnBack');
  var screenInput  = document.getElementById('screen-input');
  var screenResult = document.getElementById('screen-result');

  // スライダー ↔ 数値入力の連動
  rangeUsage.addEventListener('input', function () { numUsage.value = rangeUsage.value; });
  numUsage.addEventListener('input',   function () { rangeUsage.value = numUsage.value; });

  function fmtYen(n) {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(n);
  }

  btnCalc.addEventListener('click', function () {
    var usage = parseFloat(numUsage.value)    || 0;
    var price = parseFloat(bottlePrice.value) || 0;

    var bottleMonthly    = usage * price * 30;
    var dispenserMonthly = (usage * 5.45 * 30) + 917;
    var savings          = bottleMonthly - dispenserMonthly;

    document.getElementById('r-usage').textContent     = usage + ' 本/日';
    document.getElementById('r-price').textContent     = fmtYen(price) + '/本';
    document.getElementById('r-bottle').textContent    = fmtYen(Math.floor(bottleMonthly));
    document.getElementById('r-dispenser').textContent = fmtYen(Math.floor(dispenserMonthly));
    document.getElementById('r-diff').textContent      = fmtYen(Math.floor(savings));

    var savingsEl = document.getElementById('r-savings');
    savingsEl.textContent = fmtYen(Math.floor(savings));
    savingsEl.className   = savings > 0 ? 'merit-value' : 'merit-value red';

    var diffRow = document.querySelector('.breakdown-row.diff');
    if (savings <= 0) {
      diffRow.classList.add('red');
    } else {
      diffRow.classList.remove('red');
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
