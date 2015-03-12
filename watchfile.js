var fs = require('fs');

var request = {}, res = {};
var text;
var filename = 'settings/request.json';
var ansi = require('ansi-style');

function readJSON(){
    console.log('readJSON');
    if(fs.existsSync(filename)){
        // 读取文件内容并解析
        try {
            text = fs.readFileSync('settings/request.json', 'utf-8');
            global.request = eval('(' + text + ')');
            global.res = null;
        } catch(e) {
            res.status = 500;
            res.text = (JSON.stringify({
                error: 'It may contains error in file ' + filename
            }));
            global.res = res;
            return false;
        } finally {
            if(global.request){
                console.error(ansi.red.open + global.request + ansi.red.close);
            }
            if(res && res.text){
                console.error(res.text);
            }
        }
    } else {  // 找不到文件
        res.status = 500;
        res.text = (JSON.stringify({
            error: 'File not found: ' + filename
        }));
        global.res = res;
    }
}
fs.watchFile(filename, function(){
    console.log(filename + ' changed');
    readJSON();
});
readJSON();