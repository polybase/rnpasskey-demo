import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styles } from '../styles'
import { Pressable, Text } from 'react-native'
import { Passkey } from 'react-native-passkey'

const isSupported = Passkey.isSupported()

const Demo = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  return (
    <SafeAreaView style={styles.container}>
      <Text>{isSupported ? 'Passkey Supported' : 'Passkey Not Supported'}</Text>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Home')}>
        <Text>Home</Text>
      </Pressable>
    </SafeAreaView>
  )

}

export default Demo