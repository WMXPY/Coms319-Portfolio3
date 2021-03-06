(function () {
    'use strict';
}());
/*
 * @author WMXPY
 * @contect wm@wmpcxpy.com
 */
declare var Vue: any;
declare var wangEditor: any;
declare function require(name: string);
var ipcRenderer = require('electron').ipcRenderer;
var pref = require('../../src/preference.js');
var main = new Vue({
    el: '#main',
    data: {
        test: '',
        debugdisplay: '',
        button: false,
        oppoid: '',
        domainid: '',
        gameperiod: '',
        stopper: [],
        data2: null,
        versionmessage: 'Getting Data From Github...',
        versioncolor: 'version-purple',
        versionicon: 'fa-cloud-download',
        vars: {
            domain: [],
            oppo: [],
            runes: [],
            Mysterys: []
        },
        tips: {
            domain: [],
            oppo: [],
            runes: [],
            Mysterys: []
        },
        edit: {
            domain: '',
            categery: '',
            period: '',
            side: '',
            counter: '',
            content: ''
        },
        oppochamp: {
            id: 1,
            name: ''
        },
        domainchamp: {
            id: 1,
            name: ''
        },
        newuser: 1,
        selchampn: '',
        mypng: '../../css/favicon.ico',
        oppopng: '../../css/favicon.ico'
    },
    computed: {
        selectedchampname: function () {
            return pref.getChampName(parseInt(this.edit.domain));
        }
    },
    methods: {
        preGet: function () {
            this.stopeverything();
            this.resetdebugdisplay();
            Prefsystem.preLoad(() => {
                //not exist
                main.newuser = 0;
                Prefsystem.resetTitle();
            }, (data) => {
                //exist
                main.newuser = 1;
                riotapi.make(data, () => {
                    // console.log('Index.ts Preget -> Maked:' + data);
                }, () => {

                })
                // console.log('Index.ts Preget ->: ' + data);
            });
            // this.newuser = 3;
        },
        resetdebugdisplay: function () {
            this.debugdisplay = '主E蕹鵺猛如虎';
        },
        backtoMain: function () {
            this.stopeverything();
            main.newuser = 1;
        },
        register: function () {
            this.stopeverything();
            ipcRenderer.on('cover-message', (event, arg) => {
                switch (arg) {
                    case 'RAS':
                        main.preGet();
                        break;
                    case 'BTM':
                        main.backtoMain();
                        break;
                }
            })
            ipcRenderer.once('version', (event, arg) => {
                switch (arg.update) {
                    case 0:
                        main.versionmessage = 'UpgradeE 无需版本更新';
                        main.versioncolor = 'version-green';
                        main.versionicon = 'fa fa-star';
                        break;
                    case 1:
                        main.versionmessage = 'UpgradeE 的 ' + arg.str + ' 版本可供下载, 了解更多: 点击"帮助"菜单 -> 下载更新';
                        main.versioncolor = 'version-yellow';
                        main.versionicon = 'fa fa-star-half-o';
                        main.debugdisplay = 'UpgradeE 可以更新了';
                        break;
                    case 2:
                        main.versionmessage = '当前版本的 UpgradeE 已经不可用, 请访问此链接下载最新版本: ' + arg.link + ' 也可以 点击"帮助"菜单 -> 下载更新';
                        main.versioncolor = 'version-red';
                        main.versionicon = 'ra ra-blade-bite';
                        main.debugdisplay = '你必须更新 UpgradeE';
                        break;
                }
            })
            ipcRenderer.send('register', 'mainpage');
        },
        editchamp: function (side) {
            //Champion C, Runes R, Mysterys Y
            //Early, Middle, Late
            this.edit.domain = (side == 0) ? this.domainchamp.id : this.oppochamp.id;
            this.edit.categery = 'C';
            this.edit.period = 'E';
            this.edit.counter = 'A';
            this.edit.side = side;
            this.edit.content = 'EditHere';
            this.newuser = 3;
            // var editor = new wangEditor('textarea1');
            // editor.create();
            // this.changeselect();
        },
        sendSummorid: function () {
            this.button = true;
            riotapi.make(this.test.replace(/\s+/g, "").toLowerCase(), () => {
                main.newuser = 1;
                main.button = false;
            }, (error) => {
                main.debugdisplay = '玩家不存在, 请检查拼写';
                main.button = false;
            });
        },
        localupdate: function (categery: string, event) {
            this.edit[categery] = event.srcElement.innerHTML;
        },
        pushedit: function (mode: number) {
            if (riotapi.ptips(this.edit.domain, this.edit.categery, this.edit.period, this.edit.side, this.edit.content, this.edit.counter)) {
                if (mode == 0) {
                    main.newuser = 2;
                } else {
                    main.newuser = 1;
                }
                if (this.edit.side == 0) {
                    this.tips.domain.push('Just Added: ' + this.edit.content);
                } else {
                    this.tips.oppo.push('Just Added: ' + this.edit.content);
                }
                this.tips.domain
            } else {
                console.log('error');
            }
        },
        updatetips: function () {
            let date = new Date();
            let gametime = (date.getTime() - this.data2.starttime) / 60000;
            let re = [];
            this.cleanTipsDisplay();
            this.stopeverything();
            if (gametime < 40) {
                let t = (40 - gametime) * 60000;
                re.push(t);
                this.stopper.push(setTimeout(() => {
                    main.doupdate(40);
                }, t))
            } else {
                main.doupdate(40);
                main.displayT('T');
                return re;
            }
            if (gametime < 30) {
                let t = (30 - gametime) * 60000;
                re.push(t);
                this.stopper.push(setTimeout(() => {
                    main.doupdate(30);
                }, t))
            } else {
                main.doupdate(30);
                main.displayT('T');
                return re;
            }
            if (gametime < 20) {
                let t = (20 - gametime) * 60000;
                re.push(t);
                this.stopper.push(setTimeout(() => {
                    main.doupdate(20);
                }, t))
            } else {
                main.doupdate(20);
                main.displayT('T');
                return re;
            }
            if (gametime < 10) {
                let t = (10 - gametime) * 60000;
                re.push(t);
                main.doupdate(0);
                this.stopper.push(setTimeout(() => {
                    main.doupdate(10);
                }, t))
            } else {
                main.doupdate(10);
                main.displayT('T');
                return re;
            }
            return re;
        },
        doupdate: function (period: number) {
            // L,E,M,A,R,T -> entire game
            switch (period) {
                case 0:
                    this.gameperiod = 'In Lane:';
                    main.displayT('L');
                    break;
                case 10:
                    this.gameperiod = 'In Early Game:';
                    main.displayT('E');
                    break;
                case 20:
                    this.gameperiod = 'In Middle Game:';
                    main.displayT('M');
                    break;
                case 30:
                    this.gameperiod = 'In Late Game:';
                    main.displayT('A');
                    break;
                case 40:
                    this.gameperiod = 'In REALLY Late Game:';
                    main.displayT('R');
                    break;
            }
            //position
            //M mid D ad T top S sup J jungle A all B buttom N error
        },
        displayT: function (time: string) {
            for (let i = 0; i < main.vars.domain[time].length; i++) {
                if (main.vars.domain[time][i].substring(0, 2) == main.data2.position || main.vars.domain[time][i].substring(0, 2) == 'AA') {
                    main.tips.domain.push(main.vars.domain[time][i].substring(2, main.vars.domain[time][i].length));
                } else if (main.vars.domain[time][i].substring(0, 2) == 'AB' && (main.data2.position == 'AS' || main.data2.position == 'AD')) {
                    main.tips.domain.push(main.vars.domain[time][i].substring(2, main.vars.domain[time][i].length));
                }
            }
            for (let i = 0; i < main.vars.oppo[time].length; i++) {
                if (main.vars.oppo[time][i].substring(0, 2) == main.data2.position || main.vars.oppo[time][i].substring(0, 2) == 'AA') {
                    main.tips.oppo.push(main.vars.oppo[time][i].substring(2, main.vars.oppo[time][i].length));
                } else if (main.vars.oppo[time][i].substring(0, 2) == 'AB' && (main.data2.position == 'AS' || main.data2.position == 'AD')) {
                    main.tips.oppo.push(main.vars.oppo[time][i].substring(2, main.vars.oppo[time][i].length));
                }
            }
        },
        cleanTipsDisplay: function () {
            main.tips = {
                domain: [],
                oppo: [],
                runes: [],
                Mysterys: []
            }
        },
        stopeverything: function () {
            for (let i = 0; i < this.stopper; i++) {
                clearTimeout(this.stopper[i]);
            }
            this.stopper = [];
        },
        getGame: function () {
            this.stopeverything();
            riotapi.find((data) => {
                // console.log(data);
                if (data != 404) {
                    this.newuser = 2;
                    this.mypng = 'http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/' + pref.getChampName(data[1][0].championId) + '.png';
                    this.domainchamp.name = pref.getChampName(data[1][0].championId);
                    this.domainchamp.id = data[1][0].championId;
                    this.data2 = data[2];
                    this.oppoid = data[1][1].summonerName;
                    this.domainid = data[1][0].summonerName;
                    this.oppopng = 'http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/' + pref.getChampName(data[1][1].championId) + '.png';
                    this.oppochamp.name = pref.getChampName(data[1][1].championId);
                    this.oppochamp.id = data[1][1].championId;
                    riotapi.gtips(data[1][0].championId, data[1][1].championId, data => {
                        const fixed = Prefsystem.fixdata(data);
                        main.vars.domain = fixed[0];
                        main.vars.oppo = fixed[1];
                        main.updatetips();
                    });
                }
            }, (error) => {
                if (error == 404) {
                    main.debugdisplay = '游戏并没有开始';
                } else {
                    main.debugdisplay = '出现了没有预料到的错误, 点击"帮助" -> 回报BUG告诉我们发生了什么';
                }
            });
        }
    }
})
