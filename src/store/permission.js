/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param pathList
 */
function filterAsyncRouter (routes, pathList) {
  const res = []

  routes.forEach(route => {
    const routeInfo = { ...route }
    if (routeInfo.children) {
      routeInfo.children = filterAsyncRouter(routeInfo.children, pathList)
      if (routeInfo.children && routeInfo.children.length > 0) {
        res.push(routeInfo)
      }
    } else {
      if (hasPermission(pathList, routeInfo)) {
        res.push(routeInfo)
      }
    }
  })

  return res
}

function hasPermission (pathList, routeInfo) {
  return pathList.findIndex(p => p === routeInfo.path) >= 0
}

export default filterAsyncRouter
