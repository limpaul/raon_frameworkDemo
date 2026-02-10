/* /websquare_git/resource/websquare/blank.xml 20200923.142105 542 6fc9309c1772b893ec311d43f643f843213b733ef4a18f9839117fa0d54cf03c */
export default {
    declaration: {
        A: {
            version: '1.0',
            encoding: 'UTF-8'
        }
    },
    E: [{
        T: 1,
        N: 'html',
        A: {
            xmlns: 'http://www.w3.org/1999/xhtml',
            'xmlns:ev': 'http://www.w3.org/2001/xml-events',
            'xmlns:w2': 'http://www.inswave.com/websquare',
            'xmlns:xf': 'http://www.w3.org/2002/xforms'
        },
        E: [{
            T: 1,
            N: 'head',
            E: [{
                T: 1,
                N: 'w2:buildDate'
            }, {
                T: 1,
                N: 'xf:model'
            }, {
                T: 1,
                N: 'script',
                A: {
                    type: 'javascript',
                    lazy: 'false'
                },
                E: [{
                    T: 4,
                    cdata: function(scopeObj) {
                        var $p = scopeObj["$p"];
                        var scwin = scopeObj["scwin"];
                        var com = scopeObj["com"];
                        "use strict";
                    }
                }]
            }]
        }, {
            T: 1,
            N: 'body',
            A: {
                'ev:onpageload': 'scwin.onpageload'
            }
        }]
    }]
}