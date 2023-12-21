import { App, Plugin } from 'vue'
import { version } from './version'

export default function makeInstaller(components: Plugin[] = []) {
  const install = (app: App) => {
    components.forEach(component => app.use(component))
  }
  return {
    install,
    version
  }
}
