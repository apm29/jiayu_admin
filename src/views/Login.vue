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
                            <v-toolbar-title>Login form</v-toolbar-title>
                            <v-spacer/>

                        </v-toolbar>
                        <v-card-text>
                            <v-form>
                                <v-text-field
                                        label="Login"
                                        name="login"
                                        v-model="form.username"
                                        prepend-icon="mdi-account"
                                        type="text"
                                />

                                <v-text-field
                                        id="password"
                                        label="Password"
                                        name="password"
                                        v-model="form.password"
                                        prepend-icon="mdi-textbox-password"
                                        type="password"
                                />
                                <div class="d-flex flex-row align-center">
                                    <v-text-field
                                            id="code"
                                            label="Code"
                                            name="code"
                                            v-model="form.code"
                                            class="flex-grow-1"
                                            prepend-icon="mdi-android-messages"
                                    />
                                    <v-btn small text color="primary" @click="sendCaptcha">Send Code</v-btn>
                                </div>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer/>
                            <v-btn color="primary" @click="login">Login</v-btn>
                        </v-card-actions>

                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-content>
</template>

<script>
  export default {
    name: 'Login',
    data:function(){
      return {
        form:{
          username:undefined,
          password:undefined,
          code:undefined,
          remember:false
        }
      }
    },
    methods:{
      sendCaptcha: async function () {
        try {
          let res = await this.$remote.post({
            url: '/auth/captcha'
          })
          this.$notify({
            title: res.Msg,
          });
        } catch (e) {
          console.log(e)
        }

      },

      login: async function () {
        try {
          let res = await this.$remote.post({
            url: '/auth/login',
            data: this.form
          })
          this.$notify({
            title: res.Msg,
          });
          let noRedirectQuery = {...this.$route.query}
          noRedirectQuery.redirect = undefined
          let path = this.$route.query.redirect || '/'
          await this.$router.push({
            path: path,
            query:noRedirectQuery,
            replace:true
          })
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
</script>

<style scoped>

</style>
