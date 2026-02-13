/* /websquare_git/websquare/_websquare_/blank.xml 20210416.093304 501 7906ceb82458e1cb2f6c69438426da16ad9fd8602acfaa7377243795a026322f */
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
                    }
                }]
            }]
        }, {
            T: 1,
            N: 'body'
        }]
    }]
}