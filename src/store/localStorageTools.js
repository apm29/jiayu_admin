const layoutKey = 'jiayu-mall-layout'
const initialLayout = {
  miniSide: false,
  showToolbar: true,
}
export default {

  getLayout: function () {

    try {
      return localStorage.getItem(layoutKey) ? JSON.parse(
        localStorage.getItem(layoutKey)) : initialLayout
    } catch (e) {
      return initialLayout
    }
  },

  setLayout: function (layout) {
    localStorage.setItem(layoutKey, JSON.stringify(layout))
  },

  setMiniSide: function (mini) {
    let layout = this.getLayout()
    layout.miniSide = mini
    this.setLayout({ ...layout })
  },

  setToolbar: function (show) {
    let layout = this.getLayout()
    layout.showToolbar = show
    this.setLayout({ ...layout })
  },
}
