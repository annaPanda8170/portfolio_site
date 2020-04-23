// transformに使えるanimate（輸入）
$.fn.animate2 = function (properties, duration, ease) {
  ease = ease || 'ease';
  var $this = this;
  var cssOrig = { transition: $this.css('transition') };
  return $this.queue(next => {
      properties['transition'] = 'all ' + duration + 'ms ' + ease;
      $this.css(properties);
      setTimeout(function () {
          $this.css(cssOrig);
          next();
      }, duration);
  });
};

// ##########オープニング#########################################################

// 以下二つの関数で使用する共通の変数。タイトルの文字列
let name = [["a", "n", "n", "a", "P", "a", "n", "d", "a"], ["p", "o", "r", "t", "f", "o", "l", "i", "o"], ["s", "i", "t", "e"]]

// 最初から実行される文字変え関数
function lettersChange() {
  let letters = [0, 1, "a", "n", "p", "d", "f", "i", "s"];
  let colors = ["#fff2ad", "#f5b2af", "#a3bce2", "#d4acd0"];
  let letters_length = letters.length;
  let colors_length = colors.length
  let $udChg = [];
  let $upChg = [];
  // 本来7まであるが7は無変化にする
  for (let i = 1; i <= 6; i++) {
    $udChg[i] = $(".udChg" + i);
    $upChg[i] = $(".upChg" + i);
  }
  // underの色と文字変えupperの文字だけ変え
  // setIntervalを入れ込む
  let change = [];
  // setInterval繰り返しの回数カウント
  let num = [];
  for (let i = 1; i <= 6; i++) {
    num[i] = 0;
    let wait = Math.floor(Math.random() * 1400 + 200);
    let repert = Math.floor(5800 / wait);
    change[i] = setInterval(function () {
      num[i]++;
      $udChg[i].html(letters[Math.floor(Math.random() * letters_length)]).css({ color: colors[Math.floor(Math.random() * colors_length)] })
      $upChg[i].html(letters[Math.floor(Math.random() * letters_length)])
      if (num[i] >= repert) {
        clearInterval(change[i])
      }
    }, wait)
  }
}

// upperとunderが落ちる関数
// under文字列の記録。（upperはすでに消えているので不要）[カラム番号,セル番号]
let used = [];
// timingは落ち始めのタイミング
// columnNumberはどの列か1〜9なら必須の9本
// cellNumber落下開始の高さ
// lengthはunderは残る個数
function fall(timing, columnNumber, cellNumber, length) {
  // セルの縦に入りきる文字数+1（25）で繰り返す（つまり落ちてゆく）
  for (let i = 0; i < 25 - (cellNumber - 1); i++){
    // 一つ下に落ちる時間設定
    let wait = i * 115;
    // 綺麗な落ち方をさせるため以下の2つのカラムナンバーのみ固定でタイミングと落下開始高さ指定
    if (columnNumber == 5) {
      timing = 100;
      cellNumber = 1;
      length = 22;
    } else if (columnNumber == 2) {
      timing = 2300;
      cellNumber = 1;
      length = 22;
    }
    let waitTime = timing + wait;
    setTimeout(function () {
      // upperは一個前を消しつつ最後まで落ちる
      $("#upCell" + columnNumber + "-" + (cellNumber + i - 1)).css({ opacity: "0" });
      $("#upCell" + columnNumber + "-" + (cellNumber + i)).css({ opacity: "1" });
      // underは一個前を消さず残しつつ指定されたlength分落ちる
      if (i < length) {
        $("#udCell" + columnNumber + "-" + (cellNumber + i)).css({ opacity: "0.7" });
        used.unshift([columnNumber, cellNumber + i]);
      }
    },waitTime)
  }
}

// staggerが落ちる関数
// stagger文字列の記録。カラムのみ（staggerはカラムの縦位置をランダムで指定しているのでcellNumberが不要）
let usedSt = [];
// staggerはカラムの縦位置をランダムで指定しているのでcellNumberが不要
function fallStagger(timing, columnNumber, length) {
  // こっちはupperがないので、セルの縦に入りきる文字数ぴったり（24）で繰り返す
  for (let i = 0; i < 24; i++){
    let wait = i * 115;
    let waitTime = timing + wait;
    setTimeout(function () {
      if (i < length) {
        $("#staggerCell" + columnNumber + "-" + i).css({ opacity: "0.3" });
        usedSt.unshift(columnNumber);
      }
    },waitTime)
  }
}

