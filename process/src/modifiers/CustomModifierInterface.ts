import { ModifierType, ProcessStateType } from 'gent-core/lib/Types'

export default interface CustomModifierInterface extends ModifierType {
  getProcesses(): Promise<ProcessStateType[]>
}
