from http.server import HTTPServer, BaseHTTPRequestHandler

class RedirectHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # 重定向到目标URL
        self.send_response(301)
        self.send_header('Location', 'http://tvconnect.click/')
        self.end_headers()
        
    def do_POST(self):
        # 对POST请求也进行重定向
        self.send_response(301)
        self.send_header('Location', 'http://tvconnect.click/')
        self.end_headers()

    def log_message(self, format, *args):
        # 可选：禁用日志输出
        return

if __name__ == '__main__':
    server_address = ('', 81)
    httpd = HTTPServer(server_address, RedirectHandler)
    print('Starting redirect server on port 81...')
    httpd.serve_forever()