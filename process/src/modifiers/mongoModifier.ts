import {
  ModifierType,
  ProcessStateType,
  JournalMutationType,
  ProcessNotifierType,
  ProcessNotifierFilterType,
} from 'gent-core/lib/Types'
import { MongoClient, ObjectId } from 'mongodb'

const DB_NAME = 'test'
const JOURNAL_COLLECTION_NAME = 'journal'
const PROCESS_COLLECTION_NAME = 'process'
const QUEUE_COLLECTION_NAME = 'queue'

function serializeJournal(data) {
  return {
    ...data,
    prev_values: JSON.stringify(data.prev_values),
  }
}

function deserializeJournal(data) {
  return {
    ...data,
    prev_values: JSON.parse(data.prev_values),
  }
}

class Modifier implements ModifierType {
  client: MongoClient
  constructor(client: MongoClient) {
    this.client = client
  }

  private mapId = ({ _id, ...other }): any => ({ id: _id, ...other })

  async createProcess(state: ProcessStateType) {
    const data = { ...state }
    delete data.id
    const response = await this.client
      .db(DB_NAME)
      .collection(PROCESS_COLLECTION_NAME)
      .insertOne(data)
    return this.mapId(response.ops[0])
  }

  async updateProcess(process: ProcessStateType) {
    return (
      await this.client
        .db(DB_NAME)
        .collection(PROCESS_COLLECTION_NAME)
        .findOneAndUpdate(
          { _id: new ObjectId(process.id) },
          { $set: process },
          { returnOriginal: false },
        )
    ).value
  }

  async getProcess(processId: string): Promise<ProcessStateType> {
    return this.mapId(
      await this.client
        .db(DB_NAME)
        .collection(PROCESS_COLLECTION_NAME)
        .findOne({ _id: new ObjectId(processId) }),
    )
  }

  async getProcesses(): Promise<ProcessStateType[]> {
    return (
      await this.client
        .db(DB_NAME)
        .collection(PROCESS_COLLECTION_NAME)
        .find({})
        .sort([['_id', -1]])
        .limit(30)
        .toArray()
    ).map(this.mapId)
  }

  async addJournalEntry(changes: JournalMutationType) {
    return (
      await this.client
        .db(DB_NAME)
        .collection(JOURNAL_COLLECTION_NAME)
        .insertOne(serializeJournal(changes))
    ).ops[0]
  }

  async getJournalEntries(processId: string): Promise<JournalMutationType[]> {
    return (
      await this.client
        .db(DB_NAME)
        .collection(PROCESS_COLLECTION_NAME)
        .find({ process_id: processId })
        .toArray()
    ).map(deserializeJournal)
  }

  async addNotifier(notifier: ProcessNotifierType): Promise<void> {
    await this.client.db(DB_NAME).collection(QUEUE_COLLECTION_NAME).insertOne(notifier)
  }

  async getAndDeleteNotifier(
    options: ProcessNotifierFilterType,
  ): Promise<ProcessNotifierType | null> {
    const { active, ...search }: any = options
    if (active) {
      search.$or = [{ deploy_time: null }, { deploy_time: { $lte: Date.now() } }]
    }

    const response = await this.client
      .db(DB_NAME)
      .collection(QUEUE_COLLECTION_NAME)
      .findOneAndDelete(search)

    return response.value
  }
}

export default Modifier
