// 扩展fis的一些基础事情
var fiskit = module.exports = require('fis3');
fiskit.require.prefixes.unshift('fk');
fiskit.configName = 'fk-conf';
fiskit.cli.name = 'fk';
//fiskit.cli.help.commands = [ 'release', 'install', 'server', 'init' ];
fiskit.cli.info = require('./package.json');
fiskit.cli.version = require('./lib/logo');

// alias
Object.defineProperty(global, 'fiskit', {
    enumerable: true,
    writable: false,
    value: fiskit
});


// 添加全局忽略
fiskit.set('project.ignore', fiskit.get('project.ignore').concat([
    'README.md',
    'fk-conf.js',
    '/{_docs,sass}/**'
]));

// init方法，初始化fis配置
fiskit.amount = function(cfg) {
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
        spriter: fiskit.plugin('csssprites')
    });
    
    // 默认设置
    fiskit
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
            parser: fiskit.plugin('velocity', config.velocity),
            rExt: '.html',
            loaderLang: 'html',
            release: '$1'
        })
        .match('/page/macro.vm', {
            release: false
        })
        // sass
        .match('*.scss', {
            parser: fiskit.plugin('sass'),
            rExt: '.css'
        })
        // widget所有组件都模块化
        .match('/widget/**.{css,scss,js}', {
            isMod: true
        });
    
    // debug和prod环境共同配置
    ['debug', 'prod'].forEach(function(_media) {
        fiskit
            .media(_media)
            .match('/{page/**.vm,mock/**}', {
                release: false
            })
            .match('*', {
                domain: config.cdnUrl + '/' + config.version,
                deploy: fiskit.plugin('local-deliver', {
                    to: 'output/' + _media + '/' + config.version
                })
            })
    });

    // 生产环境设置
    // 发布后直接上传CDN服务器
    fiskit
        .media('prod')
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
};