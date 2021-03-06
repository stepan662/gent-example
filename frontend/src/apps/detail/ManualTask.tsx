import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import Button from '@kiwicom/orbit-components/lib/Button'
import { mutate } from 'swr'

import client from '../../client'
import { useRouter } from 'next/router'

type Props = {
  state: any
}

const Wrapper = styled.div`
  display: flex;
  margin-left: 200px;
  & > * + * {
    margin-left: 15px;
  }
`

const ManualTask = ({ state }: Props) => {
  const router = useRouter()
  const { processId } = router.query

  const [manualLoading, setManualLoading] = useState(false)
  const [autoLoading, setAutoLoading] = useState(false)

  const handleManual = useCallback(async () => {
    setManualLoading(true)
    mutate(
      `/state?id=${processId}`,
      await client.post(
        '/task/usertask/resolve',
        { type: 'manual' },
        { params: { id: processId } },
      ),
    )
    setManualLoading(false)
  }, [processId])

  const handleAuto = useCallback(async () => {
    setAutoLoading(true)
    mutate(
      `/state?id=${processId}`,
      await client.post('/task/usertask/resolve', { type: 'auto' }, { params: { id: processId } }),
    )
    setAutoLoading(false)
  }, [processId])

  const resolveManual = useCallback(async () => {
    setManualLoading(true)
    mutate(
      `/state?id=${processId}`,
      await client.post('/task/manual/resolve', null, { params: { id: processId } }),
    )
    setManualLoading(false)
  }, [processId])

  switch (state?.task) {
    case 'usertask':
      return (
        <Wrapper>
          <Button loading={autoLoading} onClick={handleAuto}>
            Auto
          </Button>
          <Button loading={manualLoading} onClick={handleManual}>
            Manual
          </Button>
        </Wrapper>
      )
    case 'manual':
      return (
        <Wrapper>
          <Button loading={manualLoading} onClick={resolveManual}>
            Done
          </Button>
        </Wrapper>
      )

    default:
      return null
  }
}

export default ManualTask
