// 扩展fis的一些基础事情
var fis = module.exports = require('fis3');
fis.require.prefixes.unshift('fk');
fis.cli.name = 'fk';
fis.configName = 'fk-conf';
fis.cli.info = require('./package.json');

// 重写LOGO
require('./lib/logo')(fis);

// 添加全局忽略
fis.set('project.ignore', fis.get('project.ignore').concat([
    'README.md',
    'fk-conf.js',
    '/{_docs,sass}/**'
]));

// init方法，初始化fis配置
fis.amount = function(cfg) {
    // 读取默认配置文件
    var config = require('./lib/config');
    // 合并传入配置
    fis.util.merge(config, cfg);

    // 开启模块化插件
    config.modules && fis.hook(config.modules.mode, config.modules);
    
    // 静态资源加载插件
    fis.match('::packager', {
        postpackager: fis.plugin('loader', {
            resourceType: config.modules ? config.modules.mode : 'auto',
            useInlineMap: true
        }),
        spriter: fis.plugin('csssprites')
    });
    
    // 默认设置
    fis
        .match('*', {
            // 关闭md5
            useHash: false,
            // 开发环境，cdn可配置开关
            domain: config.cdn ? (config.cdnUrl + '/' + config.version) : ''
        })
        // 忽略数据文件及widget的vm文件
        .match('{/widget/**.{json,vm},/page/**.json,/page/macro.vm}', {
            release: false
        })
        // 静态资源加md5
        .match('*.{css,scss,js,png,jpg,gif}', {
            useHash: config.useHash
        })
        // 开启css sprite
        .match('*.{css,scss}', {
            sprite: true
        })
        // 添加velocity模板引擎
        .match('/page/(**.vm)', {
            parser: fis.plugin('velocity', config.velocity),
            rExt: '.html',
            loaderLang: 'html',
            release: '$1'
        })
        .match('/page/macro.vm', {
            release: false
        })
        // sass
        .match('*.scss', {
            parser: fis.plugin('sass'),
            rExt: '.css'
        })
        // widget所有组件都模块化
        .match('/widget/**.{css,scss,js}', {
            isMod: true
        });
    
    // debug和prod环境共同配置
    ['debug', 'prod'].forEach(function(_media) {
        fis
            .media(_media)
            .match('/{page/**.vm,mock/**}', {
                release: false
            })
            .match('*', {
                domain: config.cdnUrl + '/' + config.version,
                deploy: fis.plugin('local-deliver', {
                    to: 'output/' + _media + '/' + config.version
                })
            })
    });

    // 生产环境设置
    // 发布后直接上传CDN服务器
    fis
        .media('prod')
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
}