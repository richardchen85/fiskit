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
    fiskit.util.merge(config, cfg)

    // 开启模块化插件
    config.MODULES && fiskit.hook(config.MODULES.mode, config.MODULES);
    
    // 静态资源加载插件
    fiskit.match('::packager', {
        postpackager: fiskit.plugin('loader', {
            resourceType: config.MODULES ? config.MODULES.mode : 'auto',
            useInlineMap: true
        })
    });
    
    // 默认设置
    fiskit
        .match('{/static/**/_*.scss,/{page,widget}/**/*.json,/widget/**/*.vm}', {
            release: false
        })
        // 关闭useHash
        .match('*', {
            useHash: false
        })
        .match('*.{css,scss,js,png,jpg,gif}', {
            useHash: config.USEHASH,
            domain: config.CDN ? (config.CDNURL + '/' + config.VERSION) : ''
        })
        // 添加velocity模板引擎
        .match('/page/(**.vm)', {
            parser: fiskit.plugin('velocity', {
                loader: config.MODULES && config.MODULES.loader
            }),
            rExt: '.html',
            loaderLang: 'html',
            release: '$1'
        })
        // sass
        .match('/{widget,static}/**.scss', {
            parser: fiskit.plugin('sass'),
            rExt: '.css'
        })
        .match('/{widget/**/*,/static/app/common/**.js}', {
            isMod: true
        });
    
    // 生产测试环境设置
    // 和线上有同样MD5，用于调试线上BUG
    fiskit
        .media('debug')
        .match('*', {
            deploy: fiskit.plugin('local-deliver', {
                to: 'output/debug/' + config.VERSION
            })
        });
    
    // 生产环境设置
    // 发布后直接上传CDN服务器
    fiskit
        .media('prod')
        .match('/{page,test}/**', {
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
            // 发布环境始终开启CDN
            domain: config.CDNURL + '/' + config.VERSION,
            deploy: fiskit.plugin('local-deliver', {
                to: 'output/prod/' + config.VERSION
            })
        });
}