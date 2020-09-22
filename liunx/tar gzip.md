### 目录

- 概念
  - 打包
  - 压缩
- 命令
  - tar
  - gzip
- 混合使用
- 总结

### 概念

#### 打包

**将多个文件或目录合成一个文件(如将各种零部件组装成一辆汽车)**

#### 压缩

**将一个文件通过算法变成一个较小的文件(如面包通过压缩变成...)**

### 命令

#### tar

**常用参数**

- -c 或--create 新包的名称
- -f 或--file 需要打包的名称(作为最后一个参数)
- -r 或--append 追加文件到 tar 包内
- -t 或--list 列出 tar 包内的文件目录
- -u 或--update 更新文件到 tar 包内
- -v 或--verbose 显示执行过程
- -x 或--extract 或--get 从 tar 包还原(解包)文件

**示例**

1. #tar -cf new.tar abc

   将目录文件夹 abc 打包为 new.tar

2. #tar -cf images.tar \*.png

   将所有的 png 后缀文件打包为 images.tar

3. #tar -rf new.tar a.txt

   将 a.txt 文件(增)追加到 new.tar 包内

4. #tar -rf images.tar \*.html

   将所有的 html 后缀的文件(增)追加到 images.tar 包内

5. #tar -tf new.tar

   列出 new.tar 包内文件目录

6. #tar -uf new.tar a.txt

   将 a.txt 文件更新到 new.tar 包内(覆盖包内之前存在的 a.txt 文件)

7. #tar -xf new.tar

   对 new.tar 进行解包

8. #tar -cvf new.tar abc

   将目录文件夹 abc 打包为 new.tar,并且显示执行过程

9. #tar -xvf new.tar

   对 new.tar 进行解包,并且显示执行过程

#### gzip

**gzip 只能压缩文件**

**常用参数**

- -c 或--stdout 或--to-stdout 压缩后的文件单独为.gz 后缀并且保留源文件(如果没有此参数则直接将源文件压缩为.gz 后缀)
- -d 或--decompress 或----uncompress 　解开压缩文件
- -l 或--list 列出压缩文件的相关信息
- -v 或--verbose 显示执行过程

**示例**

1. #gzip \*

   压缩当前目录下所有文件,这里会把目录下所有文件进行单独压缩,并且直接将源文件压缩为.gz 后缀

2. #gzip -c index.html > index.html.gz

   压缩 index.html 文件,压缩后名为 index.html.gz,并且保留源文件

   这里注意一点压缩后的名字最好是源文件后缀+.gz 后缀,如 a.png > xx.png.gz; b.txt >xx.txt.gz 方便后期解压(如果是 a.gz 或 b.gz 则解压出来的文件没有后缀)

3. #gzip -d index.html.gz

   解压 index.html.gz 文件

4. #gzip -l index.html.gz

   列出压缩文件的相关信息

5. #gzip -v index.html

   压缩时显示执行过程

6. #gzip -cv index.html > index.html.gz

   压缩时显示执行过程

7. #gzip -dv index.html.gz

   解压时显示执行过程

### 混合使用

在打包的同时进行压缩文件

1. #tar -zcvf dist.tar.gz dist

   - 第一步 -cvf 对 dist 目录进行打包,包名为 dist.tar
   - 第二部 -z 调用 gzip 对 dist.tar 包进行压缩,生成一个 dist.tar.gz 后缀的压缩文件

2. #tar -zxvf dist.tar.gz

   对 dist.tar.gz 压缩文件进行解压包

### 总结

以上就是目前对 `tar` `gzip`的使用理解,还望多多指教.
