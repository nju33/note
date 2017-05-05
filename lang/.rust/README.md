### デバグ

```bash
rust-lldb <libname>
```

#### about rust-lldb

- [rustでデバッグ | 2016-06-19](http://byoma.hatenablog.com/entry/2016/06/19/224856)
- [Rustでライブラリのデバッグをする | 2015-11-12](http://qiita.com/rejasupotaro/items/e45fe64623ac7462e2a9)

### プラグイン

今の所(2017.04)nightlyだけ。`extern crate`とは別物。

```rust
#[feature(plugin)]
#[plugin(<plugin-name>)]

extern create ...
```

- [プラグイン](https://rust-lang-ja.github.io/the-rust-programming-language-ja/1.6/book/compiler-plugins.html)

### r""

[#](https://rust-lang-ja.github.io/the-rust-programming-language-ja/1.6/reference.html#raw-string-literals)
