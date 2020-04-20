# 设计思路

因为不同项目的上传方法都有不同的实现,有些需要传入验证参数,所以
将上传方法`upload`交给用户实现,`upload`方法需要返回一个Promise,类型为(直接同步返回也可以)
```js
{
  `${fileName}`:String,
  `${fileValue}`:String,
}
```
> 这里的`fileName`和`fileValue`就是props中定义的字段名,分别表示文件名称,文件url中的path
>`fileValue`也可以直接使用全路径,这是`fileBaseUrl`需要传入空字符串


