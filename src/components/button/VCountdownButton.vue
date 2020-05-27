<template>
    <v-btn small text color="primary" @click="doSend" :disabled="disabled">{{disabled?countdown:label}}</v-btn>
</template>

<script>
  export default {
    name: 'VCountdownButton',
    props: {
      sendCaptcha: {
        type: Function,
        default: function () {

        },
      },
      duration: {
        type: Number,
        default: 30,
      },
      label: {
        type: String,
        default: '发送验证码',
      },
    },
    data: function () {
      return {
        disabled: false,
        count: this.duration,
        timer: undefined,
      }
    },
    computed: {
      countdown: function () {
        return `${('0' + this.count).slice(-2)}(s)`
      },
    },
    destroyed () {
      clearTimeout(this.timer)
    },
    methods: {
      doSend: async function () {
        try {
          this.disabled = true
          await this.sendCaptcha()
          await this.startCountdown()
        } catch (e) {
          console.log(e)
        } finally {
          this.disabled = false
        }
      },
      startCountdown: async function () {
        for (this.count = this.duration; this.count > 0; this.count--) {
          await this.$delay(1000)
        }
      },
    },
  }
</script>

<style scoped>

</style>
