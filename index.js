// 扩展fis的一些基础事情
var fis = module.exports = require('fis3');
fis.require.prefixes.unshift('fiskit');
fis.cli.name = 'fk';
fis.cli.info = require('./package.json');

// 添加全局忽略
fis.set('project.ignore', fis.get('project.ignore').concat([
    '/README.md',
    '/{_docs,sass}/**'
]));

// 挂载initConfig方法
fis.config.set('initConfig', init);

// init方法，初始化fis配置
function init(cfg) {
    // 读取默认配置文件
    var config = require('./config');
    // 合并传入配置
    fis.util.merge(config, cfg)

    // 开启模块化插件
    config.MODULES && fis.hook(config.MODULES.mode, config.MODULES);
    
    // 静态资源加载插件
    fis.match('::packager', {
        postpackager: fis.plugin('loader', {
            resourceType: config.MODULES ? config.MODULES.mode : 'auto',
            useInlineMap: true
        })
    });
    
    // 默认设置
    fis
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
            parser: fis.plugin('velocity', {
                loader: config.MODULES && config.MODULES.loader
            }),
            rExt: '.html',
            loaderLang: 'html',
            release: '$1'
        })
        // sass
        .match('/{widget,static}/**.scss', {
            parser: fis.plugin('sass'),
            rExt: '.css'
        })
        .match('/{widget/**/*,/static/app/common/**.js}', {
            isMod: true
        });
    
    // 生产测试环境设置
    // 和线上有同样MD5，用于调试线上BUG
    fis
        .media('debug')
        .match('*', {
            deploy: fis.plugin('local-deliver', {
                to: 'output/debug/' + config.VERSION
            })
        });
    
    // 生产环境设置
    // 发布后直接上传CDN服务器
    fis
        .media('prod')
        .match('/{page,test}/**', {
            release: false
        })
        .match('*.js', {
            optimizer: fis.plugin('uglify-js', {
                mangle: ['require', 'define']
            })
        })
        .match('*.{css,scss}', {
            optimizer: fis.plugin('clean-css')
        })
        .match('*.png', {
            optimizer: fis.plugin('png-compressor')
        })
        .match('*', {
            // 发布环境始终开启CDN
            domain: config.CDNURL + '/' + config.VERSION,
            deploy: fis.plugin('local-deliver', {
                to: 'output/prod/' + config.VERSION
            })
        });
}