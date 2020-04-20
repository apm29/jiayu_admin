<template>
    <v-row class="markdown-editor">
        <v-col
                :cols="6"
                v-if="!preview"
        >
            <v-textarea
                    name="markdown"
                    label="Markdown"
                    v-model="text"
                    auto-grow
                    outlined
                    hint="markdown text"
            ></v-textarea>
        </v-col>
        <v-divider v-if="!preview"></v-divider>
        <v-col
                :cols="preview?12:6"
                :class="{ ['pl-3']: this.$vuetify.breakpoint.smAndUp }"
        >
            <v-select
                    :items="items"
                    label="Preview"
                    v-model="type"
                    v-if="!preview"
            ></v-select>
            <v-textarea
                    v-if="type === 'htmlSource'"
                    :value="compiledMarkdown"
                    auto-grow
                    filled
            ></v-textarea>
            <div
                    v-else
                    class="pa-2"
                    v-html="compiledMarkdown"
            ></div>
        </v-col>
    </v-row>
</template>

<script>
  import 'highlight.js/styles/default.css'
  import marked from 'marked'
  import hljs from 'highlight.js'
  import 'highlight.js/styles/atom-one-dark.css';
  const rendererMD = new marked.Renderer()
  const highlightCode = () => {
    const preEl = document.querySelectorAll('pre')
    preEl.forEach((el) => {
      hljs.highlightBlock(el)
    })
  }
  marked.setOptions({
    renderer: rendererMD,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    highlight (code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(lang, code, true).value
      }
      return hljs.highlightAuto(code).value
    },
  })
  export default {
    name: 'MarkdownEditor',
    props: {
      value: {
        type: String,
        default: '',
      },
      preview: {
        type: Boolean,
        default: false,
      },
    },
    data () {
      return {
        type: 'preview',
        items: [
          {
            text: 'Preview',
            value: 'preview',
          },
          {
            text: 'HTML Source',
            value: 'htmlSource',
          },
        ],
        text: this.value,
      }
    },

    watch: {
      text: {
        immediate: true,
        handler: function (val) {
          this.$emit('change', val)
        },
      },
      value: {
        immediate: true,
        handler: function (val) {
          this.text = val
        },
      },
    },

    computed: {
      compiledMarkdown () {
        return marked(this.text)
      },
    },
    mounted () {
      highlightCode()
    },

    updated () {
      highlightCode()
    }
  }
</script>
<style>
    .v-application .markdown-editor code{
        background-color: #282c34;
        elevation: 0;
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2), 0 0 0 0 rgba(0, 0, 0, 0.14), 0 0 0 0 rgba(0, 0, 0, 0.12)
    }
</style>
