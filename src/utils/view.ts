
/* IMPORT */

import * as _ from 'lodash';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as sha1 from 'sha1';
import * as vscode from 'vscode';
import Consts from '../consts';

/* VIEW */

const View = {

  uris: {},

  getURI ({ filePath, relativePath }) {

    if ( View.uris[filePath] ) return View.uris[filePath];

    const uri = vscode.Uri.file ( filePath );

    uri['label'] = _.trimStart ( relativePath, '\\/' );

    View.uris[filePath] = uri;

    return uri;

  },

  icons: {},

  getTypeIcon ( type ) { //TODO: Add support for light/dark colors

    if ( View.icons[type] ) return View.icons[type];

    if ( !Consts.colors.types[type] ) return;

    const {context} = require ( '.' ).default, // Avoiding a cyclic dependency
          color = Consts.colors.types[type],
          colorHash = sha1 ( color ),
          iconPath = path.join ( context.storagePath, `type-color-${colorHash}.svg` );

    mkdirp.sync ( context.storagePath );

    if ( !fs.existsSync ( iconPath ) ) {

      const image = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.9 8.00001C12.9 10.7062 10.7062 12.9 8 12.9C5.2938 12.9 3.1 10.7062 3.1 8.00001C3.1 5.29381 5.2938 3.10001 8 3.10001C10.7062 3.10001 12.9 5.29381 12.9 8.00001Z" stroke="${color}"/></svg>`;

      fs.writeFileSync ( iconPath, image );

    }

    View.icons[type] = iconPath;

    return iconPath;

  }

};

/* EXPORT */

export default View;
