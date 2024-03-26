var host = 'localhost'
// Listen on a specific port via the PORT environment variable
var port = 1234

import cors_proxy from 'cors-anywhere'

cors_proxy.createServer({}).listen(port, host, function () {
  console.log('Running CORS Anywhere on ' + host + ':' + port)
})
