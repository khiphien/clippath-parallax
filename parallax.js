/**
 * Created by Madila on 15/08/2016.
 */

window.appbrowser = {};

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
            || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var hasPrefix = function () {
    var styles = window.getComputedStyle(document.documentElement, ''),
        pre = (Array.prototype.slice
                .call(styles)
                .join('')
                .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
        )[1],
        dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
    return {
        dom: dom,
        lowercase: pre,
        css: '-' + pre + '-',
        js: pre[0].toUpperCase() + pre.substr(1)
    };
};

/**
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */
var detectIE = function() {
    var ua = window.navigator.userAgent;

    // Test values; Uncomment to check result …

    // IE 10
    // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

    // IE 11
    // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

    // Edge 12 (Spartan)
    // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

    // Edge 13
    // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
};

var version = detectIE();

if (version === false) {
    window.appbrowser.name = false;
    window.appbrowser.version = false;
} else if (version >= 12) {
    window.appbrowser.name = 'Edge';
    window.appbrowser.version = version;
} else {
    window.appbrowser.name = 'IE';
    window.appbrowser.version = version;
}

window.appbrowser.prefix = hasPrefix();

function ieScroll() {
    if(window.appbrowser.name && window.appbrowser.version) {
        if (window.addEventListener) window.addEventListener('DOMMouseScroll', wheel, false);
        window.onmousewheel = document.onmousewheel = wheel;

        $(document).keydown(function (e) {

            switch (e.which) {
                //up
                case 38:
                    e.preventDefault();
                    $('html, body').stop().animate({
                        scrollTop: $(window).scrollTop() - distance
                    }, time);
                    break;

                //down
                case 40:
                    e.preventDefault();
                    $('html, body').stop().animate({
                        scrollTop: $(window).scrollTop() + distance
                    }, time);
                    break;
            }
        });
    }
}
function parallax($ele, $threshold, scrollTop, viewportRevealed, callback) {
    var _thresholdHeight = $threshold.height(),
        _offsetTop = $threshold.offset().top;

    if(viewportRevealed > _offsetTop && scrollTop < (_offsetTop + _thresholdHeight)) {
        var _elementScrolled = scrollTop - ($threshold.offset().top),
        _ratio = (_elementScrolled/_thresholdHeight);

        window.requestAnimationFrame(function() {
            callback($ele, _ratio);
        });
    }
}
