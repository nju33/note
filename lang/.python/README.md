doc[#](https://www.python.org/dev/peps/pep-0008/)

### 実行タイプ

実行元なら

```python
__name__ == '__main__'
```

### path

#### cwd

```python
os.getcwd()
```

#### rel

cwdから？

```python
# relative path until current file
__file__
```

#### abs

```python
import os
os.path.realpath(__file__)
# ちなみにdir
os.path.dirname(os.path.realpath(__file__))
```


### 環境変数

os.environに配列で入ってる

```python
import os
os.environ[...]
```

でも以下を使ったほうがいい

```python
os.environ.get('POST') # 無かったら `KeyError`
os.getenv('POST', 3333) # たぶんよく使う
```
