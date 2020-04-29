import React from 'react'

import { SWRConfig, ConfigInterface } from 'swr'
import styled, { ThemeProvider } from 'styled-components'
import { getTokens } from '@kiwicom/orbit-design-tokens'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import client from './client'
import List from './pages/list/List'
import ProcessDetail from './pages/detail/ProcessDetail'

const swrConfig: ConfigInterface = {
  fetcher: async (url, ...args) => {
    return await client(url, ...args)
  },
  refreshInterval: 0,
  revalidateOnFocus: true,
  revalidateOnReconnect: false,
  dedupingInterval: 1,
}

const Wrapper = styled.div`
  margin: 0;
  font-family: 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
    'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`

const App = () => {
  return (
    <SWRConfig value={swrConfig}>
      <ThemeProvider theme={{ orbit: getTokens() }}>
        <Wrapper>
          <Router>
            <Switch>
              <Route path="/" exact>
                <List />
              </Route>
              <Route path="/process/:processId">
                <ProcessDetail />
              </Route>
            </Switch>
          </Router>
        </Wrapper>
      </ThemeProvider>
    </SWRConfig>
  )
}

export default App