// underを消して、必要ならタイトルを入れ込みする関数
function underChange(recordNumber) {
  let proccesed = 0;
  for (let j = 10, k = 0; j <= 14; j += 2, k++) {
    for (let i = 1; i <= name[k].length; i++) {
      if (used[recordNumber][0] == i && used[recordNumber][1] == j) {
        $("#udCell" + used[recordNumber][0] + "-" + used[recordNumber][1]).html(name[k][(i - 1)]).css({ textShadow: "none" }).animate({ opacity: "1" }, 2000);
        proccesed = 1;
      }
    }
  }
  if (proccesed == 0) {
    $("#udCell" + used[recordNumber][0] + "-" + used[recordNumber][1]).animate({ opacity: "0" }, 2000);
  }
}

// 消し込み関数（何個消そうか,いつ消し始めようか） 
function putOutLetters(number, wait) {
  wait = wait + Math.floor(Math.random() * 1000)
  for (let i = 0; i < number; i++) {
    setTimeout(function () {
      // 記録したうちのどれかランダムで指定
      let recordNumber = Math.floor(Math.random() * used.length);
      let stRecordNumber = Math.floor(Math.random() * usedSt.length);
      let stRecordNumberCell = Math.floor(Math.random() * 24 + 1);
      underChange(recordNumber);
      $("#staggerCell" + usedSt[stRecordNumber] + "-" + stRecordNumberCell).animate({ opacity: "0" }, 2000);
    }, wait);
  }
}

// ##########メイン#########################################################

// 落ちる関数
let usedMain = [];
function fallMain(oneColumnLetterNumber) {
  let columnNumber = Math.floor(Math.random() * 16 + 1);
  // 落ち始め最初のセル
  let cellNumber = Math.floor(Math.random() * (oneColumnLetterNumber - 18) + 1);
  // underが何個のこるか
  let length = Math.floor(Math.random() * (oneColumnLetterNumber - 18) + 5);
  usedMain.unshift([columnNumber, cellNumber, length]);
  for (let i = 0; i < oneColumnLetterNumber; i++){
    // 一つ下に落ちる時間設定
    let wait = i * 135;
    setTimeout(function () {
      // upperは一個前を消しつつ最後まで落ちる
      $("#upCellMain" + columnNumber + "-" + (cellNumber + i - 1)).css({ opacity: "0" });
      $("#upCellMain" + columnNumber + "-" + (cellNumber + i)).css({ opacity: "0.35" });
      // underは一個前を消さず残しつつ指定されたlength分落ちる
      if (i < length) {
        $("#udCellMain" + columnNumber + "-" + (cellNumber + i)).css({ opacity: "0.2" });
      }
    }, wait)
  }
}

// 文字変化
function lettersChangeMain() {
  let letters = [0, 1, "a", "n", "p", "d"];
  let colors = ["#fff2ad", "#f5b2af", "##d4acd0", "#a3bce2"];
  let $udChgMain = [];
  let $upChgMain = [];
  let change = [];
  for (let i = 1; i <= 5; i++) {
    $upChgMain[i] = $(".upChgMain"+i)
    $udChgMain[i] = $(".udChgMain" + i)
    let wait = Math.floor(Math.random() * 4000 + 1200)
    if (2000 < wait && wait < 2800){
      wait = wait * 1.3;
    }
    change[i] = setInterval(function () {
      $udChgMain[i].html(letters[Math.floor(Math.random() * 9)]).css({ color: colors[Math.floor(Math.random() * 4)] })
      $upChgMain[i].html(letters[Math.floor(Math.random() * 9)])
    }, wait)
  }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
}

// 消える関数
function putOutLettersMain(whichColumn) {
  let thisColumn = usedMain[whichColumn]
  usedMain.splice(whichColumn, 1);
  for (let i = 0; i < thisColumn[2]; i++){
    let wait = Math.floor(Math.random() * 7000 + 1000);
    setTimeout(function () {
      $("#udCellMain" + thisColumn[0] + "-" + (thisColumn[1] + i)).animate({ opacity: "0" }, 2000);
    }, wait)
  }
}

