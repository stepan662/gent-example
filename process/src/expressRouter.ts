import * as express from 'express'
import Automat from 'gent-core/lib/Automat'
import { Subtask } from 'gent-core/lib/Subtask'
import CustomModifierInterface from './modifiers/CustomModifierInterface'
import { revertState } from 'gent-core/lib/Journal'

const asyncHandler = (
  func: (req: express.Request, res: express.Response) => Promise<void> | void,
) => {
  return async (req, res, next) => Promise.resolve(func(req, res)).catch((e) => next(e))
}

export const createRouter = (worker: Automat, customModifier: CustomModifierInterface) => {
  const handleAsync = (taskId, subtaskId) => async (req, res) => {
    const processId = req.query.id
    const result = await worker.runAsyncSubtask(processId, taskId, subtaskId, [req.body])
    res.send(result.state)
  }

  const handleRead = (taskId, subtaskId) => async (req, res) => {
    const processId = req.query.id
    const result = await worker.runReadSubtask(processId, taskId, subtaskId, [req.body])
    res.send(result)
  }

  // setup router
  const router = express.Router()

  router.get(
    '/schema',
    asyncHandler(async (req, res) => {
      res.send(worker.process.getSchema())
    }),
  )

  router.post(
    '/start',
    asyncHandler(async (req, res) => {
      const state = await worker.initProcess(req.body)
      res.send(state)
    }),
  )

  router.get(
    '/state',
    asyncHandler(async (req, res) => {
      const id = req.query.id as string
      const state = await customModifier.getProcess(id)
      res.send(state)
    }),
  )

  router.get(
    '/processes',
    asyncHandler(async (req, res) => {
      const processes = await customModifier.getProcesses()
      res.send({
        payload: processes,
      })
    }),
  )

  router.get(
    '/journal',
    asyncHandler(async (req, res) => {
      const id = req.query.id as string
      const state = await customModifier.getProcess(id)
      if (!state) {
        res.status(404).send()
      }
      const journal = await customModifier.getJournalEntries(id)
      const history = []
      let lastState = state
      for (const event of journal) {
        history.push({
          id: event.id,
          timestamp: event.timestamp,
          message: event.message,
          state: lastState,
        })
        const newState = revertState(lastState, event)
        lastState = newState
      }

      res.send(history)
    }),
  )

  // only tasks with custom id are acessible from outside
  const tasks = worker.process.nodes.filter((n) => n.type === 'task' && n.id)

  for (const task of tasks) {
    for (const [subtaskId, subtask] of Object.entries(task)) {
      if (subtask instanceof Subtask) {
        const path = `/task/${task.id}/${subtaskId}`
        if (subtask.type === 'read') {
          router.get(path, asyncHandler(handleRead(task.id, subtaskId)))
        } else if (subtask.type === 'async') {
          router.post(path, asyncHandler(handleAsync(task.id, subtaskId)))
        }
      }
    }
  }

  router.stack.forEach(function (r) {
    if (r.route && r.route.path) {
      console.log(r.route.path)
    }
  })
  return router
}
