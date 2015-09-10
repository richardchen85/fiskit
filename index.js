// 扩展fis的一些基础事情
var fiskit = module.exports = require('fis3');
fiskit.require.prefixes.unshift('fk');
fiskit.configName = 'fk-conf';
fiskit.cli.name = 'fk';
//fiskit.cli.help.commands = [ 'release', 'install', 'server', 'init' ];
fiskit.cli.info = require('./package.json');
fiskit.cli.version = require('./lib/logo');

// 读取默认配置文件
var config = require('./lib/config');

// alias
Object.defineProperty(global, 'fiskit', {
    enumerable: true,
    writable: false,
    value: fiskit
});

// 添加全局忽略
fiskit.set('project.ignore', fiskit.get('project.ignore').concat([
    '{README,readme}.md',
    'fk-conf.js',
    '*.iml',
    '_docs/**'
]));

// 默认配置
fiskit
    // 以下划线开头的不发布
    .match('**/_*', {
        release: false
    })
    // 关闭md5
    .match('*', {
        useHash: false
    })
    .match('/server.conf', {
        release: '/config/$0'
    })
    .match('/map.json', {
        release: '/config/$0'
    })
    // 忽略数据文件及widget的vm文件
    .match('{/widget/**.{mock,json,vm},/page/**.{json,mock},/page/macro.vm}', {
        release: false
    })
    // 开启css sprite
    .match('*.{css,scss}', {
        sprite: true
    })
    // sass
    .match('*.scss', {
        parser: fiskit.plugin('sass'),
        rExt: '.css'
    })
    // widget和components所有js模块化
    .match('/{widget,static/components}/**.js', {
        isMod: true
    });

// 可自定义fis配置
fiskit.amount = function(cfg) {
    // 合并传入配置
    fiskit.util.merge(config, cfg);

    // 读取release额外参数
    config.cdn = fiskit.get('--domain') ? true : config.cdn;
    config.packed = fiskit.get('--pack') ? true : config.packed;

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

    // 全局配置
    fiskit
        .match('*', {
            // 开发环境，cdn可配置开关
            domain: config.cdn ? (config.cdnUrl + '/' + config.version) : ''
        })
        // 静态资源加md5
        .match('*.{css,scss,js,png,jpg,gif}', {
            useHash: config.useHash
        })
        // 添加velocity模板引擎
        .match('*.vm', {
            parser: fiskit.plugin('velocity', config.velocity),
            rExt: '.html',
            loaderLang: 'html'
        })
        .match('/page/(**/*.vm)', {
            release: '$1'
        })

    // 开发环境
    config.devPath && fiskit.media('dev').match('*', {
        deploy: fiskit.plugin('local-deliver', {
            to: config.devPath
        })
    });

    // 只发布VM模板
    (function(config) {
        var tmpVelocity = fiskit.util.merge({parse: false}, config.velocity);
        /**
         * 加载fis3-deploy-replace插件
         * @param opt {Object|Array}
         * @example
         *   { from: 'a', to: 'b' } or [ { from: 'a', to: 'b' }, { from: 'a0', to: 'b0' }]
         */
        var replacer = function(opt) {
            var r = [];
            if(!opt) {
                return r;
            }
            if(!Array.isArray(opt)) {
                opt = [opt];
            }
            opt.forEach(function(raw) {
                r.push(fis.plugin('replace', raw));
            });
            return r;
        };

        fiskit
            .media('vm')
            .match('*', {
                domain: config.cdnUrl + '/' + config.version
            })
            .match('*.vm', {
                rExt: '.vm',
                deploy: replacer(config.replace).concat(fis.plugin('local-deliver', {
                    to: './output/template/' + config.version
                }))
            })
            .match('/page/(**/*.vm)', {
                release: '$1'
            })
            .match('/widget/**.vm', {
                release: '$0'
            });
    })(config);

    // debug和prod环境
    (function(config) {
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
    })(config);

    // 打包配置，默认为null无打包配置
    // media('dev')环境只在config.packed为true时打包
    // 其它media默认打包
    // @example
    //   {
    //     '/widget/**.css': {
    //       packTo: '/widget/widget_pkg.css'
    //     }
    //   }
    config.package && (function(packConfig) {
        var _media, kv;
        ['dev', 'vm', 'debug', 'prod'].forEach(function(media) {
            if(media !== 'dev' || config.packed) {
                _media = fiskit.media(media);
                for(kv in packConfig) {
                    _media.match(kv, packConfig[kv]);
                }
            }
        });
    })(config.package);
};