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
    var logo = '';
    if (fiskit.util.isWin()) {

        logo = '\n\n' +
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
    } else {
        logo = '\n\n' +
            '////////  ////                  ///            ////    ///\n' +
            '///////   ////                  ///            ////    ///\n' +
            '///               ///////       ///   /////            ///\n' +
            '///////   ////   ///////////    ///  /////     ////  ////////\n' +
            '///////   ////  ////    ////    /// /////      ////  ////////\n' +
            '///       ////  ////            ////////       ////    ///\n' +
            '///       ////  ///////////     ////////       ////    ///\n' +
            '///       ////        ///////   ///  /////     ////    ///\n' +
            '///       ////  ///      ////   ///   /////    ////    ///  //\n' +
            '///       ////   ///////////    ///     /////  ////    //////\n';
    }
    console.log(logo + '\n  fiskit v' + fiskit.cli.info.version);
};