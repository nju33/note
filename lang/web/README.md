### nodejs

#### koa vs micro

- koaはclusterで並行処理できる、microはmicro-clusterみたいなのはあるけどよく分からん（なんかIssue立ってるので対応するかも）
- koaのほうがいろんな拡張パッケージがある
- ssrの結果返すとかだけならmicroが簡単そう

#### 負荷テスト

```bash
siege -c100 -t60s <url>
# brew install seigo
```

##### yarn koa

```
Transactions:                  11602 hits
Availability:                 100.00 %
Elapsed time:                  59.04 secs
Data transferred:               0.10 MB
Response time:                  0.26 secs
Transaction rate:             196.51 trans/sec
Throughput:                     0.00 MB/sec
Concurrency:                   50.38
Successful transactions:       11602
Failed transactions:               0
Longest transaction:            1.14
Shortest transaction:           0.01

Transactions:                  13578 hits
Availability:                 100.00 %
Elapsed time:                  59.68 secs
Data transferred:               0.12 MB
Response time:                  0.19 secs
Transaction rate:             227.51 trans/sec
Throughput:                     0.00 MB/sec
Concurrency:                   42.61
Successful transactions:       13578
Failed transactions:               0
Longest transaction:            0.49
Shortest transaction:           0.01
```

##### yarn koa-cluster

```
Lifting the server siege...
Transactions:                  16209 hits
Availability:                 100.00 %
Elapsed time:                  59.06 secs
Data transferred:               0.14 MB
Response time:                  0.11 secs
Transaction rate:             274.45 trans/sec
Throughput:                     0.00 MB/sec
Concurrency:                   31.11
Successful transactions:       16209
Failed transactions:               0
Longest transaction:            0.63
Shortest transaction:           0.00

Transactions:                  19074 hits
Availability:                 100.00 %
Elapsed time:                  59.74 secs
Data transferred:               0.17 MB
Response time:                  0.06 secs
Transaction rate:             319.28 trans/sec
Throughput:                     0.00 MB/sec
Concurrency:                   19.58
Successful transactions:       19074
Failed transactions:               0
Longest transaction:            0.54
Shortest transaction:           0.00
```

### rust

>
> 2017.05
> rocket v0.2 と serde v1 の相性が悪いのでgithubから入れる
> と直ると思ったが、これもだめだった
>

#### ファイルの実行

```bash
?[RUST_LOG={error,info,debug}] cargo watch -x 'run --example <example-name>'
```

- [env_logger - doc](http://rust-lang-nursery.github.io/log/env_logger/)

#### iron vs rocket

- rocketは最初からログ綺麗、ironは色々調べる必要ある
- rocketのほうがモダン
- ironは最小(nodeのmicroな感じ)
- rocketのdoc見やすい（でかい）
- ROCKET_ENVで環境を変えれる[#](https://rocket.rs/guide/overview/#configuration-file)
- rocketは仕様が安定してるかは不明

### python

ファイル名とフレームワークを一緒にしちゃうと、`ImportError` になっちゃうので先頭に`_`をつける

#### Flask

doc[#](http://flask.pocoo.org/docs/0.12/)

- ログ付き

### php

#### Laradock

やっぱやめ

[#](http://laradock.io/)

#### laravel

##### laraedit/laraedit

[#](https://hub.docker.com/r/laraedit/laraedit/)

```bash
# composer global require "laravel/installer=~1.1"
composer create-project laravel/laravel <project-name> --prefer-dist
docker-compose up -d laravel
open http://localhost
```

##### .

なんか日本語docの内容が古い

---

### mysql接続

- flagと値の間にスペースを挟まない
- localhost -> 0.0.0.0

```bash
mysql -h0.0.0.0 -P3307 -uroot -ppass
```
