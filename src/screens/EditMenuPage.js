import * as React from 'react';
import {
  View,
  Image,
  TextInput,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import ButtonKit from '../components/ButtonKit';
import ButtonText from '../components/ButtonText';
import Title from '../components/Title';
import theme from '../theme';
import {normalize, alertMessage, getData, removeData, deleteFcmToken} from '../utils';
import ImagePicker from 'react-native-image-picker';
import {AuthContext} from '../../context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: normalize(10),
  },
  titleText: {
    fontSize: normalize(22),
    marginTop: 15,
    marginBottom: 25,
    textAlign: 'center',
    color: theme.colors.red,
  },
  contentWrapper: {
    marginBottom: normalize(60),
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    top: -normalize(20),
  },
  inputStyle: {
    width: '100%',
    height: normalize(42),
    borderRadius: 10,
    backgroundColor: theme.colors.white,
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 'auto',
    marginVertical: 10,
    justifyContent: 'center',
  },
  inputStyleError: {
    width: '100%',
    height: normalize(42),
    borderRadius: 10,
    backgroundColor: theme.colors.white,
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 'auto',
    marginVertical: 10,
    justifyContent: 'center',
    borderColor: theme.colors.red,
    borderWidth: 1,
  },
  textArea: {
    width: '100%',
    height: normalize(120),
    borderRadius: 10,
    backgroundColor: theme.colors.white,
    fontSize: 16,
    paddingHorizontal: 20,
    marginVertical: 8,
    textAlignVertical: 'top',
  },
  textAreaError: {
    width: '100%',
    height: normalize(120),
    borderRadius: 10,
    backgroundColor: theme.colors.white,
    fontSize: 16,
    paddingHorizontal: 20,
    marginVertical: 8,
    textAlignVertical: 'top',
    borderColor: theme.colors.red,
    borderWidth: 1,
  },
  btnImage: {
    alignSelf: 'flex-end',
    zIndex: 1,
    top: -normalize(40),
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: 5,
    width: 40,
    height: 40,
    borderRadius: 10,
    opacity: 0.6,
  },
  images: {
    width: '100%',
    height: 220,
    borderColor: 'black',
    borderWidth: 0.5,
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
    marginTop: 5,
    marginBottom: 30,
    alignSelf: 'center',
  },
});

function EditMenu({navigation, route}) {
  const {
    menuId,
    menuName,
    menuDescription,
    menuPrice,
    menuImage,
    getMenuData,
  } = route.params;
  const [menu_name, onChangeMenuName] = React.useState(menuName);
  const [menu_description, onChangeMenuDescription] = React.useState(
    menuDescription,
  );
  const [menu_price, onChangeMenuPrice] = React.useState(menuPrice);
  const [fileData, setFileData] = React.useState(menuImage);
  const [isLoading, setIsLoading] = React.useState(false);
  const {signOut} = React.useContext(AuthContext);

  function checkData() {
    if (
      menu_name.length === 0 ||
      menu_description.length === 0 ||
      menu_price.length === 0 ||
      fileData.length === 0
    ) {
      alertMessage({
        titleMessage: 'Error',
        bodyMessage: 'All data must be filled!',
        btnText: 'Try Again',
        btnCancel: true,
      });
    } else {
      editMenu();
    }
  }
  const logout = async () => {
    await deleteFcmToken();
    const dataTenant = await getData('tenantAdminData');
    if (dataTenant !== null) {
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

  async function editMenu() {
    setIsLoading(true);
    try {
      const response = await axios.put(
        'https://food-planet.herokuapp.com/menu/update',
        {
          menuId: menuId,
          name: menu_name,
          description: menu_description,
          price: menu_price,
          image: fileData,
        },
      );
      if (response.data.msg === 'Update menu success') {
        alertMessage({
          titleMessage: 'Success',
          bodyMessage: 'Success update menu',
          btnText: 'OK',
          onPressOK: () => {
            getMenuData();
            navigation.goBack();
          },
          btnCancel: false,
        });
      }
    } catch (error) {
      if (error.response.status === 401) {
        sessionTimedOut();
      } else {
        alertMessage({
          titleMessage: 'Error',
          bodyMessage: 'Update menu failed',
          btnText: 'Try Again',
          btnCancel: false,
        });
      }
    }
    setIsLoading(false);
  }

  function chooseImage() {
    let options = {
      title: 'Select Image',
      customButtons: [
        {name: 'customOptionKey', title: 'Choose Photo from Custom Option'},
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        setFileData(response.data);
      }
    });
  }

  function renderFileData() {
    if (fileData) {
      return (
        <Image
          source={{uri: 'data:image/jpeg;base64,' + fileData}}
          style={styles.images}
          resizeMode="contain"
        />
      );
    } else {
      return (
        <Image
          source={{uri: 'data:image/jpeg;base64,' + menuImage}}
          style={styles.images}
          resizeMode="contain"
        />
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Title text="Edit Menu" txtStyle={styles.titleText} />
        <ScrollView
          style={styles.contentWrapper}
          showsVerticalScrollIndicator={false}>
          {renderFileData()}
          <ButtonKit
            source={require('../assets/photo.png')}
            wrapperStyle={styles.btnImage}
            onPress={chooseImage}
          />
          <View style={styles.contentContainer}>
            <TextInput
              style={
                menu_name.length === 0
                  ? styles.inputStyleError
                  : styles.inputStyle
              }
              onChangeText={(text) => onChangeMenuName(text)}
              value={menu_name}
              autoCapitalize="none"
              placeholder="Menu Name"
            />
            <TextInput
              style={
                menu_description.length === 0
                  ? styles.textAreaError
                  : styles.textArea
              }
              onChangeText={(text) => onChangeMenuDescription(text)}
              value={menu_description}
              autoCapitalize="none"
              placeholder="Menu Description"
              multiline
            />
            <TextInput
              style={
                menu_price.length === 0
                  ? styles.inputStyleError
                  : styles.inputStyle
              }
              onChangeText={(text) => onChangeMenuPrice(text)}
              value={menu_price.toString()}
              autoCapitalize="none"
              placeholder="Menu Price"
              keyboardType="number-pad"
            />
          </View>
          <ButtonText
            title="Save"
            txtStyle={styles.btnText}
            wrapperStyle={styles.btnWrapper}
            onPress={() => checkData()}
            isLoading={isLoading}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default EditMenu;
