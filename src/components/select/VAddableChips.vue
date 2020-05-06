<template>
    <v-chip-group column>
        <v-chip
                class="flex-grow-0"
                v-for="(text,index) of results" :key="text+index"
                close
                @click:close="remove(text)"
        >
            {{text}}
        </v-chip>
        <v-text-field
                v-if="adding"
                autofocus
                outlined
                @keyup.enter="add"
                dense
                hide-details
                v-model="text"
                style="width: 100px;max-width:150px"
        >
        </v-text-field>
        <v-btn
                class="flex-grow-0 shrink"
                style="width: 100px"
                color="info"
                v-else
                @click="adding = true"
        >
            添加关键词
        </v-btn>
    </v-chip-group>
</template>

<script>
  export default {
    name: 'VAddableChips',
    props: {
      results: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    model: {
      prop: 'results'
    },
    data: function () {
      return {
        adding: false,
        text: '',
        chips: this.results || []
      }
    },
    methods: {
      remove: function (text) {
        this.chips.splice(this.chips.indexOf(text), 1)
        this.$emit('change', this.chips)
      },
      add: function () {
        if (this.chips.indexOf(this.text) >= 0) {
          this.adding = false
          return
        }
        this.chips.push(this.text)
        this.$emit('change', this.chips)
        this.text = ''
        this.adding = false
      }
    }
  }
</script>

<style scoped>

</style>
