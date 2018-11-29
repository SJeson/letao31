$(function () {
  
  // 进行表单校验配置
  // 校验要求：1.用户名不能为空，长度为2~6位
  // 2.密码不能为空，长度为6~12位
  //  $('#form')后面直接写.插件名。在里面配置用户名和密码的校验
  $('#form').bootstrapValidator({
    // 这里的 $('#form')是获取到form表单，在form表单上先加一个id="form"
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    // excluded: [':disabled', ':hidden', ':not(:visible)'],
    // 2.指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    // 配置校验字段，给两个input加上name属性 ，name="username" name="password",发送给后台接收
    // fields表示配置多个字段，fields后面指定的并不是一个数组，而是一个对象
    fields: {

      //  用户名和密码之间没有顺序，所以fields后面指定的并不是一个数组，而是一个对象

      // 校验用户名，对应input表单的name属性
      username: {
        //validators是校验规则
        validators: {
          // 用户名不能为空（非空校验）
          // 这里的非空是大写
          notEmpty: {
            message: '用户名不能为空'
          },
          //长度校验
          // 长度校验是大写
          stringLength: {
            min: 2,
            max: 6,
            message: '用户名长度必须在2到6之间'
          },
          // 自定义的校验规则，callback用来配置输出信息
          callback:{
            message:"用户名不存在"
          }
        }
      },

      // 校验密码 
      password: {
        //  校验规则
        validators: {
          notEmpty: {
            message: "请输入密码"
          },
          // 长度校验
          stringLength: {
            min: 6,
            max: 12,
            message: '密码长度必须是6到12位'
          },
      // 这里需要设置自定义校验规则,callback专门用来配置回调的message
      callback:{
        message:"密码错误"
      }
        }
      }
    }
  })

  // 这里存在一个问题：当点击登录按钮的时候，页面会进行跳转，但是同时用户信息也会拼接在浏览器的地址栏上面。需要阻止按钮的跳转事件。如果将这个按钮换成普通按钮，校验就会消失，但是用submit按钮的话，点击之后页面会进行跳转，并且提交到了当前页，用户信息也会拼接在浏览器的地址栏上面。需要注册表单验证成功事件。表单校验成功时，会触发success.form.bv事件，此时会提交表单，这时候，通常我们需要禁止表单的自动提交，使用ajax进行表单的提交。
  // 校验成功后会触发一个事件，表单校验成功事件，默认是会提交表单的，页面就跳转了，需要注册表单校验成功事件，在成功事件中，阻止默认的提交，通过ajax来提交


  // 这里的success.form.bv事件是bootstrap自己定义的
  $('#form').on('success.form.bv', function (e) {
    // 通过e.preventDefault()阻止默认的提交
    e.preventDefault();
    // 不建议用return false 没有语义性，下面的代码不会执行

    console.log("默认的表单提交被阻止了，通过ajax来提交")
    //  当点击登录按钮之后，会给后台发送一个ajax请求，后台获取到传递过去的用户名和密码，进行校验，并且会返回提示，提示当前用户名错误或者密码错误。
    // 去接口文档中找对应的要求
    $.ajax({
      type: "post",
      dataType: 'json',
      //  这里的接口地址如果没有带任何东西，表示默认是本地。后台给什么地址，就用什么地址。
      url: "/employee/employeeLogin",
      //  表单序列化，是一次性收集当前的表单数据，将收集到的数据用&拼接起来
      data: $('#form').serialize(),
      success: function (info) {
        console.log(info);
        
        // 这里进行判断
        if (info.error === 1000) {
          // 用户名不存在
          // alert('用户名不存在')
          // message:'用户名不存在'
          // 更新当前input的状态
          // 使用bootstrapValidator的API里的updateStatus（）方法来更新。$('#form').data("bootstrapValidator").updateStatus("username","INVALID");
          // updateStatus(field*,status*,validator),前两个参数带星号是必须要写的，
          // 参数一：field是一个字段，
          // 参数二：status是状态，状态又分很多，未校验（NOT_VALIDATED)，校验中(VALIDATING),校验失败的(INALID),校验成功的（VALID）.
          // 参数三：validator是校验规则，用来配置输出的提示信息
          $('#form').data("bootstrapValidator").updateStatus("username","INVALID","callback")

          return
        }

        if (info.error === 1001) {
          // 密码错误
          // alert('密码错误')
          $('#form').data("bootstrapValidator").updateStatus("password","INVALID","callback")

          return
        }

        if (info.success) {
          // 登录成功
          location.href = "index.html"
        }
        // 注意这里的按钮是submit按钮，但是点击按钮之后需要注册一个表单校验成功事件，当校验成功的时候，需要阻止跳转，发送ajax请求，后台获取到传递过去的信息，之后进行判断，然后将信息返回给用户
      }

    })

  })

  // 重置按钮，当点击重置按钮之后，需要将输入框中的内容和样式全部清除掉，


// 获取插件实例
// $('#form').data('bootstrapValidator')打印之后，创建了插件实例
// 构造函数创建了实例之后，所有的方法在其原型上面，-proto-里面有resetForm:ƒ (b)方法，可以重置表单，resetFrom传的值是boolean值，首先通过 $('#form').data('bootstrapValidator')创建插件实例，然后通过resetForm:ƒ (b)方法重置表单。即：
// $('#form').data('bootstrapValidator').resetForm:ƒ ()这里如果不传true的话，就是只把表单状态重置，内容不重置。传true进去，状态和内容都会重置。但是也可以不传true，因为点击重置按钮，内容就会清空。
// 重置功能
$('[type="reset"]').click(function(){
// resetForm(boolean);
// reesetForm();如果不传参数，只重置状态
// reesetForm(true);如果传参数，状态和内容都会重置
$('#form').data('bootstrapValidator').resetForm(true)

})


})