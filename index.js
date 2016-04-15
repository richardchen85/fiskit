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
    '{README,readme}.md',
    'fk-conf.js',
    '*.iml',
    '_docs/**'
]));

var config, currentMedia, cdnUrl;

// 可自定义fis配置
fiskit.amount = function(cfg, callback) {
    // 读取默认配置文件
    config = require('./lib/config');

    // 合并传入配置
    fiskit.util.merge(config, cfg);

    setDefault();

    initGlobal();

    initOptimizer();

    callback && callback();
};

// 默认设置
function setDefault() {
    cdnUrl = config.cdnUrl + (config.version ? '/' + config.version : '');
    currentMedia = fiskit.project.currentMedia();

    // 读取release额外参数
    config.cdn = fiskit.get('--domain') ? true : config.cdn;
    config.packed = fiskit.get('--pack') ? true : config.packed;

    // 开启模块化插件
    if(config.modules) {
        fiskit.hook(config.modules.mode, config.modules);
        // widget和components所有js模块化
        fiskit.match('/{widget,static/components}/**.js', {
            isMod: true
        });
    }

    // vm环境下不开启vm的parser
    if(currentMedia === 'vm') {
        config.velocity.parse = false;
    }

    // 静态资源加载插件
    fiskit.match('::packager', {
        postpackager: fiskit.plugin('loader', {
            resourceType: config.modules ? config.modules.mode : 'auto',
            useInlineMap: true
        }),
        spriter: fiskit.plugin('csssprites')
    });
}

// 全局配置
function initGlobal() {
    fiskit
        // 以下划线开头的不发布
        .match('**/_*', {
            release: false
        }, true)
        // 关闭md5
        .match('*', {
            useHash: false,
            // 开发环境，cdn可配置开关
            domain: currentMedia !== 'dev' ? cdnUrl : (config.cdn ? cdnUrl : '')
        })
        // 静态资源加md5
        .match('*.{css,scss,js,png,jpg,gif}', {
            useHash: config.useHash
        })
        // 配置文件输出（只有dev环境需要）
        .match('{server.conf,map.json}', {
            release: currentMedia === 'dev' ? '/config/$0' : false
        })
        // 忽略mock文件及widget的vm文件
        .match('{/widget/**.{mock,json,vm},/page/**.{json,mock},/page/macro.vm}', {
            release: false
        })
        // 开启css sprite
        .match('*.{css,scss}', {
            sprite: true
        })
        // sass
        .match('*.scss', {
            parser: fiskit.plugin('node-sass', {
                outputStyle: 'expanded'
            }),
            rExt: '.css'
        })
        // 添加velocity模板引擎
        .match('*.vm', {
            parser: fiskit.plugin('velocity', config.velocity),
            rExt: '.html',
            loaderLang: 'html'
        })
        .match('/page/(**.vm)', {
            release: '$1'
        })

    // 静态资源不需要vm和test数据
    if(currentMedia === 'debug' || currentMedia === 'prod') {
        fiskit.match('/{page/**.vm,test/**,mock/**}', {
            release: false
        })
    }

    // vm环境需要发布vm文件
    if(currentMedia === 'vm') {
        fiskit
            .match('*.vm', {
                rExt: '.vm'
            })
            .match('/widget/**.vm', {
                release: '$0'
            })
    }

    dealDeploy();
}

function dealDeploy() {
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
            r.push(fiskit.plugin('replace', raw));
        });
        return r;
    };

    // 开发环境，发布目录可配置
    if(currentMedia === 'dev') {
        config.devPath && fiskit.match('*', {
            deploy: fiskit.plugin('local-deliver', {
                to: config.devPath
            })
        });
    }
    // vm环境，支持文件内容替换
    else if (currentMedia === 'vm') {
        fiskit.match('*.vm', {
            deploy: replacer(config.replace).concat(fiskit.plugin('local-deliver', {
                to: config.deploy.vmTo ? config.deploy.vmTo : 'output/template/' + config.version
            }))
        })
    }
    // 默认发布到media目录
    else {
        fiskit.match('*', {
            deploy: fiskit.plugin('local-deliver', {
                to: config.deploy.staticTo ? config.deploy.staticTo : 'output/' + currentMedia + '/' + config.version
            })
        })
    }
}

// 各种压缩和打包
function initOptimizer() {
    if(currentMedia === 'vm' || currentMedia === 'prod') {
        fiskit
            .match('*.{js,vm:js,html:js}', {
                optimizer: fis.plugin('uglify-js', {
                    mangle: ['require', 'define']
                })
            })
            .match('*.{scss,css,vm:css,vm:scss,html:css,html:scss}', {
                optimizer: fis.plugin('clean-css')
            })
            .match('*.png', {
                optimizer: fis.plugin('png-compressor')
            })
    }

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
        var kv;
        if(currentMedia !== 'dev' || config.packed) {
            for(kv in packConfig) {
                fiskit.match(kv, packConfig[kv]);
            }
        }
    })(config.package);
}