// リストネームhover時ワープイベント
function listHoverAndArrow($main, deg,nowList,oneDeg) {
  for (let i = 1; i <= 7; i++) {
    $("#listName" + i).on('mouseenter', function () {
      if (1 <= nowList - i && nowList - i <= 3) {
        deg += (nowList - i) * (-oneDeg);
      } else if (-6 <= nowList - i && nowList - i <= -4) {
        deg += ((nowList - i) + 7) * (-oneDeg) + 0.01;
      } else if (4 <= nowList - i && nowList - i <= 6) {
        deg += (7 - (nowList - i)) * oneDeg - 0.01;
      }else if(-3 <= nowList - i && nowList - i <= -1) {
        deg += -(nowList - i) * oneDeg;
      }
      deg = Math.round(deg * 100) / 100;
      if (nowList != i) {
        $("#arrow"+nowList).stop().fadeOut();
      }
      nowList = i;
      $main.stop().animate2({ transform: "rotate(" + deg + "deg)" }, 2500);
      $(".listName").stop().animate({ fontSize: "40px", opacity: ".4"}, 300);
      $("#listName" + i).stop().animate({ fontSize: "48px", opacity: "1" }, 750);
      if ($(window).outerHeight() - 190 == $("#li" + i).outerHeight() && $("#arrow"+i).css("display", "none")) {
        setTimeout(function () {
          $("#arrow" + i).stop().fadeIn(800);
        }, 2500)
      } 
    })
  }
  for (let j = 1; j <= 7; j++){
    $("#li"+j).scroll(function () {
      $("#arrow" + j).stop().fadeOut(150);
    })
  }
}

// gmailホバーポップアップ。list8のクリップボードコピー
function gmailEvents() {
  $('#gmail').hover(function () {
    $('#gmailButton').css({display: "block"})
  }, function () {
      $('#gmailButton').css({ display: "none" })
      $('#gmailButton').html("COPY<br>Email Address")
  })
  $('#gmail').on('click', function () {
    let $textarea = $('<textarea>annapanda8170@gmail.com</textarea>');
    $(this).append($textarea);
    $textarea.select();
    document.execCommand('copy');
    $textarea.remove();
    $('#gmailButton').html("COPY<br>しました");
    $('#gmail').addClass("gmailBright");
    setTimeout(function () {
      $('#gmail').removeClass("gmailBright");
     }, 300)
    $('#gmail').addClass("gmailBright");
  });
}

