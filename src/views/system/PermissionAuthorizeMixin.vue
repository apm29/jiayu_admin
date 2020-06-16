<script>
  export default {
    name: 'PermissionAuthorizeMixin',
    data: function () {
      return {
        showAddMenu: false,
        showRolePermissionMenu: false,
        loadingRolePermissionMenu: false,
        role: undefined,
        rolePermission: [],
        permissions: [],
      }
    },
    methods:{
      editRolePermission: async function (role) {
        this.loadingRolePermissionMenu = true
        try {
          let resRolePermission = await this.$remote.post({
            url: '/authorization/permission/byRole',
            data: role,
          })
          this.rolePermission = resRolePermission.Data.map(p => p.id)
          let resAllPermission = await this.$remote.post({
            url: '/authorization/permission/getAsTree',
          })
          this.permissions = resAllPermission.Data
          this.role = role
        } catch (e) {
          this.$notify({
            text: e,
            type: 'error',
          })
        } finally {
          this.showRolePermissionMenu = true
          this.loadingRolePermissionMenu = false
          this.$forceUpdate()
        }
      },
      doAddRolePermission: async function () {
        this.loadingRolePermissionMenu = true
        try {
          let res = await this.$remote.post({
            url: '/authorization/roles/authorize',
            data: {
              role: this.role,
              permissions: this.rolePermission.map(id => {
                return {
                  id: id,
                }
              }),
            },
          })
          this.showRolePermissionMenu = false
          this.$notify({
            text: res.Msg,
            type: 'success',
          })
        } catch (e) {
          this.$notify({
            text: e,
            type: 'error',
          })
        } finally {
          this.loadingRolePermissionMenu = false
          this.$emit('role-reload')
        }
      },
    }
  }
</script>

<style scoped>

</style>
