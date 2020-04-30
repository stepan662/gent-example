import b from 'gent-core/lib/NodeBuilder'
import * as n from 'gent-core/lib/Node'
import Process from 'gent-core/lib/Process'

const [start, userTask] = b.connect(
  n.start({
    name: 'Process start',
  }),
  n.taskUser({
    id: 'userTask',
    name: 'User task',
    resolve: async (data) => {
      return data
    },
  }),
)

const manualOrAuto = userTask.connect(
  n.exclusive({
    name: 'Manual or auto?',
    decide: (results) => {
      return results.userTask.type
    },
  }),
)

const auto = manualOrAuto.connect(
  n.taskSystem({
    id: 'auto',
    name: 'Auto',
    exec: () => {
      return new Promise((resolve) => setTimeout(resolve, 5000))
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

const end = auto.connect(n.end({ id: 'end', name: 'End' }))
manual.connect(end)

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
