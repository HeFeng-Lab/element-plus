import Components from './components'
import makeInstaller from './make-installer'
import plugins from './plugins'

export default makeInstaller([...Components, ...plugins])
