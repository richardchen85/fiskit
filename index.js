// 扩展fis的一些基础事情
var fiskit = module.exports = require('fis3');
fiskit.require.prefixes.unshift('fiskit');
fiskit.cli.name = 'fk';
fiskit.configName = 'fk-conf';
fiskit.cli.info = require('./package.json');

// 重写LOGO
require('./lib/logo')(fiskit);

// 添加全局忽略
fiskit.set('project.ignore', fiskit.get('project.ignore').concat([
    'README.md',
    'fk-conf.js',
    '/{_docs,sass}/**'
]));

// 挂载initConfig方法
fiskit.config.set('initConfig', init);

// init方法，初始化fis配置
function init(cfg) {
    // 读取默认配置文件
    var config = require('./lib/config');
    // 合并传入配置
    fiskit.util.merge(config, cfg);

    // 开启模块化插件
    config.modules && fiskit.hook(config.modules.mode, config.modules);
    
    // 静态资源加载插件
    fiskit.match('::packager', {
        postpackager: fiskit.plugin('loader', {
            resourceType: config.modules ? config.modules.mode : 'auto',
            useInlineMap: true
        }),
        spriter: fis.plugin('csssprites')
    });
    
    // 默认设置
    fiskit
        .match('*', {
            // 关闭useHash
            useHash: false,
            // 开发环境，cdn可配置开关
            domain: config.cdn ? (config.cdnUrl + '/' + config.version) : ''
        })
        // 忽略数据文件及widget的vm文件
        .match('{/{page,widget}/**/*.json,/widget/**/*.vm,/page/macro.vm}', {
            release: false
        })
        .match('*.{css,scss,js,png,jpg,gif}', {
            useHash: config.useHash
        })
        .match('/page/(**/*)', {
            release: '$1'
        })
        // 添加velocity模板引擎
        .match('/page/**.vm', {
            parser: fiskit.plugin('velocity', config.velocity),
            rExt: '.html',
            loaderLang: 'html'
        })
        // sass
        .match('*.scss', {
            parser: fiskit.plugin('sass'),
            rExt: '.css'
        })
        .match('/{widget/**.js}', {
            isMod: true
        });
    
    // 生产测试环境设置
    // 和线上有同样MD5，用于调试线上BUG
    fiskit
        .media('debug')
        .match('*', {
            domain: config.cdnUrl + '/' + config.version,
            deploy: fiskit.plugin('local-deliver', {
                to: 'output/debug/' + config.version
            })
        });
    
    // 生产环境设置
    // 发布后直接上传CDN服务器
    fiskit
        .media('prod')
        .match('/{page/**.vm,mock/**}', {
            release: false
        })
        .match('*.js', {
            optimizer: fiskit.plugin('uglify-js', {
                mangle: ['require', 'define']
            })
        })
        .match('*.{css,scss}', {
            optimizer: fiskit.plugin('clean-css')
        })
        .match('*.png', {
            optimizer: fiskit.plugin('png-compressor')
        })
        .match('*', {
            domain: config.cdnUrl + '/' + config.version,
            deploy: fiskit.plugin('local-deliver', {
                to: 'output/prod/' + config.version
            })
        });
}