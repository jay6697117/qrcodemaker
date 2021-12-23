/**
 * 这是用来生成B型小程序码(放射型，无限量)的工具程序
 * 使用工具前，小程序必需先上线，腾讯生成工具会检查page是否有效
 * 程序使用方法：
 * 将tools目录移至其他文件夹（因为不是小程序的一部份）
 * 先安装node, 通过终端(DOS)进入该文件夹并运行：
 * npm install --legacy-bundling
 * node qrcodemaker1.js
 * B型二维码，{'scene':'162','page':'xmain/biker','width':430} 参数名字只能为scene
 * node qrcodemaker2.js
 * C型二维码，{'path':'xmain/evcar?chgid=100120','width':430} 参数名可变，统一取名为chgid
 *
 * 生成的图片文件给到小牛公司，我公司会将二维码与设备一同组装出厂出货。
 * 重要提示：生成二维码以后请在充电小程序电桩详情页（充电页）点击右上解扫码按钮扫码一次。
 */
const fs = require('fs');
const request = require('request');
const wxappid = ''; //你的微信小程序APPID
const wxappsecret = ''; //你的微信小程序APPSECRET
const savepath = __dirname + '/output/'; //输出图片的保存位置
const arr = [
  { round: 1, zoneNum: 1 },
  { round: 2, zoneNum: 1 }
];
const index = 0;
const wxapi_qrcreate = 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=';
const wxapi_credial = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=';
let postbody = { scene: '', page: 'pages/index/index', width: 430 };
let options = { url: '', body: postbody, method: 'POST', json: true, headers: { 'content-type': 'application/json' } };
let downloadqrcode = function () {
  let credialurl = wxapi_credial + wxappid + '&secret=' + wxappsecret;
  request(credialurl, function (error, response, data) {
    if (!error && response.statusCode == 200) {
      let jsonbody = JSON.parse(data);
      let token = jsonbody.access_token;
      options.url = wxapi_qrcreate + token;
      downloadimage(arr, index);
    }
  });
};
let downloadimage = function (arr, index) {
  let round = arr[index].round;
  let zoneNum = arr[index].zoneNum;
  postbody.scene = `round=${round}&zoneNum=${zoneNum}`;
  console.log(`postbody.scene:`, postbody.scene)
  options.body = postbody;
  let imgfile = savepath + `第${zoneNum}战区-第${round}轮` + '.jpg';
  console.log('正在生成二维码: ', imgfile);
  request(options)
    .pipe(fs.createWriteStream(imgfile))
    .on('close', function () {
      index += 1;
      if (index < arr.length) {
        downloadimage(arr,index);
      }
    });
};
downloadqrcode();
