import React, { FC, useState } from 'react'
import { Button, StyleSheet, Text, View, TextInput } from 'react-native'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

const GET_PODCASTS_BY_NAME = gql`
  query($name: String!) {
    podcastsByName(name: $name) {
      title_original
      email
    }
  }
`

export default () => {
  const [searchText, setSearchText] = useState('')

  return (
    <View style={styles.container}>
      <Text>Search for podcasts by name:</Text>
      <TextInput
        style={styles.searchInput}
        onChangeText={(text) => setSearchText(text)}
        value={searchText}
      />
      <Button title="Search" onPress={() => {}} />
      {/* <Results searchTerm={searchText} /> */}
    </View>
  )
}

type ResultsProps = {
  searchTerm: String
}

const Results: FC<ResultsProps> = ({ searchTerm }) => {
  const { loading, error, data } = useQuery(GET_PODCASTS_BY_NAME, {
    variables: { name: searchTerm },
  })

  if (loading) return null
  if (error) return <Text>{`Error! ${error}`}</Text>

  return <Text>{data}</Text>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
  },
})
