
var IconFactory = (function () {
    var produced = [], $lined = [], lined = [], _lined = {}, api="", defaults={fill:"white",stroke: "none", transform: ""};
    function IconFactory(_api,_defaults) {
        api = _api;
        $.extend(defaults,_defaults)
    }
    IconFactory.prototype.produce = function ($target) {
        var arr = '';
        $target.find('i:not(.produced)').each(function () {
            var $icon = $(this);
            var tags = this.className.split(" ");
            //tag[0] is the svg
            if (lib.hasOwnProperty(tags[0]))
                Produce($icon);
            else {
                if (_lined[tags[0]] != true) {
                    _lined[tags[0]] = true;
                    lined.push(tags[0]);
                }
                $lined.push($icon);
            }
            $icon.addClass("produced")
        })
        if (lined.length > 0) {
            $.get(api+"?Get=" + lined.join(","), function (d) {
                //extend local svg library
                for (var i in d) lib[i] = d[i];
                //produce the icons on the line
                for (var i = $lined.length - 1; i >= 0; i--) {
                    if (d.hasOwnProperty($lined[i].get(0).className.split(" ")[0])) Produce($lined[i])
                    $lined.pop();
                    lined.pop()
                }
            })
        }
    }

    function Produce($icon) {
        var tagarr = $icon.get(0).className.split(" ");
        var icon = tagarr[0]; tagarr.slice(0, 1);
        var tags = {}; for (var i in tagarr) tags[tagarr[i]] = true;
        if ($icon.data('attrs') == undefined) $icon.data('attrs', {});
        var w = $icon.width(), h = $icon.height();

        var attrs = $.extend(defaults, $icon.data('attrs'));
        if ($icon.data('color-class') != undefined) {
            var vals = $icon.data('color-class').split(":");
            if ($icon.parent().hasClass(vals[0])) {
                attrs.fill = vals[1];
            }
        }

        var canvas = Raphael($icon.get(0), w, h);
        var icon = canvas.path(lib[tagarr[0]]);
        var box = null;

        if (tags.circled) {
            var strokeWidth = 3; if ($icon.data('strokewidth') != undefined) strokeWidth = $icon.data('strokewidth');

            var fill = hexToRgb(attrs.fill);
            var circle = canvas.circle(w / 2, h / 2, w / 2 - strokeWidth)
                .attr({ stroke: attrs.fill, "stroke-width": strokeWidth, fill: "rgba(" + fill.r + "," + fill.g + "," + fill.b + ",0)" });

            if ($icon.parent().get(0).tagName == "A") {
                $icon.parent().hover(function () {
                    circle.attr({ fill: "rgba(" + fill.r + "," + fill.g + "," + fill.b + ",0.15)" })
                }, function () {
                    circle.attr({ fill: "rgba(" + fill.r + "," + fill.g + "," + fill.b + ",0)" })
                })
            }
        }
        if (tags.fit) {
            box = icon.getBBox();
            var iw = box.width + 1,
                ih = box.height + 1;

            var s = w / iw;
            if (ih * s > h) {
                s = h / ih;
            }

            if (attrs.transform == "") attrs.transform = "s" + s;
            else {
                var tsf = svgKit.parseTsf(attrs.transform);
                attrs.transform = "s" + s + "r" + tsf.r + "t" + tsf.t;
            }
        }
        if (!tags.nocenter) {
            if (box == null) box = icon.getBBox();
            svgKit.position(icon, w / 2 - box.width / 2, h / 2 - box.height / 2);
        }

        icon.attr(attrs);
        $icon.data('svg', icon);
    }
    var lib = {};

    var svgKit = {
        position: function ($path, x, y) {
            var path = Raphael.pathToRelative($path.attrs.path),
                    dx = (path[0][1]) + x,
                    dy = (path[0][2]) + y;

            path[0][1] = dx;
            path[0][2] = dy;
            $path.attr({ path: path });
        },
        parseTsf: function (tsf) {
            var scale = 1;
            var ret = { s: 1, r: 0, t: "0,0" };
            if (tsf.length > 0) {
                for (var i in ret) {
                    var p = tsf.indexOf(i);
                    if (p != -1) {
                        p++;
                        while (String(Number(tsf.charAt(p))) != "NaN" || tsf.charAt(p) == "." || tsf.charAt(p) == ",") {
                            p++;
                            if (p == tsf.length) break;
                        }
                        ret[i] = tsf.substring(tsf.indexOf(i) + 1, p);
                    }
                }

            }
            return ret;
        }
    }

    return IconFactory;
})();