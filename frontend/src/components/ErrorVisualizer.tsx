import React from 'react'

import styled from 'styled-components'

const Container = styled.div`
  color: red;
`

const ErrorHeader = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
`

const ErrorStack = styled.div`
  font-size: 12px;
  white-space: pre-wrap;
`

const ErrorVisualizer = ({ state }) => {
  return (
    <Container>
      <ErrorHeader>{`Error in '${state.current.task}.${state.current.subtask}'`}</ErrorHeader>
      <ErrorStack>{state.current.error.stack}</ErrorStack>
    </Container>
  )
}

export default ErrorVisualizer
