import React from 'react'
import styled from 'styled-components'

const StyledLink = styled.a`
  display: flex;
  border-bottom: 1px solid lightgray;
  padding: 3px;
  margin: 5px;
`

const ProcessId = styled.div`
  display: flex;
  font-size: 14px;
  flex-basis: 400px;
`

const ProcessStatus = styled.div`
  display: flex;
  font-size: 13px;
  flex-basis: 200px;
`

function actionToState(action) {
  return action
}

const ProcessOverview = ({ data }) => {
  return (
    <div>
      <a href={`/process/${data.id}`}>
        <StyledLink>
          <ProcessId>Id: {data.id}</ProcessId>
          <ProcessStatus>{actionToState(data.current.status)}</ProcessStatus>
        </StyledLink>
      </a>
    </div>
  )
}

export default ProcessOverview
