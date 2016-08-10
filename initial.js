(function ($) {
  $.fn.initial = function (options) {
    return this.each(function () {
      var e = $(this);
      var settings = $.extend({
        // Default settings
        name: 'DaMaVaNd',
        seed: 0,
        charCount: 1,
        wordCount: 2,
        background: {
          saturation: 0.4, // 0: White
          brightness: 0.99 // 0: Black
        },
        foreground: {
          saturation: 0.8, // 0: White
          brightness: 0.6 // 0: Black
        },
        height: 100,
        width: 100,
        fontSize: 60,
        fontWeight: 400,
        fontFamily: 'HelveticaNeue-Light,Helvetica Neue Light,Helvetica Neue,Helvetica, Arial,Lucida Grande, sans-serif',
        radius: 0,
        src: null
      }, options);

      // overriding from data attributes
      settings = $.extend(settings, e.data());

      // It has image url
      if (settings.src) {
        e.css({
          'width': settings.width + 'px',
          'height': settings.height + 'px',
          'border-radius': settings.radius + 'px',
          '-moz-border-radius': settings.radius + 'px'
        }).attr("src", settings.src);

        return;
      }

      settings.seed = settings.seed > -1 ? settings.seed : 0;

      // var sigma = unique(settings.name) * (settings.seed + 1) * 2 * Math.PI;
      var sigma = unique(settings.name);
      var hue = (360 + (distribute(sigma * 2 * Math.PI, settings.name.length) * 360) - 140) % 360;
      // var hue = sigma * 360;
      // console.log('Hue for ', settings.name, hue);

      var bgColor = {
        hue: hue,
        saturation: settings.background.saturation,
        brightness: settings.background.brightness
      };
      settings.bgColor = '#' + hsv2rgb(bgColor.hue, bgColor.saturation, bgColor.brightness);

      var fgColor = {
        hue: hue,
        saturation: settings.foreground.saturation, // 0: White
        brightness: settings.foreground.brightness // 0: Black
      };
      settings.fgColor = '#' + hsv2rgb(fgColor.hue, fgColor.saturation, fgColor.brightness);

      // making the text object
      var c = settings.name.split(" ", settings.wordCount).map(function (str) {
        return str.substr(0, settings.charCount).toUpperCase();
      }).join("");
      var cobj = $('<text text-anchor="middle"></text>').attr({
        'y': '50%',
        'x': '50%',
        'dy': '0.35em',
        'pointer-events': 'auto',
        'fill': settings.fgColor,
        'font-family': settings.fontFamily
      }).html(c).css({
        'font-weight': settings.fontWeight,
        'font-size': settings.fontSize + 'px'
      });

      var svg = $('<svg></svg>').attr({
        'xmlns': 'http://www.w3.org/2000/svg',
        'pointer-events': 'none',
        'width': settings.width,
        'height': settings.height
      }).css({
        'background-color': settings.bgColor,
        'width': settings.width + 'px',
        'height': settings.height + 'px',
        'border-radius': settings.radius + 'px',
        '-moz-border-radius': settings.radius + 'px'
      });

      svg.append(cobj);
      // svg.append(group);
      var svgHtml = window.btoa(unescape(encodeURIComponent($('<div>').append(svg.clone()).html())));

      e.attr("src", 'data:image/svg+xml;base64,' + svgHtml);
    });

    function unique(name) {
      var weights = name.split('').map(function (v) {
        var char = v.toUpperCase().charCodeAt(0);

        switch (true) {
          // Numbers
          case char > 47 && char < 58:
            char -= 22;
            break;

          // Uppercase Alphabets
          case char > 64 && char < 91:
            char -= 64;
            break;

          // Lowercase Alphabets
          case char > 96 && char < 123:
            char -= 96;
            break;

          // Ignore all other characters
          default:
            char = 0;
            break;
        }

        return char;
      });

      var accumulated = weights.reduce(function (acu, v, k, arr) {
        if (k == 1) {
          acu = acu / arr.length;
        }

        return acu + (v / arr.length);
      });

      // console.log('Unique result for ', name, ' Weights: ', weights.map(function (v, i) { return name[i] + ': ' + v; }), ' ACCU: ', accumodate, ' Maped: ', accumodate % 36);

      return (accumulated % 36) / 36;
    }

    function normalize(num) {
      var border = 1;
      var step = 2;

      if (num < border) {
        while (num < border) {
          num *= step;
        }
        num /= step;
      } else {
        while (num > border) {
          num /= step;
        }
      }

      return num;
    }

    function distribute(x, len) {
      return (Math.sin(x * 0.7) * Math.cos(x * 0.7)) + 0.5;
    }

    function hsv2rgb(hue, saturation, brightness) {
      var chroma = brightness * saturation;
      var faceColor = {red: 0, green: 0, blue: 0};
      var hp = hue / 60;
      var x = chroma * (1 - Math.abs((hp % 2) - 1));
      switch (Math.floor(hp)) {
        case 0:
          faceColor.red = chroma;
          faceColor.green = x;
          break;

        case 1:
          faceColor.red = x;
          faceColor.green = chroma;
          break;

        case 2:
          faceColor.green = chroma;
          faceColor.blue = x;
          break;

        case 3:
          faceColor.green = x;
          faceColor.blue = chroma;
          break;

        case 4:
          faceColor.red = x;
          faceColor.green = chroma;
          break;

        case 5:
        case 6:
          faceColor.red = chroma;
          faceColor.green = x;
          break;
      }

      var m = brightness - chroma;
      var color = {
        red: Math.floor((faceColor.red + m) * 256),
        green: Math.floor((faceColor.green + m) * 256),
        blue: Math.floor((faceColor.blue + m) * 256)
      };

      var hex = {
        red: (color.red < 16 ? '0' : '') + Number(color.red).toString(16),
        green: (color.green < 16 ? '0' : '') + Number(color.green).toString(16),
        blue: (color.blue < 16 ? '0' : '') + Number(color.blue).toString(16)
      };

      return hex.red + hex.green + hex.blue;
    }
  };
}(jQuery));
