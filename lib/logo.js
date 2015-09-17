/*
 ////////  ////                  ///            ////    ///
 ///////   ////                  ///            ////    ///
 ///               ///////       ///   /////            ///
 ///////   ////   ///////////    ///  /////     ////  ////////
 ///////   ////  ////    ////    /// /////      ////  ////////
 ///       ////  ////            ////////       ////    ///
 ///       ////  ///////////     ////////       ////    ///
 ///       ////        ///////   ///  /////     ////    ///
 ///       ////  ///      ////   ///   /////    ////    ///  //
 ///       ////   ///////////    ///     /////  ////    //////
 */
module.exports = function() {
    var logo = '\n\n' +
        '   ////////  '.bold.red + '////  '.bold.yellow + '                '.bold.blue + '///            '.bold.green + '////  '.bold.magenta + '  ///    \n'.bold.white +
        '   ///////   '.bold.red + '////  '.bold.yellow + '                '.bold.blue + '///            '.bold.green + '////  '.bold.magenta + '  ///    \n'.bold.white +
        '   ///       '.bold.red + '      '.bold.yellow + '  ///////       '.bold.blue + '///   /////    '.bold.green + '      '.bold.magenta + '  ///    \n'.bold.white +
        '   ///////   '.bold.red + '////  '.bold.yellow + ' ///////////    '.bold.blue + '///  /////     '.bold.green + '////  '.bold.magenta + '///////  \n'.bold.white +
        '   ///////   '.bold.red + '////  '.bold.yellow + '////    ////    '.bold.blue + '/// /////      '.bold.green + '////  '.bold.magenta + '///////  \n'.bold.white +
        '   ///       '.bold.red + '////  '.bold.yellow + '////            '.bold.blue + '////////       '.bold.green + '////  '.bold.magenta + '  ///    \n'.bold.white +
        '   ///       '.bold.red + '////  '.bold.yellow + '///////////     '.bold.blue + '////////       '.bold.green + '////  '.bold.magenta + '  ///    \n'.bold.white +
        '   ///       '.bold.red + '////  '.bold.yellow + '      ///////   '.bold.blue + '///  /////     '.bold.green + '////  '.bold.magenta + '  ///    \n'.bold.white +
        '   ///       '.bold.red + '////  '.bold.yellow + '///      ////   '.bold.blue + '///   /////    '.bold.green + '////  '.bold.magenta + '  ///  //\n'.bold.white +
        '   ///       '.bold.red + '////  '.bold.yellow + ' ///////////    '.bold.blue + '///     /////  '.bold.green + '////  '.bold.magenta + '  ////// \n'.bold.white;
    console.log(logo + '\n  fiskit v' + fiskit.cli.info.version);
};