import * as React from 'react';
import {
  View,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import axios from 'axios';
import ButtonText from '../components/ButtonText';
import Title from '../components/Title';
import theme from '../theme';
import {AuthContext} from '../../context';
import {storeData, alertMessage, normalize} from '../utils';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: normalize(30),
  },
  backgroundImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  contentWrapper: {
    backgroundColor: theme.colors.white_70,
    marginHorizontal: normalize(20),
    padding: normalize(20),
    borderRadius: 20,
    justifyContent: 'center',
  },
  txtTitle: {
    fontSize: normalize(20),
    alignSelf: 'center',
  },
  inputContainer: {
    alignItems: 'center',
  },
  inputStyle: {
    width: '90%',
    height: normalize(30),
    borderRadius: 10,
    backgroundColor: theme.colors.white,
    fontSize: 18,
    paddingHorizontal: 20,
    marginVertical: 10,
    justifyContent: 'center',
  },
  loginTxt: {
    color: theme.colors.white,
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
  loginWrapper: {
    backgroundColor: theme.colors.red,
    width: '40%',
    borderRadius: 10,
    paddingVertical: 12,
    marginVertical: 10,
  },
});

function LandingPage() {
  const {signIn} = React.useContext(AuthContext);
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  const validationLogin = () => {
    if (email.length === 0 || password.length === 0) {
      alertMessage({
        titleMessage: 'Warning !',
        bodyMessage: 'All data must be filled',
        btnText: 'Try Again',
        btnCancel: false,
      });
    } else {
      login();
    }
  };

  async function login() {
    try {
      const response = await axios.get(
        'https://food-planet.herokuapp.com/users/login',
        {
          params: {
            role: 'tenant',
          },
          auth: {
            username: email,
            password: password,

            // username: 'tenantAdmin@mail.com',
            // password: 'password',
          },
        },
      );
      if (response.status === 200) {
        storeData('tenantAdminData', response.data.object);
        signIn();
      }
    } catch (error) {
      alertMessage({
        titleMessage: 'Error',
        bodyMessage: 'Incorrect password or email',
        btnText: 'Try Again',
        btnCancel: false,
      });
      setErrorMessage('Something went wrong');
      console.log('error:', error);
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.backgroundImg}
        source={require('../assets/landing-page.jpg')}>
        <View style={styles.contentWrapper}>
          <Title txtStyle={styles.txtTitle} text="Login to your account" />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(text) => onChangeEmail(text)}
              value={email}
              textContentType="emailAddress"
              autoCapitalize="none"
              placeholder="Tenant Email"
            />
            <TextInput
              style={styles.inputStyle}
              onChangeText={(text) => onChangePassword(text)}
              value={password}
              textContentType="password"
              autoCapitalize="none"
              placeholder="Password"
              secureTextEntry={true}
            />
            <ButtonText
              title="LOGIN"
              txtStyle={styles.loginTxt}
              wrapperStyle={styles.loginWrapper}
              onPress={() => validationLogin}
            />
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

export default LandingPage;
