// 各种配置及开关
module.exports = {
    // 静态资源版本号
    version: '1.0.0',
    // 打包开关，默认为false
    // 可以手动设置为true，也可以fk release -p设置为true
    packed: false,
    // cdn域名开关，prod环境始终为true
    cdn: false,
    // cdn域名地址
    cdnUrl: '',
    // MD5后缀开关
    useHash: false,
    // fis-parser-velocity 配置
    // 具体参考：https://github.com/richard-chen-1985/fis-parser-velocity
    velocity: {
        loader: 'require',
        macro: '/macro.vm'
    },
    // fk release dev目标路径，默认不设置
    // 如果你用非fis自带server，可以直接将代码输出到你server的根目录
    devPath: '',
    // 自定义部署目录
    deploy: {
        // fk release vm 的输出目录
        vmTo: '',
        // fk release debug|prod 的输出目录
        staticTo: ''
    },
    // fk release vm环境下，deploy的replace选项
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
    },
    // 打包配置，默认为null无打包配置
    // media('dev')环境只在config.packed为true时打包
    // 其它media默认打包
    // @example
    //   {
    //     '/widget/**.css': {
    //       packTo: '/widget/widget_pkg.css'
    //     }
    //   }
    package: null
};