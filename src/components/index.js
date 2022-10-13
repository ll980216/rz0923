import PageTools from '@/components/PageTools'
import UploadExcel from '@/components/UploadExcel'
const components = [PageTools, UploadExcel]
export default {
  install: function(Vue) {
    components.forEach(ele => {
      console.log(ele)
      Vue.component(ele.name, ele)
    })
  }
}

