import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styles } from '../styles'
import { Pressable, Text, TextInput } from 'react-native'
import { Passkey, PasskeyCreateResult } from 'react-native-passkey'
import { useState } from 'react'
import { RegistrationStartResponse } from '../model'
import { finishAuthentication, finishRegistration, startAuthentication, startRegistration } from '../gateway'

const Demo = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  
  const [username, setUsername] = useState<string | undefined>(undefined)
  const [passkeySupported, setPasskeySupported] = useState<boolean>(false)

  const createAccount = async () => {
    try {
      if (username === undefined || username.length === 0) {
        return
      }

      // 1. Start the registration
      const regStartRes: RegistrationStartResponse = await startRegistration(username)
      console.warn(`regStartRes = ${JSON.stringify(regStartRes, null, 2)}`)

      const passkeyRegRes: PasskeyCreateResult = await Passkey.create(regStartRes.publicKey)
      console.warn(`passkeyRegRes = ${JSON.stringify(passkeyRegRes, null, 2)}`)

      // 2. Finish the registration
      await finishRegistration(username, passkeyRegRes)
      console.warn('Registration successful!')
    } catch (err: any) {
      console.error(err)
    }
  }

  const authenticateAccount = async () => {
    try {
      if (!username || username.length === 0) return

      // 1. Start authentication
      const authStartRes = await startAuthentication(username)
      console.warn(`authStartRes = ${JSON.stringify(authStartRes, null, 2)}`)

      // 2. Call Passkey.get() with publicKey options from backend
      const assertionRes = await Passkey.get(authStartRes.publicKey)
      console.warn(`assertionRes = ${JSON.stringify(assertionRes, null, 2)}`)

      // 3. Send it to backend to finish authentication
      await finishAuthentication(username, assertionRes)

      // Optional: indicate success
      alert('Authentication successful!')
    } catch (err: any) {
      console.error(err)
      alert(`Authentication failed: ${err.message}`)
    }
  }

const isSupported = async() => {
  const res = Passkey.isSupported()
  setPasskeySupported(res)
}

  return (
    <SafeAreaView style={styles.container}>
      {passkeySupported && <Text>Passkey Supported</Text>}
      <TextInput style={styles.textInput}
         autoCapitalize='none'
         placeholder="passkey name - username or email"
         value={username}
         onChangeText={setUsername} />
       <Pressable style={styles.button}
          onPress={isSupported}>
        <Text>Passkey Supported?</Text>
      </Pressable>
       <Pressable style={styles.button}
          disabled={username === undefined || username.length === 0}
          onPress={createAccount}>
        <Text>Create Account</Text>
      </Pressable>
       <Pressable style={styles.button}
          disabled={username === undefined || username.length === 0}
          onPress={authenticateAccount}>
        <Text>Authenticate</Text>
      </Pressable>
      <Pressable
        style={styles.smallButton}
        onPress={() => navigation.navigate('Home')}>
        <Text>Home</Text>
      </Pressable>
    </SafeAreaView>
  )
}

export default Demo