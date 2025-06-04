import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styles } from '../styles'
import { Button, Pressable, Text, TextInput } from 'react-native'
import { Passkey } from 'react-native-passkey'
import RegRequest from '../testData/RegRequest.json'
import AuthRequest from '../testData/AuthRequest.json'
import { useState } from 'react'


const Demo = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  
  const [email, setEmail] = useState<string>('')
  const [passkeySupported, setPasskeySupported] = useState<boolean>(false)

  const createAccount = async () => {
    try {
      const requestJson = {
        ...RegRequest,
      }

      const result = await Passkey.create(requestJson)
      console.log('Registration result: ', result)
    } catch (e) {
      console.log(e)
    }
  }

  const authenticateAccount = async () => {
    try {
      const requestJson = {
        ...AuthRequest,
      }

      const result = await Passkey.get(requestJson)
      console.log('Authentication result = ', result)
    } catch (e) {
      console.log(e)
    }
  }

const isSupported = async() => {
  const res = await Passkey.isSupported()
  setPasskeySupported(res)
}

  return (
    <SafeAreaView style={styles.container}>
      {passkeySupported && <Text>Passkey Supported</Text>}
       <TextInput style={styles.textInput}
          autoCapitalize='none'
          placeholder="email"
          value={email}
          onChangeText={setEmail} />
       <Pressable style={styles.button}
          onPress={createAccount}>
        <Text>Create Account</Text>
      </Pressable>
       <Pressable style={styles.button}
          onPress={authenticateAccount}>
        <Text>Authenticate</Text>
      </Pressable>
       <Pressable style={styles.button}
          onPress={isSupported}>
        <Text>Passkey Supported?</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Home')}>
        <Text>Home</Text>
      </Pressable>
    </SafeAreaView>
  )
}

export default Demo