# Getting Started

In order to run this demo you must install [grpcwebproxy](https://github.com/improbable-eng/grpc-web/tree/master/go/grpcwebproxy) which requires [golang](https://golang.org/).

Once go is installed set your [`GOPATH`](https://github.com/golang/go/wiki/GOPATH) environment variable and add `$GOPATH/bin` to your `PATH`.

```
go get -u github.com/improbable-eng/grpc-web/go/grpcwebproxy
```

Make sure grpcwebproxy is available on the command line and run:
```
npm install
npm start
```

Start up https://localhost:3000 in your browser and you should be rolling!

**Note:** If you want to use your own ssl cert/key just overwrite `./server.crt` and `./server.key` in the root of this repo.

### Alternative Proxies / Websockets

If client to server streams are needed then `grpcwebproxy` isn't good enough (yet.) A proxy with websocket support would be better.

https://github.com/tmc/grpc-websocket-proxy
 * Existing websocket proxy, but doesn't play well with `grpc-web-client`.

https://github.com/MarcusLongmuir/grpc-web/tree/websockets
 * this would be preferred since it should work with `grpc-web-client`. Related issue: https://github.com/improbable-eng/grpc-web/issues/94
