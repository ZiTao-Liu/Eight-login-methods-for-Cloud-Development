<template>
  <div class="block">
    <h1 class="title">会议管理系统登录</h1>
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="请输入邮箱">
        <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="请输入密码">
        <el-input
          placeholder="请输入密码"
          v-model="form.password"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即登录</el-button>
        <el-button type="success" @click="onasy">匿名登录</el-button>
        <el-button type="success" @click="onWechat">微信公众号登录</el-button>
        <el-button type="success" @click="onWechatopen">微信开放平台登录</el-button>
        <el-button @click="onRegister">注册</el-button>
      </el-form-item>
    </el-form>
       <h1 class="title">会议管理系统短信注册登录</h1>
    <el-form ref="form" :model="form1" label-width="120px">
      <el-form-item label="请输入手机号">
        <el-input v-model="form1.phone" placeholder="请输入手机号"></el-input>
        <el-button type="primary" @click="onsend" style="margin-top:10px">发送验证码</el-button>
      </el-form-item>
      <el-form-item label="请输入验证码">
        <el-input v-model="form1.yz" placeholder="请输入六位验证码"></el-input>
      </el-form-item>
      <el-form-item label="请输入密码">
        <el-input
          placeholder="密码长度不小于 8 位，不大于 32 位，需要包含字母和数字。"
          v-model="form1.password" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onmassSubmit">立即注册</el-button>
        <el-button type="success" @click="onmassligin">验证码登录</el-button>
        <el-button type="success" @click="onmaspas">密码登录</el-button>
      </el-form-item>
    </el-form>
    <h1 class="title">绑定用户名流程</h1>
    <el-form ref="form" :model="form2" label-width="120px">
      <el-form-item label="请输入用户名">
        <el-input v-model="form2.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit1">立即登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import cloudbase from "@cloudbase/js-sdk";
const app = cloudbase.init({
  env: "jh-9grhl97m0a465f8b"
});

export default {
  name: "login",
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      form1: {
        phone: "",
        yz: "",
        password: "",
      },
      form2: {
        email: "",
        password: "",
        username:""
      },
    };
  },
  methods: {
    onSubmit() {
      const app = this.$cloudbase;
      app
        .auth()
        .signInWithEmailAndPassword(this.form.email, this.form.password)
        .then((loginState) => {
          console.log(loginState)
          this.$message({
            message: "登录成功",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "请检查输入",
            type: "warning",
          });
        });
    },
    onSubmit1() {
      const auth1 = this.$cloudbase.auth();
      if(auth1.hasLoginState()){
        console.log("已经登录");
        console.log(auth1);
        if (!(auth1.isUsernameRegistered(this.form2.username))) {
          // 检查用户名是否绑定过
          console.log("没绑定");
          auth1.currentUser.updateUsername(this.form2.username); // 绑定用户名
        }else{
        console.log("绑定了");
      }
      }else{
        console.log("登录");
      }
        
    }, 
    onsend(){
      const app = this.$cloudbase;
      app
        .auth({
          persistence: "session",
        })
        .anonymousAuthProvider()
        .signIn()
        .then((res) => {
          console.log(res);
          this.$message({
            message: "登录成功",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "请检查输入" + err,
            type: "warning",
          });
        });
    },
    onasy() {
      const app = this.$cloudbase;
      app
        .auth({
          persistence: "session",
        })
        .anonymousAuthProvider()
        .signIn()
        .then((res) => {
          console.log(res);
          this.$message({
            message: "登录成功",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "请检查输入" + err,
            type: "warning",
          });
        });
    },
    onWechat(){
      const app = this.$cloudbase;
      const auth = app.auth();
      const provider = auth.weixinAuthProvider({
        appid: "wx5c659f94a22b928f",
        scope: "snsapi_userinfo",
      });
      async function login() {
        // 1. 建议登录前先判断当前是否已经登录
        const loginState = await auth.getLoginState();
        if (!loginState) {
          // 2. 调用微信登录API
          provider.getRedirectResult().then((loginState) => {
            if (loginState) {
              // 登录成功，本地已存在登录态
            } else {
              // 未登录，唤起微信登录
              provider.signInWithRedirect();
            }
          });
        }
      }
      login();
    },
     onWechatopen() {
      const app = this.$cloudbase;
      const auth = app.auth();
      const provider = auth.weixinAuthProvider({
        appid: "wx5c659f94a22b928f",
        scope: "snsapi_login",
      });
      async function login() {
        // 1. 建议登录前先判断当前是否已经登录
        const loginState = await auth.getLoginState();
        if (!loginState) {
          // 2. 调用微信登录API
          provider
            .getRedirectResult()
            .then((loginState) => {
              if (loginState) {
                // 登录成功，本地已存在登录态
              } else {
                // 未登录，唤起微信登录
                provider.signInWithRedirect();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
      login();
    },
    onRegister() {
      const app = this.$cloudbase;
      app
        .auth()
        .signUpWithEmailAndPassword(this.form.email, this.form.password)
        .then((res) => {
          this.$message({
            message: "注册成功",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "请检查输入",
            type: "warning",
          });
        });
    },
       onmassSubmit() {
      const app = this.$cloudbase;
      app
        .auth()
        .signUpWithPhoneCode(
          this.form1.phone,
          this.form1.yz,
          this.form1.password
        )
        .then(() => {
          this.$message({
            message: "注册成功",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "err",
            type: "warning",
          });
        });
    },
    onmassligin(){
        const app = this.$cloudbase;
        app
            .auth()
            .signInWithPhoneCodeOrPassword({
            phoneNumber: this.form1.phone,
            phoneCode: this.form1.yz
        })
        .then(() => {
          this.$message({
            message: "登录成功",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "err",
            type: "warning",
          });
        });
    },
    onmaspas(){
        const app = this.$cloudbase;
        app
            .auth()
            .signInWithPhoneCodeOrPassword({
            phoneNumber: this.form1.phone,
            password: this.form1.password
        })
        .then(() => {
          this.$message({
            message: "登录成功",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "err",
            type: "warning",
          });
        });
  },
  },
};
</script>

<style scoped>
.block {
  width: 40%;
  margin: 50px auto;
}
.title {
  margin-left: 30px;
  border-left: 5px solid rgb(3, 89, 202);
  padding-left: 10px;
}
</style>