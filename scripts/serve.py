#!/usr/bin/env python3
"""Serve the animation library, on this computer or with --lan to the local network.

Uses only the Python standard library. The site is static (no server side): this only hands
out the files it is made of - index.html, view.html, assets/, animations/ and thumbs/.
Everything else in the folder (originals/, tools/, .git, ...) is never served.
"""
import argparse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import posixpath
import socket
import urllib.parse

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / 'index.html'
DEFAULT_PORT = 8053

# The only files and folders visitors can reach.
PUBLIC_FILES = {'index.html', 'view.html'}
PUBLIC_DIRS = {'assets', 'animations', 'thumbs'}

# Fixed types: on Windows, Python reads them from the registry, which can map .js to
# text/plain - and with nosniff the browser then refuses to run the script.
TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.woff2': 'font/woff2',
}


def is_public(url_path):
    """True if the URL path points inside the public part of the site."""
    path = posixpath.normpath(urllib.parse.unquote(url_path))
    parts = [p for p in path.split('/') if p]
    if not parts:
        return True  # "/" -> index.html
    if any(p.startswith('.') for p in parts):
        return False
    if len(parts) == 1:
        return parts[0] in PUBLIC_FILES
    return parts[0] in PUBLIC_DIRS


class Handler(SimpleHTTPRequestHandler):
    server_version = 'SealAnimations'
    extensions_map = {'': 'application/octet-stream', **TYPES}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def send_head(self):
        path = self.path.split('?', 1)[0].split('#', 1)[0]
        if path == '/favicon.ico':
            self.send_response(204)
            self.end_headers()
            return None
        if not is_public(path):
            self.send_error(404)
            return None
        return super().send_head()

    def list_directory(self, path):
        self.send_error(404)
        return None

    def end_headers(self):
        # Browsers check for a newer file on each visit, so an update shows on reload.
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('X-Content-Type-Options', 'nosniff')
        super().end_headers()

    def log_message(self, format, *args):
        print(f'{self.address_string()} - {format % args}', flush=True)


def lan_address():
    """This computer's address on the network, found without sending anything."""
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as probe:
        try:
            probe.connect(('10.255.255.255', 1))
            return probe.getsockname()[0]
        except OSError:
            return None


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=DEFAULT_PORT, help=f'Port to listen on (default {DEFAULT_PORT})')
    parser.add_argument('--lan', action='store_true', help='Also reachable from other computers on the network (default: this computer only)')
    args = parser.parse_args()
    host = '0.0.0.0' if args.lan else '127.0.0.1'
    if not PAGE.exists():
        raise SystemExit(f'{PAGE} is missing.')
    server = ThreadingHTTPServer((host, args.port), Handler)
    print(f'Serving the animation library from {ROOT}. Press Ctrl+C to stop.', flush=True)
    print(f'  On this computer: http://localhost:{args.port}/', flush=True)
    if args.lan:
        for name in dict.fromkeys([socket.gethostname(), lan_address()]):
            if name:
                print(f'  On the network:   http://{name}:{args.port}/', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nStopped.')


if __name__ == '__main__':
    main()
