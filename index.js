'use strict';

// 扩展fis的一些基础事情
let fiskit = module.exports = require('fis3');
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
    '_docs/**',
    'package.json',
    'npm-debug.log'
]));

/**
 * 可自定义fis配置
 * @param {Object} cfg
 * @param {Function} callback
 */
fiskit.amount = function(cfg, callback) {
    let 
        // 当前的media环境
        currentMedia = fiskit.project.currentMedia(),
        // 合并配置文件
        config = mergeConfig(cfg, currentMedia),
        // cdn前缀
        cdnUrl = config.cdnUrl + (config.version ? '/' + config.version : '');

    configCommon(config, currentMedia, cdnUrl);

    configParser(config, currentMedia, cdnUrl);

    configRelease(config, currentMedia, cdnUrl);

    configDeploy(config, currentMedia, cdnUrl);

    configOptimizer(config, currentMedia, cdnUrl);

    callback && callback();
};

/**
 * 将用户的配置并入默认配置
 * @param {Object} cfg 
 * @param {string} currentMedia 
 */
function mergeConfig(cfg, currentMedia) {
    // 合并配置信息
    let config = fiskit.util.merge(require('./lib/config'), cfg || {});
    // 读取release额外参数
    config.cdn = fiskit.get('--domain') ? true : config.cdn;
    config.packed = fiskit.get('--pack') ? true : config.packed;

    // vm环境下不开启vm的parser
    if(currentMedia === 'vm') {
        config.velocity.parse = false;
    }

    return config;
}

/**
 * 设置fis的通用配置
 * @param {Object} config 
 * @param {string} currentMedia 
 * @param {string} cdnUrl 
 */
function configCommon(config, currentMedia, cdnUrl) {
    fiskit
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
        // 开启css sprite
        .match('*.{css,scss}', {
            useSprite: true
        })
        // 静态资源加载插件
        .match('::packager', {
            postpackager: fiskit.plugin('loader', {
                resourceType: config.modules ? config.modules.mode : 'auto',
                useInlineMap: true
            }),
            spriter: fiskit.plugin('csssprites', {
                layout: 'matrix'
            })
        });

    // 开启模块化插件
    if(config.modules) {
        fiskit.hook(config.modules.mode, config.modules);
        // widget和components所有js模块化
        fiskit.match('/{widget,static/components}/**.js', {
            isMod: true,
            useSameNameRequire: true
        });
    }
}

/**
 * 配置parser
 * @param {Object} config 
 * @param {string} currentMedia 
 * @param {string} cdnUrl 
 */
function configParser(config, currentMedia, cdnUrl) {
    fiskit
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
        });

    if (config.postcss) {
        fiskit
            .match('*.css', {
                postprocessor: fiskit.plugin('postcss', config.postcss)
            })
            // 非下划线开头的才 autoprefixer
            .match(/.*\/[a-zA-Z0-9]+\.scss$/, {
                postprocessor: fiskit.plugin('postcss', config.postcss)
            });
    }
}

/**
 * 配置release
 * @param {Object} config 
 * @param {string} currentMedia 
 * @param {string} cdnUrl 
 */
function configRelease(config, currentMedia, cdnUrl) {
    fiskit
        // 以下划线开头的不发布
        .match('**/_*', {
            release: false
        }, true)
        // 页面文件去掉page层级
        .match('/page/(**.*)', {
            release: '$1'
        })
        // 配置文件输出（只有dev环境需要）
        .match('{server.conf,map.json}', {
            release: currentMedia === 'dev' ? '/config/$0' : false
        })
        // 忽略.mock文件及widget的vm文件
        .match('{/widget/**.{mock,vm},/page/**.mock,/page/macro.vm}', {
            release: false
        });

    // 静态资源发布环境
    ['debug', 'prod'].forEach(function (media) {
        fiskit.media(media)
            // 静态资源不需要vm和test数据
            .match('/{page/**.vm,page/**.mock,test/**,mock/**}', {
                release: false
            });
    });

    // vm环境
    fiskit.media('vm')
        .match('*.vm', {
            rExt: '.vm'
        })
        .match('/widget/**.vm', {
            release: '$0'
        });
}

/**
 * 发布相关的配置
 * @param {Object} config 
 * @param {string} currentMedia 
 * @param {string} cdnUrl 
 */
function configDeploy(config, currentMedia, cdnUrl) {
    // 开发环境，发布目录可配置
    config.devPath && fiskit.media('dev').match('*', {
        deploy: fiskit.plugin('local-deliver', {
            to: config.devPath
        })
    });

    // 静态资源默认发布到当前media目录
    ['debug', 'prod'].forEach(function (media) {
        fiskit.media(media).match('*', {
            deploy: fiskit.plugin('local-deliver', {
                to: config.deploy.staticTo ? config.deploy.staticTo : 'output/' + currentMedia + '/' + config.version
            })
        });
    });

    // vm环境，支持文件内容替换
    fiskit.media('vm').match('*.vm', {
        deploy: createReplacer(config.replace).concat(fiskit.plugin('local-deliver', {
            to: config.deploy.vmTo ? config.deploy.vmTo : 'output/template/' + config.version
        }))
    });
}

/**
 * 各种压缩和打包配置
 * @param {Object} config 
 * @param {string} currentMedia 
 * @param {string} cdnUrl 
 */
function configOptimizer(config, currentMedia, cdnUrl) {
    const optimizerJs = {
        optimizer: fis.plugin('uglify-js', {
            mangle: ['require', 'define']
        })
    }
    const optimizerPng = {
        optimizer: fis.plugin('png-compressor')
    }
    const optimizerCss = {
        optimizer: fis.plugin('clean-css')
    }

    fiskit
        .media('prod')
        .match('*.js', optimizerJs)
        .match('*.{scss,css}', optimizerCss)
        .match('*.png', optimizerPng)

    fiskit
        .media('vm')
        .match('*.{vm:js,html:js}', optimizerJs)
        .match('*.{vm:scss,vm:css,html:scss,html:scss}', optimizerCss)

    // 打包配置，默认为null无打包配置
    // media('dev')环境只在config.packed为true时打包
    // 其它media默认打包
    // @example
    //   {
    //     '/widget/**.css': {
    //       packTo: '/widget/widget_pkg.css'
    //     }
    //   }
    if(config.package && (currentMedia !== 'dev' || config.packed)) {
        for(let key in config.package) {
            fiskit.match(key, config.package[key])
        }
    }
}

/**
 * 加载fis3-deploy-replace插件
 * @param opt {Object|Array}
 * @example
 *   { from: 'a', to: 'b' } or [ { from: 'a', to: 'b' }, { from: 'a0', to: 'b0' }]
 */
function createReplacer(opt) {
    let r = [];
    if(!opt) {
        return r;
    }
    if(!Array.isArray(opt)) {
        opt = [opt];
    }
    opt.forEach(raw => {
        r.push(fiskit.plugin('replace', raw));
    });
    return r;
}