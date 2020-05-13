<template>
    <v-list>
        <v-list-item v-for="(directory,index) of directories" :key="index+'dir'" @click="loadNextDir(directory)">
            <v-list-item-icon>
                <v-icon>mdi-folder-open</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{directory}}</v-list-item-title>
        </v-list-item>
        <v-list-item v-for="(file,index) of files.filter(e=>e!=='images/')" :key="index+'file'">
            <v-list-item-icon>
                <v-icon>
                    mdi-file-image
                </v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{file}}</v-list-item-title>
        </v-list-item>
    </v-list>
</template>

<script>
  export default {
    name: 'VFileBrowser',
    data: function () {
      return {
        files: [],
        directories: [],
        currentDirectory: 'images/',
        selectedFiles: [],
      }
    },
    model: {
      prop: 'show',
    },
    mounted () {
      this.getDirectoryInfo()
    },
    methods: {
      loadNextDir:function(dir){
        this.currentDirectory = dir
        this.getDirectoryInfo()
      },
      getDirectoryInfo: async function () {
        try {
          let res = await this.$remote.post({
            url: '/files/list',
            data: {
              dirName: this.currentDirectory,
            },
          })
          this.files = res.Data.files
          this.directories = res.Data.directories
        } catch (e) {
          console.log(e)
        }
      },
    },
  }
</script>

<style scoped>

</style>
