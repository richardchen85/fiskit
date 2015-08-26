module.exports = function(fiskit) {
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
    fiskit.cli.version = function() {

        var logo = '';

        if (fiskit.util.isWin()) {

           logo = '\n\n' +
                  // '        //////    '.bold.red + '///////'.bold.yellow + '    //     '.bold.blue + ' /////  '.bold.green + ' //    ///\n'.bold.white +
                  // '       //    //  '.bold.red + '//     '.bold.yellow + '    ///    '.bold.blue + '//   // '.bold.green + '  //  /// \n'.bold.white +
                  // '      //    //  '.bold.red + '//     '.bold.yellow + '   // //   '.bold.blue + ' //     '.bold.green + '   // //   \n'.bold.white +
                  // '     ///////   '.bold.red + '///////'.bold.yellow + '   //  //  '.bold.blue + '   //// '.bold.green + '    ///     \n'.bold.white +
                  // '    //   /    '.bold.red + '//     '.bold.yellow + '  ///////  '.bold.blue + '/     //'.bold.green + '     //      \n'.bold.white +
                  // '   //    /   '.bold.red + '//     '.bold.yellow + '  //    // '.bold.blue + ' //  ///'.bold.green + '     //       \n'.bold.white +
                  // '  //     // '.bold.red + '////////'.bold.yellow + ' //     //'.bold.blue + '   ///  '.bold.green + '     //        \n'.bold.white;
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
                   '////////  ////                  ///            ////    ///' +     
                   '///////   ////                  ///            ////    ///' +     
                   '///               ///////       ///   /////            ///' +     
                   '///////   ////   ///////////    ///  /////     ////  ////////' +  
                   '///////   ////  ////    ////    /// /////      ////  ////////' +  
                   '///       ////  ////            ////////       ////    ///' +     
                   '///       ////  ///////////     ////////       ////    ///' +     
                   '///       ////        ///////   ///  /////     ////    ///' +     
                   '///       ////  ///      ////   ///   /////    ////    ///  //' +   
                   '///       ////   ///////////    ///     /////  ////    //////';
        }
        console.log(logo + '\n  fiskit v' + fiskit.cli.info.version);
    };
};