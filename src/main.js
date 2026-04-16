import { createApp } from 'vue'
import App from './App.vue'
import FooterInformation from './FooterInformation.vue'
import CustomResource from './CustomResource.vue'

createApp(App).mount('#app')
createApp(CustomResource).mount('#customResource')
createApp(FooterInformation).mount('#footerInformation')