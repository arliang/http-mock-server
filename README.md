安装完后，在开始菜单找**Node.js command prompt**，按鼠标右键，选择**以管理员身份运行**；
打开DOS窗口，输入```where npm```查找npm的位置
```
D:\Work\git>where npm
D:\Program Files\nodejs\npm
D:\Program Files\nodejs\npm.cmd
```

用``` explorer D:\Program Files\nodejs\ ```命令打开npm所在位置
创建```cnpm.cmd```文件，内容如下
```
:: 使用淘宝的npm，国外的连接速度慢
npm --registry=https://r.cnpmjs.org %*
```

使用以下命令安装```express```

```
cnpm install -g express
cnpm install -g express-generator
```

输入以下命令，在```D:\express_http_mock_server\ ```下面创建你的express工程
```
C:> cd /d d:\

D:> express express_http_mock_server

D:> cd express_http_mock_server

D:\express_http_mock_server> cnpm install -ejs
```
等安装完毕


编辑 ```app.js ```
添加自己的mock
```javascript
app.post('/:id/:number', function(req, res){
	res.end(JSON.stringify(req));
});
```


使用 ```cnpm start```命令开启服务

浏览器中打开 http://localhost:3000 就可以查看自己的页面了