### 停止中のimage全削除

```bash
docker rm $(docker ps -aq)
```

### mysqlでenvironmentの設定したのに反映されない

- 一旦`rm`する[#](https://github.com/docker-library/mysql/issues/51#issuecomment-76989402)
