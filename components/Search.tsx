import React, { FC, useState, useEffect } from 'react'
import {
  StyleSheet,
  Button,
  Text,
  View,
  SafeAreaView,
  TextInput,
  FlatList,
  Modal,
} from 'react-native'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

const GET_PODCASTS_BY_NAME = gql`
  query($name: String!) {
    podcastsByName(name: $name) {
      title_original
      id
    }
  }
`

const GET_PODCAST_BY_ID = gql`
  query($id: String!) {
    podcastById(id: $id) {
      title
      episodes {
        title
        id
        audio
      }
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
  const [selectedPodcastId, setSelectedPodcastId] = useState('')

  const { loading, error, data } = useQuery(GET_PODCASTS_BY_NAME, {
    variables: { name: searchTerm },
    errorPolicy: 'all',
  })

  if (loading) return null
  if (error) return <Text>{error.toString()}</Text>

  const { podcastsByName: podcasts } = data

  if (selectedPodcastId) {
    return <Episodes podcastId={selectedPodcastId} goBack={() => setSelectedPodcastId('')} />
  }

  return (
    <FlatList
      data={podcasts}
      renderItem={({ item: { id, title_original } }) => (
        <View style={styles.button}>
          <Button
            title={title_original}
            onPress={() => {
              setSelectedPodcastId(id)
            }}
          />
        </View>
      )}
    />
  )
}

type Podcast = {
  podcastId: String
  goBack: Function
}

const Episodes: FC<Podcast> = ({ podcastId, goBack }) => {
  const [selectedEpisodeAudio, setSelectedEpisodeAudio] = useState('')

  const { loading, error, data } = useQuery(GET_PODCAST_BY_ID, {
    variables: { id: podcastId },
    errorPolicy: 'all',
  })

  if (loading) return null
  if (error) return <Text>{error.toString()}</Text>

  const { podcastById: podcast } = data

  return (
    <View>
      <Modal visible={selectedEpisodeAudio !== ''}>
        <View>
          <EpisodePlayer audioUrl={selectedEpisodeAudio} />
        </View>
      </Modal>
      <View style={styles.button}>
        <Button
          title="< Back"
          onPress={() => {
            goBack()
          }}
          color="#dcdcdc"
        />
      </View>
      <FlatList
        data={podcast.episodes}
        renderItem={({ item: { title, audio } }) => (
          <View style={styles.button}>
            <Button
              title={title}
              onPress={() => {
                setSelectedEpisodeAudio(audio)
              }}
            />
          </View>
        )}
      />
    </View>
  )
}

type Episode = {
  audioUrl: String
}

const EpisodePlayer: FC<Episode> = ({ audioUrl }) => {
  return (
    <View>
      <Text>{audioUrl}</Text>
    </View>
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
  button: {
    marginBottom: 10,
  },
  modal: {
    elevation: 5,
  },
})
