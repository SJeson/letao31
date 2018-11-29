// 进度条基本使用
// 只用到进度条的开始和结束

// 需求：
// 第一个ajax发送的时候，开启进度条
// 等待所有的ajax都完成后，关闭进度条

// ajax全局事件
// 当页面发送ajax请求的时候，开启进度条，当第一ajax发送的时候就开启进度条
// 等待所有的ajax都完成后，关闭进度条
// 这里需要一个ajax全局事件，共有六个事件
// ajaxComplate()  // 每个ajax完成时调用不论成功还是失败都会调用）
// ajaxSuccess()  //每个ajax只要成功了就会调用
// ajaxError()   //每个ajax，只要失败了就会调用
// ajaxSend()   //在每个ajax发送之前调用
// ajaxStart() //在第一个ajax开启之前调用
// ajaxStop() //在所有的ajax请求都完成的时候调用
$(document).ajaxStart(function(){
  // 这里的N和P都是大写
  NProgress.start();//开启进度条
})
$(document).ajaxStop(function(){
   setTimeout(function(){
    //  关闭进度条
    NProgress.done();
    // 这里的500毫秒是模拟网络延迟，平时不需要加
   },500)
})
