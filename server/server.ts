import type { Request } from 'mbr-serv-request';
import { getIndex } from './ssr/components/root';

const STATIC_ROOT = __dirname + '/../../static/';
const MODULE_ROOT = __dirname + '/../../node_modules/';
const CLIENT_ROOT = __dirname + '/../client/';

const SRC_RE = /^\/src\/(.+)$/;

function get404 (request: Request) {
  request.status = 404;
  request.send();
}

async function getJS ([, path]: RegExpExecArray, request: Request) {
  if (!path) {
    return get404(request);
  }

  try {
    const file = await request.getFile({ root: CLIENT_ROOT, file: path + '.js' });
    request.send(file, 'js');
  } catch (error) {
    console.log('SCALC:', error);
    get404(request);
  }
}

async function getIndexPage (request: Request) {
  try {
    const index = await getIndex();
    request.send(index, 'htm');
  } catch (error) {
    console.log('SCALC:', error);
    get404(request);
  }
}

const ROUTER = {
  '/': getIndexPage,
  '/favicon.ico': STATIC_ROOT + 'favicon.ico',
  '/lib/splux.js': MODULE_ROOT + 'splux/index.js',
  '/lib/mbr-style.js': MODULE_ROOT + 'mbr-style/index.js',
  '/lib/mbr-state.js': MODULE_ROOT + 'mbr-state/index.js',
};

export = function (request: Request) {
  request.match(SRC_RE, getJS) || request.route(ROUTER) || get404(request);
}
