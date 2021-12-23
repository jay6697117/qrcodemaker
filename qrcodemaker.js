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
 * C型二维码，{'path':'xmain/evcar?chgid=100120','width':430} 参数名可变，统一取名即可
 */
const fs = require('fs');
const request = require('request');
const wxappid = 'wx03de48e13d5561b3'; //你的微信小程序APPID
const wxappsecret = '0c3561938d16e51986beb38531a84367'; //你的微信小程序APPSECRET
const savepath = __dirname + '/output/'; //输出图片的保存位置

const arr = []
for (let index = 0; index < 16; index++) {
  for (let i = 0; i < 2; i++) {
    const tempObj = {};
    tempObj.round = i+1;
    tempObj.zoneNum = index+1;
    arr.push(tempObj)
  }
}

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
