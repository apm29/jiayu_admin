<template>
    <v-btn small text color="primary" @click="doSend" :disabled="waiting">{{waiting?countdown:label}}</v-btn>
</template>

<script>
  export default {
    name: 'VCountdownButton',
    props:{
      sendCaptcha:{
        type:Function,
        default:function () {

        }
      },
      duration:{
        type:Number,
        default:30
      },
      label:{
        type:String,
        default:'发送验证码'
      }
    },
    data:function(){
      return {
        waiting:false,
        count:this.duration,
        timer:undefined
      }
    },
    computed:{
      countdown:function () {
        return `${('0'+this.count).slice(-2)}(s)`
      }
    },
    destroyed(){
      clearTimeout(this.timer)
    },
    methods:{
      doSend: async function () {
        await this.sendCaptcha()
        this.startCountdown()
      },
      startCountdown:function () {
        this.waiting = this.count >= 0
        if(!this.waiting){
          this.count = this.duration
          return
        }
        this.count --
        this.timer = setTimeout(this.startCountdown,1000)
      }
    }
  }
</script>

<style scoped>

</style>
