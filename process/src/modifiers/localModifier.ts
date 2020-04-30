import LocalModifier from 'gent-core/lib/tools/LocalModifier'
import CustomModifierInterface from './CustomModifierInterface'

class Modifier extends LocalModifier implements CustomModifierInterface {
  async getProcesses() {
    const result = [...this.data.process]
    result.reverse()
    return result
  }
}

export default Modifier
