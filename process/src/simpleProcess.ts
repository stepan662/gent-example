import b from 'gent-core/lib/NodeBuilder'
import * as n from 'gent-core/lib/Node'
import Process from 'gent-core/lib/Process'
import { SubtaskResult } from 'gent-core/lib/Subtask'
import { gentGetState, gentUpdateState } from 'gent-core/lib/Hooks'

const [start, usertask] = b.connect(
  n.start({
    name: 'Process start',
  }),
  n.taskUser({
    id: 'usertask',
    name: 'User task',
    resolve: async (data) => {
      return data
    },
  }),
)

const manualOrAuto = usertask.connect(
  n.exclusive({
    name: 'Manual or auto?',
    decide: (results) => {
      return results.usertask.type
    },
  }),
)

const auto = manualOrAuto.connect(
  n.taskSystem({
    id: 'auto',
    name: 'Auto',
    exec: () => {
      const counter = (gentGetState().counter || 0) + 1
      gentUpdateState({ counter })
      if (counter < 3) {
        return new SubtaskResult({
          delay: 1000,
          nextSubtask: 'exec',
        })
      } else {
        return 'done'
      }
    },
  }),
)

const manual = manualOrAuto.connect(
  n.taskUser({
    id: 'manual',
    name: 'Manual',
    resolve: (data) => {
      return data
    },
  }),
)

const secondTask = auto.connect(
  n.taskSystem({
    id: 'secondTask',
    name: 'Second task',
    exec: () => {
      console.log('Hello task 2')
    },
  }),
)
manual.connect(secondTask)
manual.connect(n.linkTimeout({ timeout: 30 }), secondTask)

secondTask.connect(n.end())

const simpleProcess = new Process(
  {
    id: 'simpleProcess',
    name: 'Simple process',
    init: (data) => {
      return data
    },
  },
  start,
)

export { start }
export default simpleProcess
