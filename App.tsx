import React from 'react'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'

import Search from './components/Search'

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
})

export default () => (
  <ApolloProvider client={client}>
    <Search />
  </ApolloProvider>
)
