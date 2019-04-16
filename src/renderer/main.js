import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import App from './App'
import router from './router'
import store from './store'

import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/default.css'
const VueUploadComponent = require('vue-upload-component')

import 'diff2html/dist/diff2html.min.css'

import '@/icons' // icon
import '@/permission' // permission control

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.use(ElementUI, { locale })
Vue.use(VueHighlightJS)
Vue.component('file-upload', VueUploadComponent)
Vue.config.productionTip = false

new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
