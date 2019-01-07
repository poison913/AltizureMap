/**
 * 启用webworker的样例
 */

const ctx: Worker = self as any;

// Post data to parent thread
// ctx.postMessage({ foo: "foo" });

// Respond to message from parent thread
// ctx.addEventListener("message", (event) => console.log(event));

/**
 * 信息传递方法
 */
ctx.onmessage = (event) => {
  // tslint:disable-next-line:no-console
  console.log(event.data);
  doSomething(event.data.json, event.data.gs);
};

/**
 * 异步执行函数
 * @param json 输入参数：数据
 * @param gs 输入参数：相对参考系
 */
function doSomething(json: any, gs: any) {
  ctx.postMessage('work done!');
}
