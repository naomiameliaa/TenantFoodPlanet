import * as React from 'react';
import {
  View,
  TextInput,
  Image,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import ButtonKit from '../components/ButtonKit';
import ButtonText from '../components/ButtonText';
import Title from '../components/Title';
import theme from '../theme';
import {normalize, getData, removeData, alertMessage} from '../utils';
import SpinnerKit from '../components/SpinnerKit';

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
  },
  txtInput: {
    width: '90%',
    height: 40,
    borderRadius: 10,
    backgroundColor: theme.colors.white,
    fontSize: 18,
    paddingHorizontal: 20,
    marginVertical: 10,
    justifyContent: 'center',
  },
  btnText: {
    color: theme.colors.white,
    fontSize: normalize(18),
    fontWeight: 'bold',
  },
  btnWrapper: {
    backgroundColor: theme.colors.red,
    width: '50%',
    borderRadius: 10,
    paddingVertical: 8,
    marginVertical: 5,
    alignSelf: 'center',
  },
});

function ChangePassword({navigation}) {
  const [password, onChangePassword] = React.useState('');
  const [confirmPassword, onChangeConfirmPassword] = React.useState('');

  const getDataTenantAdmin = async () => {
    const dataTenantAdmin = await getData('tenantAdminData');
    if (getDataTenantAdmin !== null) {
      return dataTenantAdmin.userId;
    } else {
      return null;
    }
  };

  async function changePassword() {
    if (password !== confirmPassword) {
      alertMessage({
        titleMessage: 'Failed',
        bodyMessage: 'Password does not match',
        btnText: 'Try Again',
        btnCancel: false,
      });
    }

    try {
      const userId = await getDataTenantAdmin();
      const response = await axios.post(
        'http://172.18.0.1:8080/users/changePassword',
        {
          userId: userId,
        },
      );
      if (response.data.msg === 'Change password success') {
        console.log('Success');
        alertMessage({
          titleMessage: 'Success',
          bodyMessage: 'Password change successfully',
          btnText: 'OK',
          onPressOK: () => navigation.goBack(),
          btnCancel: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Title text="Change Password" txtStyle={styles.titleText} />
        <TextInput
          style={styles.txtInput}
          onChangeText={(text) => onChangePassword(text)}
          value={password}
          textContentType="password"
          secureTextEntry={true}
          autoCapitalize="none"
          placeholder="New Password"
        />
        <TextInput
          style={styles.txtInput}
          onChangeText={(text) => onChangeConfirmPassword(text)}
          value={confirmPassword}
          textContentType="password"
          secureTextEntry={true}
          autoCapitalize="none"
          placeholder="Confirm Password"
        />
      </View>
      <ButtonText
        title="Save"
        txtStyle={styles.btnText}
        wrapperStyle={styles.btnWrapper}
        onPress={changePassword}
      />
    </SafeAreaView>
  );
}

export default ChangePassword;
