import React from 'react'

import useSWR from 'swr'
import GentDiagram from 'gent-diagram'
import styled from 'styled-components'
import { useRouter } from 'next/router'

import ErrorVisualizer from '../../components/ErrorVisualizer'
import ManualTask from './ManualTask'
import Button from '@kiwicom/orbit-components/lib/Button'

const Container = styled.div`
  width: 1000px;
  margin: 0px auto;
  max-width: 100%;
  position: relative;
`

const Header = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`

const Process = () => {
  const router = useRouter()

  const { processId } = router.query

  const { data: schema, revalidate: schemaRevalidate } = useSWR('/schema', {
    refreshInterval: 10000,
  })
  const { data: process } = useSWR(processId && `/state?id=${processId}`, {
    refreshInterval: 1000,
  })

  return (
    <Container>
      {schema && (
        <Header>
          <Button size="small" href={`/history?processId=${processId}`}>
            Show history
          </Button>
        </Header>
      )}
      {schema && <GentDiagram schema={schema} state={process} />}

      {process?.status === 'error' && <ErrorVisualizer state={process} />}

      {process?.status === 'waiting' && <ManualTask key={process.status} state={process} />}

      {schemaRevalidate && !schema && <div>Loading</div>}
    </Container>
  )
}

export default Process
