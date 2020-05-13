<template>
    <div>
        <v-container class="fill-height">
            <v-row
                    align="center"
                    justify="center"
            >
                <v-btn
                        color="pink"
                        dark
                        @click.stop="showDrawer = !showDrawer"
                >
                    Toggle
                </v-btn>
            </v-row>
        </v-container>
        <v-bottom-sheet v-model="showDrawer">
            <v-file-browser v-model="showDrawer"></v-file-browser>
        </v-bottom-sheet>
    </div>
</template>

<script>
  import VFileBrowser from '@/components/file/VFileBrowser'
  export default {
    name: 'GoodsManager',
    components: { VFileBrowser },
    data:function () {
        return {
          showDrawer:true
        }
    }
  }
</script>

<style scoped>

</style>
