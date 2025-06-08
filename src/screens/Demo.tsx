import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styles } from '../styles'
import { Pressable, Text, TextInput } from 'react-native'
import { Passkey, PasskeyCreateRequest, PasskeyCreateResult } from 'react-native-passkey'
import RegRequest from '../testData/RegRequest.json'
import AuthRequest from '../testData/AuthRequest.json'
import { useState } from 'react'
import { RegistrationRequest } from '../model'
import { finishRegistration, startRegistration } from '../gateway'

const Demo = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  
  const [passkeyName, setPassKeyName] = useState<string | undefined>(undefined)
  const [passkeySupported, setPasskeySupported] = useState<boolean>(false)

  const createAccount = async () => {
    // try {
    //   const requestJson = {
    //     ...RegRequest,
    //   }

    //   console.warn(`request rp id = ${requestJson.rp.id}`)
    //   const result = await Passkey.create(requestJson)
    //   console.log('Registration result: ', result)
    // } catch (e) {
    //   console.log(e)
    // }
    try {
      if (passkeyName === undefined || passkeyName.length === 0) {
        return
      }

      // 1. Start the registration
      const regStartReq: RegistrationRequest = {
        passkey_name: passkeyName
      }

      const regStartRes: PasskeyCreateRequest = await startRegistration(regStartReq)
      console.warn(`regStartRes = ${JSON.stringify(regStartRes, null, 2)}`)

      const passkeyRegRes: PasskeyCreateResult = await Passkey.create(regStartRes)
      console.warn(`passkeyRegRes = ${JSON.stringify(passkeyRegRes, null, 2)}`)

      // 2. Finish the registration
      const regFinishRes = await finishRegistration(passkeyRegRes)
      console.warn(`regFinishRes = ${JSON.stringify(regFinishRes, null, 2)}`)
    } catch (err: any) {
      console.error(err)
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
  const res = Passkey.isSupported()
  setPasskeySupported(res)
}

  return (
    <SafeAreaView style={styles.container}>
      {passkeySupported && <Text>Passkey Supported</Text>}
      <TextInput style={styles.textInput}
         autoCapitalize='none'
         placeholder="passkey name - username or email"
         value={passkeyName}
         onChangeText={setPassKeyName} />
       <Pressable style={styles.button}
          onPress={isSupported}>
        <Text>Passkey Supported?</Text>
      </Pressable>
       <Pressable style={styles.button}
          disabled={passkeyName === undefined || passkeyName.length === 0}
          onPress={createAccount}>
        <Text>Create Account</Text>
      </Pressable>
       <Pressable style={styles.button}
          disabled={true}
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