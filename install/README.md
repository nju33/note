### nodejs

```bash
# (nodejs yarn) install
brew install node yarn
yarn global add n
# stable version install
n stable
```

### php

```bash
brew tap homebrew/homebrew-php
brew install php71 composer
brew link --overwrite composer
php --version | head -n 1; composer --version
```

### rust
```bash
# (rustup rustc cargo) install
curl https://sh.rustup.rs -sSf | sh
# cargo-{watch,edit} install
for c in watch edit script; do cargo install cargo-${c}; done
```

#### rust-script

- [cargoified](http://qiita.com/woxtu/items/ab8be6a93237346e8aff#%E4%BE%9D%E5%AD%98%E3%81%99%E3%82%8B)

### python3

```bash
brew install python3
```

### siegu

```bash
brew install siege
```