// 円グラフ定義
// 引数（classのpieChartの後の数字, サイズ(ピクセル), 色, 文字色、真ん中の色）
function pieChart(whichPieChart, size, color, fontColor, backColor, move) {
  let percent = $("#pieChart" + whichPieChart).text();
  let percent360 = percent * 3.6;
  let harfSize = size / 2;
  let size70per = size * 0.7;
  let fontSize = size * 0.2;
  let processed = false;
  $("#pieChart" + whichPieChart).css({
    "width": size + "px",
    "height": size + "px"
  });
  if (whichPieChart != 99) {
    $("#pieChart" + whichPieChart).css({"position": "relative"});
  }
  $("#pieChart" + whichPieChart).html("<div class='a" + whichPieChart + "'></div><div class='b" + whichPieChart + "'></div><div class='c" + whichPieChart + "'></div><div class='d" + whichPieChart + "'></div><div class='e" + whichPieChart + "'></div><div class='f" + whichPieChart + "'></div><div class='g" + whichPieChart + "'></div>")
  $(".a" + whichPieChart + ", .b" + whichPieChart + ", .c" + whichPieChart + ", .d" + whichPieChart + ", .e" + whichPieChart + ", .f" + whichPieChart + ", .g" + whichPieChart).css({
    "width": size + "px",
    "height": size + "px",
    "position": "absolute",
    "top": "0",
    "left": "0",
    "border-radius": "50%"
  });
  $(".a" + whichPieChart + ", .b" + whichPieChart + ", .c" + whichPieChart + ", .f" + whichPieChart).css({
    "border-right": harfSize + "px solid transparent",
    "border-bottom": harfSize + "px solid transparent",
    "border-left": harfSize + "px solid transparent"
  });
  $(".a" + whichPieChart).css({
    "z-index": "10",
    "border-right": harfSize + "px solid " + color,
    "transform": "rotate(-135deg)",
  });
  $(".b" + whichPieChart).css({
    "z-index": "20",
    "border-left": harfSize + "px solid white",
  });
  $(".c" + whichPieChart).css({
    "display": "none",
    "z-index": "30",
    "border-bottom": harfSize + "px solid " + color,
    "transform": "rotate(-90deg)",
  });
  $(".d" + whichPieChart).css({
    "width": size70per + "px",
    "height": size70per + "px",
    "z-index": "40",
    "background-color": backColor,
    "transform": "translateX(-50%) translateY(-50%)",
    "top": "50%",
    "left": "50%",
    "color": fontColor,
    "text-align": "center",
    "line-height": size70per + "px",
    "font-size": fontSize + "px",
    "font-weight": "bold"
  });
  $(".e" + whichPieChart).css({
    "z-index": "5",
    "background-color": color,
    "opacity": "0.4",
  });
  $(".f" + whichPieChart).css({
    "z-index": "25",
    "border-left": harfSize + "px solid " + color,
    "opacity": "0.4",
  });
  $(".g" + whichPieChart).css({
    "background-color": "white",
  });
  let percentNow;
  if (move == 1) {
    percentNow = 0;
  } else {
    percentNow = percent;
    $(".a" + whichPieChart).css( "transform", "rotate(0deg)" );
  }
  $(".d" + whichPieChart).text(percentNow + "%");
  if (move == 1){
    $("#li6").scroll(function () {
      let aaa = $(this).outerHeight();
      // thisHeight = $("#pieChart" + whichPieChart).position().top + size;
      let thisHeight = $("#pieChart" + whichPieChart).position().top + (size / 3);
      if (thisHeight < -140) {
        $(".skillOpening").fadeOut();
      }
      if (aaa > thisHeight && !processed) {
        // setTimeout(function () {
        processed = true;
        if (percent360 <= 135) {
          let deg1 = -135 + percent360;
          let time1 = 750 / 135 * percent360;
          $(".a" + whichPieChart).animate2({ transform: "rotate(" + deg1 + "deg)" }, time1, "linear");
        } else {
          $(".a" + whichPieChart).animate2({ transform: "rotate(0deg)" }, 750, "linear");
          setTimeout(function () {
            $(".b" + whichPieChart + ", .f" + whichPieChart).css({ "display": "none" });
            $(".c" + whichPieChart).css({ "display": "block" });
            if (percent360 <= 225) {
              let deg2 = -225 + percent360;
              let time2 = 500 / 90 * (percent360 - 135);
              $(".c" + whichPieChart).animate2({ transform: "rotate(" + deg2 + "deg)" }, time2, "linear");
            } else {
              $(".c" + whichPieChart).animate2({ transform: "rotate(0deg)" }, 500, "linear");
              setTimeout(function () {
                $(".b" + whichPieChart).css({ "transform": "rotate(-135deg)", "border-left-color": color, "display": "block" });
                let deg3 = -360 + percent360;
                let time3 = 750 / 135 * (percent360 - 225);
                $(".b" + whichPieChart).animate2({ transform: "rotate(" + deg3 + "deg)" }, time3, "linear");
              }, 500);
            }
          }, 750);
        }
        let upPercent = setInterval(function () {
          if (percentNow > percent) {
            clearInterval(upPercent);
            return;
          }
          $(".d" + whichPieChart).text(percentNow + "%");
          percentNow++;
        }, 20);
      }
    })
  }
}

