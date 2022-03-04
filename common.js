function($) {
    "use strict";
    var transitionEnd = function() {
            var el = document.createElement("fcvndev");

            var transitionEndEventNames = {
                transition: "transitionend",
                OTransition: "oTransitionEnd",
                MozTransition: "transitionend",
                WebkitTransition: "webkitTransitionEnd"
            };

            for (var name in transitionEndEventNames) {
                if (el.style[name] !== undefined) {
                    return {
                        end: transitionEndEventNames[name]
                    };
                }
            }

            return false;
        },
        animationEnd = function() {
            var el = document.createElement("fcvndev");

            var animationEndEventNames = {
                animation: "animationend",
                OAnimation: "oAnimationEnd",
                MozAnimation: "animationend",
                WebkitAnimation: "webkitAnimationEnd"
            };

            for (var name in animationEndEventNames) {
                if (el.style[name] !== undefined) {
                    return {
                        end: animationEndEventNames[name]
                    };
                }
            }

            return false;
        };

    $(function() {
        $.support.transition = transitionEnd();

        $.support.animation = animationEnd();
    });
}(jQuery);

$(document).ready(function() {
    /* fix smoothscroll on IE - jumpy fixed background */
    if (navigator.userAgent.match(/MSIE 10/i) || navigator.userAgent.match(/Trident\/7\./) || navigator.userAgent.match(/Edge\/12\./)) {
        $("body.ie-smoothscroll")
            .on("mousewheel", function(e) {
                if (event.preventDefault) event.preventDefault();
                else event.returnValue = false;

                var delta = null,
                    offsetX = window.scrollX || window.pageXOffset || window.document.documentElement.scrollLeft,
                    offsetY = window.scrollY || window.pageYOffset || window.document.documentElement.scrollTop;

                if (e.wheelDelta) delta = e.wheelDelta;
                else if (e.originalEvent) {
                    if (e.originalEvent.wheelDelta) delta = e.originalEvent.wheelDelta;
                    else if (e.originalEvent.deltaY) delta = 0 - e.originalEvent.deltaY;
                    else if (e.originalEvent.detail) delta = e.originalEvent.detail * -40;
                } else if (event.originalEvent) {
                    if (event.originalEvent.wheelDelta) delta = event.originalEvent.wheelDelta;
                    else if (event.originalEvent.deltaY) delta = 0 - event.originalEvent.deltaY;
                    else if (event.originalEvent.detail) delta = event.originalEvent.detail * -40;
                }

                if (delta !== null) window.scrollTo(0, offsetY - delta);
            });
    }
});