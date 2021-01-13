import * as React from 'react';
import {
  View,
  TextInput,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import ButtonText from '../components/ButtonText';
import Title from '../components/Title';
import theme from '../theme';
import {normalize, getData, alertMessage, removeData} from '../utils';
import {AuthContext} from '../../context';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: normalize(10),
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: normalize(22),
    marginTop: 15,
    marginBottom: 25,
    textAlign: 'center',
    color: theme.colors.red,
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
  btnText: {
    color: theme.colors.white,
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
  btnWrapper: {
    backgroundColor: theme.colors.red,
    width: '50%',
    borderRadius: 20,
    paddingVertical: 8,
    marginVertical: 5,
    alignSelf: 'center',
  },
  content: {
    width: SCREEN_WIDTH * 0.8,
    fontSize: 16,
    color: theme.colors.grey,
    marginHorizontal: 20,
    marginBottom: 20,
  },
});

function ChangePassword({navigation}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [oldPassword, onChangeOldPassword] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [confirmPassword, onChangeConfirmPassword] = React.useState('');
  const {signOut} = React.useContext(AuthContext);

  const getDataTenantAdmin = async () => {
    const dataTenantAdmin = await getData('tenantAdminData');
    if (dataTenantAdmin) {
      return dataTenantAdmin.userId;
    } else {
      return null;
    }
  };

  function validationPassword() {
    if (
      oldPassword.length === 0 ||
      password.length === 0 ||
      confirmPassword === 0
    ) {
      alertMessage({
        titleMessage: 'Error',
        bodyMessage: 'All fields are required!',
        btnText: 'Try Again',
        btnCancel: true,
      });
    } else if (confirmPassword !== password) {
      alertMessage({
        titleMessage: 'Error',
        bodyMessage: 'Password does not match',
        btnText: 'Try Again',
        btnCancel: true,
      });
    } else {
      changePassword();
    }
  }

  const logout = async () => {
    const dataUser = await getData('tenantAdminData');
    if (dataUser !== null) {
      await removeData('tenantAdminData');
      await signOut();
    }
  };

  function sessionTimedOut() {
    alertMessage({
      titleMessage: 'Session Timeout',
      bodyMessage: 'Please re-login',
      btnText: 'OK',
      onPressOK: () => {
        logout();
      },
      btnCancel: false,
    });
  }

  async function changePassword() {
    setIsLoading(true);
    try {
      const userId = await getDataTenantAdmin();
      const response = await axios.post(
        `https://food-planet.herokuapp.com/users/changePassword?userId=${userId}&oldPassword=${oldPassword}&newPassword=${confirmPassword}`,
      );
      if (response.data.msg === 'Change password success') {
        alertMessage({
          titleMessage: 'Success',
          bodyMessage: 'Password changed successfully',
          btnText: 'OK',
          onPressOK: () => navigation.goBack(),
          btnCancel: false,
        });
      }
    } catch (error) {
      if (error.response.status === 401) {
        sessionTimedOut();
      } else {
        alertMessage({
          titleMessage: 'Failed',
          bodyMessage: 'Please try again later',
          btnText: 'Try Again',
          btnCancel: true,
        });
      }
    }
    setIsLoading(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Title text="Change Password" txtStyle={styles.titleText} />
        <Text style={styles.content}>
          Please enter your old password and then your new password.
        </Text>
        <TextInput
          style={
            oldPassword.length === 0
              ? styles.inputStyleError
              : styles.inputStyle
          }
          onChangeText={(text) => onChangeOldPassword(text)}
          value={oldPassword}
          textContentType="password"
          secureTextEntry={true}
          autoCapitalize="none"
          placeholder="Old Password"
        />
        <TextInput
          style={
            confirmPassword !== password || password.length === 0
              ? styles.inputStyleError
              : styles.inputStyle
          }
          onChangeText={(text) => onChangePassword(text)}
          value={password}
          textContentType="password"
          secureTextEntry={true}
          autoCapitalize="none"
          placeholder="New Password"
        />
        <TextInput
          style={
            confirmPassword !== password || confirmPassword.length === 0
              ? styles.inputStyleError
              : styles.inputStyle
          }
          onChangeText={(text) => onChangeConfirmPassword(text)}
          value={confirmPassword}
          textContentType="password"
          secureTextEntry={true}
          autoCapitalize="none"
          placeholder="Confirm New Password"
        />
      </View>
      <ButtonText
        title="Submit"
        txtStyle={styles.btnText}
        wrapperStyle={styles.btnWrapper}
        onPress={() => validationPassword()}
        isLoading={isLoading}
      />
    </SafeAreaView>
  );
}

export default ChangePassword;
