<template>
    <v-snackbar
      v-model="show"
      :absolute="options.absolute"
      :top="options.top"
      :right="options.right"
      :bottom="options.bottom"
      :left="options.left"
      :timeout="options.timeout"
      :color="options.color"
      :multi-line="options.multi_line"
    >
        {{ options.msg }}
        <v-btn
            v-if="options.show_close"
            :color="options.close_text_color"
            text
            @click="show = false"
        ><v-icon>{{ options.close_text }}</v-icon></v-btn>
    </v-snackbar>
</template>

<script>
export default {
    name: "Toast",

    data: function() {
        return {
            show: true,
            options: {
                absolute: false,
                top: false,
                right: false,
                bottom: false,
                left: false,
                timeout: 3000,
                color: "",
                multi_line: false,
                msg: "提示"
            }
        }
    }
}
</script>
