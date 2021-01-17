import * as React from 'react';
import {
  View,
  TextInput,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import axios from 'axios';
import ButtonText from '../components/ButtonText';
import Title from '../components/Title';
import theme from '../theme';
import {AuthContext} from '../../context';
import {storeData, alertMessage, normalize, saveFcmToken} from '../utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  contentWrapper: {
    backgroundColor: theme.colors.white_60,
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
    height: normalize(42),
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 'auto',
    marginVertical: 10,
    justifyContent: 'center',
  },
  inputStyleError: {
    width: '90%',
    height: normalize(42),
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 'auto',
    marginVertical: 10,
    justifyContent: 'center',
    borderColor: theme.colors.red,
    borderWidth: 1,
  },
  forgotPassword: {
    color: theme.colors.red,
    fontWeight: 'bold',
  },
  wrapperForgotPass: {
    marginBottom: 10,
    alignSelf: 'flex-start',
    marginHorizontal: 20,
  },
  loginTxt: {
    color: theme.colors.white,
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
  loginWrapper: {
    backgroundColor: theme.colors.red,
    width: '40%',
    borderRadius: 20,
    paddingVertical: 12,
    marginVertical: 10,
  },
});

function LandingPage({navigation}) {
  const {signIn} = React.useContext(AuthContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');

  const validationLogin = () => {
    if (email.length === 0 || password.length === 0) {
      alertMessage({
        titleMessage: 'Warning !',
        bodyMessage: 'All data must be filled',
        btnText: 'Try Again',
        btnCancel: false,
      });
    } else if (!validateEmail) {
      alertMessage({
        titleMessage: 'Error',
        bodyMessage: 'Email is invalid!',
        btnText: 'Try Again',
        btnCancel: true,
      });
    } else {
      login();
    }
  };

  function validateEmail() {
    var regExp = /\S+@\S+\.\S+/;
    return regExp.test(email);
  }

  async function login() {
    setIsLoading(true);
    try {
      const response = await axios.get(
        'https://food-planet.herokuapp.com/users/login',
        {
          params: {
            role: 'tenantadmin',
            email: email.toLowerCase(),
            password: password,
          },
        },
      );
      if (response.data.msg === 'Login success') {
        storeData('tenantAdminData', response.data.object);
        await saveFcmToken();
        signIn();
      }
    } catch (error) {
      alertMessage({
        titleMessage: 'Error',
        bodyMessage: 'Incorrect password or email',
        btnText: 'Try Again',
        btnCancel: false,
      });
      console.log('error:', error);
    }
    setIsLoading(false);
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
              style={
                !validateEmail || email.length === 0
                  ? styles.inputStyleError
                  : styles.inputStyle
              }
              onChangeText={(text) => onChangeEmail(text)}
              value={email}
              textContentType="emailAddress"
              autoCapitalize="none"
              autoCompleteType="email"
              placeholder="Tenant Email"
            />
            <TextInput
              style={
                password.length === 0
                  ? styles.inputStyleError
                  : styles.inputStyle
              }
              onChangeText={(text) => onChangePassword(text)}
              value={password}
              textContentType="password"
              autoCapitalize="none"
              autoCompleteType="password"
              placeholder="Password"
              secureTextEntry={true}
            />
            <ButtonText
              title="Forgot Password?"
              txtStyle={styles.forgotPassword}
              wrapperStyle={styles.wrapperForgotPass}
              onPress={() => navigation.navigate('ForgotPasswordPage')}
            />
            <ButtonText
              title="LOGIN"
              txtStyle={styles.loginTxt}
              wrapperStyle={styles.loginWrapper}
              onPress={() => validationLogin()}
              isLoading={isLoading}
            />
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

export default LandingPage;
