// 各种配置及开关
module.exports = {
    // 静态资源版本号
    version: '1.0.0',
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