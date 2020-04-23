import React, { FC, useState, useEffect } from 'react'
import { StyleSheet, Text, View, SafeAreaView, TextInput, FlatList } from 'react-native'
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

let timer: any

export default () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [delayedSearchTerm, setDelayedSearchTerm] = useState(searchTerm)

  useEffect(() => {
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      setDelayedSearchTerm(searchTerm)
    }, 1000)
  }, [searchTerm])

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <TextInput
          style={styles.searchInput}
          onChangeText={(text) => setSearchTerm(text)}
          value={searchTerm}
          placeholder="Search for podcasts"
        />
        {searchTerm !== '' && delayedSearchTerm !== '' && (
          <Results searchTerm={delayedSearchTerm} />
        )}
      </View>
    </SafeAreaView>
  )
}

type Result = {
  searchTerm: String
}

const Results: FC<Result> = ({ searchTerm }) => {
  const { loading, error, data } = useQuery(GET_PODCASTS_BY_NAME, {
    variables: { name: searchTerm },
    errorPolicy: 'all',
  })

  if (loading) return null
  if (error) return <Text>{error.toString()}</Text>

  const { podcastsByName: podcasts } = data

  return (
    <FlatList
      data={podcasts}
      renderItem={({ item }) => (
        <View>
          <Text>{item.title_original}</Text>
        </View>
      )}
    />
  )
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
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
})
