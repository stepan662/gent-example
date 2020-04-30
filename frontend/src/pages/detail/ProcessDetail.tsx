import React from 'react'

import useSWR from 'swr'
import GentDiagram from 'gent-diagram'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import ErrorVisualizer from '../../components/ErrorVisualizer'
import ManualTask from './ManualTask'

const Container = styled.div`
  width: 1000px;
  margin: 0px auto;
  max-width: 100%;
`

const Process = () => {
  const { processId } = useParams()

  const { data: schema, revalidate: schemaRevalidate } = useSWR('/schema', {
    refreshInterval: 10000,
  })
  const { data: process } = useSWR(processId && `/state?id=${processId}`, {
    refreshInterval: 1000,
  })

  return (
    <Container>
      {schema && <GentDiagram schema={schema} state={process} />}

      {process?.status === 'error' && <ErrorVisualizer state={process} />}

      {process?.status === 'waiting' && <ManualTask state={process} />}

      {schemaRevalidate && !schema && <div>Loading</div>}
    </Container>
  )
}

export default Process
