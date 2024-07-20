"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Segment = void 0;
var Segment;
(function (Segment) {
    Segment.segment = {
        /** @deprecated 文本，建议直接使用字符串 */
        Text(text) {
            return {
                type: "text",
                data: {
                    text,
                },
            };
        },
        Face(id) {
            return {
                type: "face",
                data: {
                    id,
                },
            };
        },
        /** 猜拳(id=1~3) */
        Rps() {
            return {
                type: "rps",
                data: {},
            };
        },
        /** 骰子(id=1~6) */
        Dice() {
            return {
                type: "dice",
                data: {},
            };
        },
        /** mention@提及
         * @param qq 全体成员为 all
         */
        At(qq, text, dummy) {
            return {
                type: "at",
                data: {
                    qq,
                    text,
                    dummy,
                },
            };
        },
        /** 图片(支持http://,base64://) */
        Image(file, cache, proxy, timeout) {
            return {
                type: "image",
                data: {
                    file,
                    cache: cache != undefined ? (cache ? 1 : 0) : undefined,
                    proxy: proxy != undefined ? (proxy ? 1 : 0) : undefined,
                    timeout,
                },
            };
        },
        /** 闪照(支持http://,base64://) */
        Flash(file, cache, proxy, timeout) {
            return {
                type: "image",
                data: {
                    type: "flash",
                    file,
                    cache: cache != undefined ? (cache ? 1 : 0) : undefined,
                    proxy: proxy != undefined ? (proxy ? 1 : 0) : undefined,
                    timeout,
                },
            };
        },
        /** 语音(支持http://,base64://) */
        Record(file) {
            return {
                type: "record",
                data: {
                    file: file.toString(),
                },
            };
        },
        /** 视频(仅支持本地文件) */
        Video(file) {
            return {
                type: "video",
                data: {
                    file,
                },
            };
        },
        Json(data) {
            return {
                type: "json",
                data: { data: JSON.stringify(data) },
            };
        },
        Xml(data, id) {
            return {
                type: "xml",
                data: {
                    data,
                    id,
                },
            };
        },
        /** 链接分享 */
        Share(url, title, image, content) {
            return {
                type: "share",
                data: {
                    url,
                    title,
                    image,
                    content,
                },
            };
        },
        /** 位置分享 */
        Location(lat, lng, address, id) {
            return {
                type: "location",
                data: {
                    lat: String(lat),
                    lon: String(lng),
                    address,
                    id,
                },
            };
        },
        /** id 0~6 */
        Poke(id, type) {
            return {
                type: "poke",
                data: {
                    id,
                    type,
                },
            };
        },
        /** @deprecated 将CQ码转换为消息链 */
        FromCqcode(strData) {
            const resultElements = [];
            const matchedTokens = strData.matchAll(/\[CQ:[^\]]+\]/g);
            let prevIdx = 0;
            for (let token of matchedTokens) {
                const text = strData.slice(prevIdx, token.index).replace(/&#91;|&#93;|&amp;/g, UnescapeCQ);
                if (text) {
                    resultElements.push({ type: "text", data: { text } });
                }
                const element = token[0];
                let cq = element.replace("[CQ:", "type=");
                cq = cq.substr(0, cq.length - 1);
                resultElements.push(Qs(cq));
                prevIdx = token.index + element.length;
            }
            if (prevIdx < strData.length) {
                const text = strData.slice(prevIdx).replace(/&#91;|&#93;|&amp;/g, UnescapeCQ);
                if (text) {
                    resultElements.push({ type: "text", data: { text } });
                }
            }
            return resultElements;
        },
    };
    function UnescapeCQ(s) {
        if (s === "&#91;")
            return "[";
        if (s === "&#93;")
            return "]";
        if (s === "&amp;")
            return "&";
        return "";
    }
    Segment.UnescapeCQ = UnescapeCQ;
    function UnescapeCQInside(s) {
        if (s === "&#44;")
            return ",";
        if (s === "&#91;")
            return "[";
        if (s === "&#93;")
            return "]";
        if (s === "&amp;")
            return "&";
        return "";
    }
    Segment.UnescapeCQInside = UnescapeCQInside;
    function Qs(s, sep = ",", equal = "=") {
        const ret = {};
        const split = s.split(sep);
        for (let v of split) {
            const i = v.indexOf(equal);
            if (i === -1)
                continue;
            ret[v.substring(0, i)] = v.substr(i + 1).replace(/&#44;|&#91;|&#93;|&amp;/g, UnescapeCQInside);
        }
        for (let k in ret) {
            try {
                if (k !== "text")
                    ret[k] = JSON.parse(ret[k]);
            }
            catch { }
        }
        return ret;
    }
    Segment.Qs = Qs;
})(Segment || (exports.Segment = Segment = {}));
