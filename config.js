// 各种配置及开关
module.exports = {
    // 静态资源版本号
    VERSION: '1.0.0',
    // 合并开关
    PACKED: false,
    // cdn域名开关，prod环境始终为true
    CDN: false,
    // cdn域名地址
    CDNURL: '',
    // MD5后缀开关
    USEHASH: false,
    // 模块化配置，如不使用模块化框架，则为false
    MODULES: {
        // 模块规范[amd|cmd]
        mode: 'amd',
        // fis-parser-velocity的loader配置，具体参考：
        // https://github.com/richard-chen-1985/fis-parser-velocity
        loader: 'require',
        // 以下配置请参考fis3-hook-amd或者fis3-hook-cmd配置
        forwardDeclaration: true,
        baseUrl: '',
        paths: {}
    }
};