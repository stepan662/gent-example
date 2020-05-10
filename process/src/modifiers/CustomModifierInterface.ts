import { ModifierType, ProcessStateType, JournalMutationType } from 'gent-core/lib/Types'

export default interface CustomModifierInterface extends ModifierType {
  getProcesses(): Promise<ProcessStateType[]>
  getJournalEntries(processId: string): Promise<JournalMutationType[]>
}
