<template>
    <v-content>
        <v-container
                class="fill-height"
                fluid
        >
            <v-row
                    align="center"
                    justify="center"
            >
                <v-col
                        cols="12"
                        sm="8"
                        md="4"
                >
                    <v-card class="elevation-12">
                        <v-toolbar
                                color="primary"
                                dark
                                flat
                        >
                            <v-toolbar-title
                                    class="title white--text text--lighten-1 font-weight-medium"
                            >
                                管理员登录
                            </v-toolbar-title>
                            <v-spacer/>

                        </v-toolbar>
                        <v-card-text>
                            <v-form>
                                <v-text-field
                                        label="账户"
                                        name="login"
                                        v-model="form.username"
                                        prepend-icon="mdi-account"
                                        type="text"
                                />

                                <v-text-field
                                        id="password"
                                        label="密码"
                                        name="password"
                                        v-model="form.password"
                                        prepend-icon="mdi-textbox-password"
                                        type="password"
                                />
                                <div class="d-flex flex-row align-center">
                                    <v-text-field
                                            id="code"
                                            label="验证码"
                                            name="code"
                                            v-model="form.code"
                                            class="flex-grow-1"
                                            prepend-icon="mdi-android-messages"
                                    />
                                    <v-countdown-button :send-captcha="sendCaptcha"/>
                                </div>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer/>
                            <v-btn color="primary" @click="login">登录</v-btn>
                        </v-card-actions>

                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-content>
</template>

<script>
  import VCountdownButton from '@/components/button/VCountdownButton'
  export default {
    name: 'Login',
    components: { VCountdownButton },
    data: function () {
      return {
        form: {
          username: undefined,
          password: undefined,
          code: undefined,
          remember: false,
        },
      }
    },
    methods: {
      sendCaptcha: async function () {
        try {
          let res = await this.$remote.post({
            url: '/auth/captcha',
          })
          this.$notify({
            title: res.Msg,
            type: 'success',
          })
        } catch (e) {
          console.log(e)
          this.$notify({
            title:'发送失败',
            text:e,
            type:'error'
          })
        }

      },

      login: async function () {
        try {
          let res = await this.$remote.post({
            url: '/auth/login',
            data: this.form,
          })
          this.$notify({
            title: res.Msg,
            type: 'success',
          })
          let noRedirectQuery = { ...this.$route.query }
          delete noRedirectQuery.redirect
          let path = this.$route.query.redirect || '/'
          await this.$store.dispatch('login', res.Data)
          await this.$router.push({
            path: path,
            query: noRedirectQuery,
            replace: true,
          })
        } catch (e) {
          console.log(e)
          this.$notify({
            text: e,
            type: 'error',
          })
        }
      },
    },
  }
</script>

<style scoped>

</style>