$(function () {
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                // HTML、CSS準備
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // ##########オープニング################################################

  // 先導の白(upper)、追いかけのカラフル(under)のHTML入れ込み、スムーズ落下の場所指定
  let $matrix = $("#matrix")
  // 必須の9本
  for (let i = 1, j = 357; i <= 9; i++, j = j + 34){
    $matrix.append('<div class="column" id="upperColumn' + i + '"></div>');
    $matrix.append('<div class="column" id="underColumn' + i + '"></div>');
    $("#upperColumn" + i).css({ left: j + "px" });
    $("#underColumn" + i).css({ left: j + "px" });
    for (let k = 1; k <= 24; k++) {
      // floorメソッドは切り捨てなので、0 <= Math.random() * 7 < 7。1 <= Math.random() * 7 + 1 < 8。Math.floor(Math.random() * 7 + 1)は、1,2,3,4,5,6,7。1から7個分と読める。
      let random = Math.floor(Math.random() * 7 + 1)
      $("#upperColumn" + i).append('<div class="upCell upChg' + random +'" id="upCell' + i + '-' + k + '">0</div>');
      $("#underColumn" + i).append('<div class="udCell udChg' + random +'" id="udCell' + i + '-' + k + '">0</div>');
    }
  }
  // 必須の9本の他
  // 13,14,15のどれか
  let fallLength = Math.floor(Math.random() * 3 + 13);
  for (let i = 10; i <= fallLength; i++){
    $matrix.append('<div class="column" id="upperColumn' + i + '"></div>');
    $matrix.append('<div class="column" id="underColumn' + i + '"></div>');
    // 9本と重なるのを避けてleftを決める
    let random1 = Math.floor(Math.random() * 983);
    if ((random1 - 357)%34 == 0) {
      random1 += 17;      
    }
    $("#upperColumn" + i).css({ left: random1 + "px" });
    $("#underColumn" + i).css({ left: random1 + "px" });
    for (let j = 1; j <= 24; j++) {
      let random2 = Math.floor(Math.random() * 7 + 1)
      $("#upperColumn" + i).append('<div class="upCell upChg' + random2 +'" id="upCell' + i + '-' + j + '">0</div>');
      $("#underColumn" + i).append('<div class="udCell udChg' + random2 +'" id="udCell' + i + '-' + j + '">0</div>');  
    }
  }
  // 薄色のHTML入れ込み
  let fallStaggerLength = Math.floor(Math.random() * 4 + 12);
  for (let i = 1; i <= fallStaggerLength; i++){
    $matrix.append('<div class="column" id="staggerColumn' + i + '"></div>');
    let columnTop = Math.floor(Math.random() * 480 + 10)
    // upper、underは必ずmatrixの一番上からであるがstaggerはここでカラムの縦位置を設定
    $("#staggerColumn" + i).css({ top: columnTop + "px" });
    let columnLeft = Math.floor(Math.random() * 994 + 3)
    $("#staggerColumn" + i).css({ left: columnLeft + "px" });
    for (let j = 1; j <= 24; j++) {
      $("#staggerColumn" + i).append('<div class="staggerCell udChg'+Math.floor(Math.random() * 7 + 1)+'" id="staggerCell'+i+'-'+j+'">0</div>');
    }
  }

  // ##########メイン###########################################################

  let oneColumnLetterNumber = 0;
  for (let i = 1; i <= 16; i++){
    $("#background").append('<div class="columnMain" id="upperColumnMain' + i + '"></div>');
    $("#background").append('<div class="columnMain" id="underColumnMain' + i + '"></div>');
    // 上で0.55をつかっているのでちょっと多めに60%
    let columnMainNumber = Math.floor(Math.random() * 60);
    $("#upperColumnMain" + i).css({ right: columnMainNumber + "%" });
    $("#underColumnMain" + i).css({ right: columnMainNumber + "%" });
    // 切り捨てられた分と一つ外までということで+2。フルHDのサイズに合わせて最低29文字
    oneColumnLetterNumber = $(window).outerHeight() / 35 + 2;
    if (oneColumnLetterNumber < 29) {
      oneColumnLetterNumber = 29;
    }
    for (let j = 1; j <= oneColumnLetterNumber; j++) {
      $("#upperColumnMain" + i).append('<div class="upCellMain  upChgMain' + Math.floor(Math.random() * 5 + 1) + '" id="upCellMain' + i + '-' + j + '">0</div>');
      $("#underColumnMain" + i).append('<div class="udCellMain  udChgMain' + Math.floor(Math.random() * 5 + 1) + '" id="udCellMain' + i + '-' + j + '">0</div>');
    }
  }
  for (let i = 1; i <= 7; i++){
    $("#li"+ i).append('<div id="arrow'+i+'" class="arrow"><div class="scroll">scroll</div><div class="arrowUpper"></div><div class="arrowDowner"></div></div>');
  }
  $(".skillImageFrame").outerHeight($(".skillImageFrame").outerWidth());

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                // 動き・イベント
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // ##########オープニング################################################

  // 文字と文字の色入れ替え
  lettersChange();
  // 残す文字と重なる部分、実行
  for (let i = 1; i <= 9; i++) {
    let timing = Math.floor(Math.random() * 3300 + 500);
    let cellNumber = Math.floor(Math.random() * 5 + 5);
    let length = Math.floor(Math.random() * 11 + 14-(cellNumber-1));
    fall(timing, i, cellNumber, length);
  }
  // その他実行
  for (let i = 10; i <= fallLength; i++){
    let timing = Math.floor(Math.random() * 3300 + 300);
    let cellNumber = Math.floor(Math.random() * 18 + 1);
    let length = Math.floor(Math.random() * 14 + 4);
    // 長いのをちょっと減らす
    if (length > 8 && length % 2 == 0) {
      length-= 3
    }
    fall(timing, i, cellNumber, length);
  }
  // stagger実行
  for (let i = 1; i <= fallStaggerLength; i++){
    let timing = Math.floor(Math.random() * 1900 + 700);
    let columnNumber = i;
    let length = Math.floor(Math.random() * 16 + 4);
    fallStagger(timing, columnNumber, length);
  }
  // 数段階で文字を消す
  for (let i = 300, j = 2300; i <= 500; i += 20, j += 280){
    putOutLetters(i, j);
  }
  setTimeout(function () {
    // usedを一通り全部
    for (let i = 0; i < used.length; i++) {
      underChange(i);
    }
    // usedStを一通り全部
    for (let i = 0; i < usedSt.length; i++){
      for (let j = 0; j < 24; j++) {
        $("#staggerCell" + usedSt[i] + "-" + j).animate({ opacity: "0" }, 2100);
      }
    }
  }, 5900);

  // ##########メイン###########################################################
  
  setTimeout(function () {
    // 文字拡大してオープニング終了
    $matrix.animate2({ transform: "scale(532, 532)" }, 2800);
    setTimeout(function () {
      let $main = $("#main")
      // 回転を見せるためにちょっと前から準備
      $main.css( "transform", "rotate(-100deg)");
      $matrix.remove();
      $("#background").fadeIn(6000);
      $main.stop().animate2({ transform: "rotate(0deg)" }, 3500);
      // mainを正方形にする
      $main.outerWidth($main.outerHeight());
      $main.css({ right: $(window).outerWidth() * 0.62 });
      // 一回目の流れ星
      setTimeout(function () {
        fallMain(oneColumnLetterNumber);
      }, 3000)
      // 2回目以降の流れ星。20秒に一回5秒の前後あり
      let waitMainFall;
      setInterval(function () {
        waitMainFall = Math.floor(Math.random() * 5000);
        setTimeout(function () {
          fallMain(oneColumnLetterNumber);
        },waitMainFall)
      }, 20000);
      // 40秒遅れて上と同じテンポで消してゆく
      setTimeout(function () {
        let whichColumn;
        setInterval(function () {
          whichColumn = Math.floor(Math.random() * (usedMain.length))
          putOutLettersMain(whichColumn);
        }, 20000)
      }, 40000)
      lettersChangeMain()
      let deg = 0;
      let nowList = 1;
      let oneDeg = 51.43;
      listHoverAndArrow($main, deg,nowList,oneDeg)
      gmailEvents()
      $(".skillImageFrame").outerHeight($(".skillImageFrame").outerWidth());
      let skillOpeningPiechartWidth = $(".skillOpening").outerWidth()*0.3;
      let skillImageWrapperWidth = $(".skillImageWrapper").outerWidth();
      // 引数（classのpieChartの後の数字, サイズ(ピクセル), 色, 文字色、真ん中の色, 動く(1)）
      pieChart(99, skillOpeningPiechartWidth, "rgb(50, 50, 50)", "lightgrey", "grey", 0)
      pieChart(1, skillImageWrapperWidth, "rgb(235, 78, 32)", "rgb(235, 78, 32)", "rgb(50, 50, 50)", 1)
      pieChart(2, skillImageWrapperWidth, "rgb(245, 218, 25)", "rgb(245, 218, 25)", "rgb(50, 50, 50)", 1)
      pieChart(3, skillImageWrapperWidth, "rgb(106, 0, 1)", "rgb(187, 150, 151)", "rgb(50, 50, 50)", 1)
      pieChart(4, skillImageWrapperWidth, "rgb(189, 0, 4)", "rgb(185, 110, 111)", "rgb(50, 50, 50)", 1)
      pieChart(5, skillImageWrapperWidth, "rgb(107, 171, 224)", "rgb(107, 171, 224)", "rgb(50, 50, 50)", 1)
      pieChart(6, skillImageWrapperWidth, "rgb(252, 177, 18)", "rgb(253, 219, 146)", "rgb(50, 50, 50)", 1)
      pieChart(7, skillImageWrapperWidth, "rgb(25, 97, 163)", "rgb(152, 170, 192)", "rgb(50, 50, 50)", 1)
      $(window).resize(function () {
        $main.outerWidth($main.outerHeight());
        $main.css({ right: $(window).outerWidth() * 0.62 });
        $(".skillImageFrame").outerHeight($(".skillImageFrame").outerWidth());
      })
    // }, 0)
    }, 800)

  }, 9000)  
  // }, 0)

})