# WLB Backend

Optional server for WLB tool.

## Dev

Requirements:

* JDK 21
* sbt
* docker

Set `JAVA_HOME` to JDK 21.

macOS:
```shell
export JAVA_HOME=`/usr/libexec/java_home -v21`
```

Run:

```shell
API_HOST=127.0.0.1 sbt server/run
```

API: http://127.0.0.1:53404

## Build

```shell
sbt docker:publishLocal
```
