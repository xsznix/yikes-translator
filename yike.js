'use strict';

// yikes

function updateYikes(val) {
  document.getElementById('yikes').value = encodeYikes(val);
}

function updateText(val) {
  document.getElementById('text').value = decodeYikes(val);
}

function encodeYikes(str) {
  var bytes = toUTF8Array(str);
  var out = '';
  var offset = 0;
  var encodedByte;
  for (var i = 0; i < bytes.length; i++) {
    if (i > 0)
      out += ' ';
    encodedByte = (bytes[i] + offset) % 0x100;
    out += YIKE_MAP[encodedByte];
    offset += encodedByte;
  }

  return out;
}

function decodeYikes(str) {
  var bytes = [];
  var token;
  var i = 0;
  var j;
  var offset = 0;

  while (i < str.length) {
    token = str.substr(i, 7);
    for (j = 255; j >= 0; j--) {
      if (token.indexOf(YIKE_MAP[j]) === 0) {
        break;
      }
    }

    if (j === -1) {
      i++;
      continue;
    }

    bytes.push((j - offset + 0x100) % 0x100);
    offset = (offset + j) % 0x100;
    i += YIKE_MAP[j].length;
  }

  return fromUTF8Array(bytes);
}

function toUTF8Array(str) {
    var utf8 = [];
    for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6), 
                      0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                      | (str.charCodeAt(i) & 0x3ff))
            utf8.push(0xf0 | (charcode >>18), 
                      0x80 | ((charcode>>12) & 0x3f), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
}

function fromUTF8Array(data) { // array of bytes
    var str = '',
        i;

    for (i = 0; i < data.length; i++) {
        var value = data[i];

        if (value < 0x80) {
            str += String.fromCharCode(value);
        } else if (value > 0xBF && value < 0xE0) {
            str += String.fromCharCode((value & 0x1F) << 6 | data[i + 1] & 0x3F);
            i += 1;
        } else if (value > 0xDF && value < 0xF0) {
            str += String.fromCharCode((value & 0x0F) << 12 | (data[i + 1] & 0x3F) << 6 | data[i + 2] & 0x3F);
            i += 2;
        } else {
            // surrogate pair
            var charCode = ((value & 0x07) << 18 | (data[i + 1] & 0x3F) << 12 | (data[i + 2] & 0x3F) << 6 | data[i + 3] & 0x3F) - 0x010000;

            str += String.fromCharCode(charCode >> 10 | 0xD800, charCode & 0x03FF | 0xDC00); 
            i += 3;
        }
    }

    return str;
}
