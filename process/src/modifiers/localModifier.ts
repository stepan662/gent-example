import LocalModifier from 'gent-core/lib/tools/LocalModifier'
import CustomModifierInterface from './CustomModifierInterface'
import { JournalMutationType } from 'gent-core/lib/Types'

class Modifier extends LocalModifier implements CustomModifierInterface {
  async getJournalEntries(processId: string): Promise<JournalMutationType[]> {
    const result = this.data.journal.filter((mutation) => mutation.process_id === processId)
    result.reverse()
    return result
  }

  async getProcesses() {
    const result = [...this.data.process]
    result.reverse()
    return result
  }
}

export default Modifier
