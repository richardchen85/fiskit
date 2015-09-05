# fiskit
A front-end toolkit based on fis （基于fis的纯前端脚手架工具）
```
npm install -g fiskit
```
<pre>
fk release [dev|vm|debug|prod]
dev: 开发时使用
vm: 只输出vm模板文件
debug: 用于调试时使用，线上环境的未压缩版代码，方便查找bug
prod: 发布时使用，为debug的压缩版本
</pre>

## 文档

快速入门、配置、插件开发以及原理等文档 [FIS官方文档](http://fis.baidu.com/fis3/docs/beginning/intro.html)


## 目录结构
<pre>
root
  ├ _docs 项目文档目录
  ├ page 页面文件
  │  ├ home
  │  │  └ home.vm
  │  ├ list
  │  │  └ list.vm
  │  └ detail
  │     └ detail.vm
  ├ sass SASS库目录
  ├ mock 测试模拟数据目录
  ├ static 静态资源目录
  │  ├ img 图片目录
  │  ├ css css目录
  │  └ js 非模块化js目录
  │     ├ lib 模块化框架，如requirejs, modjs, seajs等
  │     └ common 公共库文件，如bootstrap, jqueryui等
  └ widget 组件目录
     ├ header
     │  ├ header.vm
     │  ├ header.js
     │  ├ header.scss
     │  ├ header.mock
     └ nav
        ├ nav.vm
        ├ nav.js
        ├ nav.scss
        └ nav.mock
</pre>

## 配置例子

*fk-conf.js*

```
var config = {
	// 静态资源版本号
    version: '1.0.0',
    // cdn域名开关，prod环境始终为true
    cdn: false,
    // cdn域名地址
    cdnUrl: 'http://cdn.xxx.com',
    // MD5后缀开关
    useHash: false,
    // fis-parser-velocity 配置
    // 具体参考：https://github.com/richard-chen-1985/fis-parser-velocity
    velocity: {
        loader: 'require',
        macro: '/macro.vm'
    },
    // fiskit release dev目标路径，默认不设置
    // 如果你用非fis自带server，可以直接将代码输出到你server的根目录
    devPath: '',
    // fiskit release vm环境下，deploy的replace选项
    // 默认为false, 可跟[Object|Array]
    // 具体配置请参考https://github.com/fex-team/fis3-deploy-replace
    // e.g.
    //   { from:'a', to:'b' }
    //   or
    //   [ { from:'a', to:'b' }, { from:'a0', to: b0' } ]
    replace: false,
    // 模块化配置，如不使用模块化框架，则为false
    modules: {
        // 模块规范[amd|cmd]
        mode: 'amd',
        // 以下配置请参考fis3-hook-amd或者fis3-hook-cmd配置
        forwardDeclaration: true,
        baseUrl: '',
        paths: {}
    }
};

fiskit.amount(config);
```
这里有完整的[fiskit-demo](https://github.com/richard-chen-1985/fiskit-demo)供参考。