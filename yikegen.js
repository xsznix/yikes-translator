'use strict';

function genYikeMap() {
  var map = [];
  for (var i = 0; i < 256; i++) {
    var b7 = i & 0x80;
    var b6 = i & 0x40;
    var b5 = i & 0x20;
    var b4 = i & 0x10;
    var b3 = i & 0x08;
    var b2 = i & 0x04;
    var b1 = i & 0x02;
    var b0 = i & 0x01;

    var word;
    if (b0)
      word = 'sekiy';
    else
      word = 'yikes';

    if (b1)
      word = upperAt(word, 0);

    if (b2)
      word = upperAt(word, 4);

    if (b3)
      word = upperAt(word, 1);

    if (b4)
      word = upperAt(word, 3);

    if (b5)
      word = upperAt(word, 2);

    switch (b6 | b7) {
      case 0x00:
      break;

      case 0x40:
      word += '.';
      break;

      case 0xc0:
      word += '!';

      case 0x80:
      word += '!';
    }

    map.push(word);
  }
  return map;
}


function upperAt(str, i) {
  return str.substring(0, i) + str.substring(i, i + 1).toUpperCase() + str.substring(i + 1);
}
