import * as React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import ButtonKit from '../components/ButtonKit';
import ButtonText from '../components/ButtonText';
import Title from '../components/Title';
import theme from '../theme';
import {normalize, getData, alertMessage} from '../utils';
import SpinnerKit from '../components/SpinnerKit';
import ImagePicker from 'react-native-image-picker';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleText: {
    fontSize: normalize(25),
    margin: 10,
  },
  btnText: {
    color: theme.colors.white,
    fontWeight: 'bold',
    fontSize: normalize(16),
  },
  btnWrapper: {
    backgroundColor: theme.colors.red,
    width: '30%',
    height: '50%',
    margin: 10,
    borderRadius: 5,
  },
  inputStyle: {
    width: SCREEN_WIDTH * 0.9,
    borderRadius: 10,
    backgroundColor: theme.colors.white,
    fontSize: 18,
    paddingHorizontal: 20,
    marginVertical: 10,
    justifyContent: 'center',
  },
  textArea: {
    width: SCREEN_WIDTH * 0.9,
    borderRadius: 10,
    backgroundColor: theme.colors.white,
    fontSize: 18,
    paddingHorizontal: 20,
    marginVertical: 10,
    textAlignVertical: 'top',
    height: 120,
  },
  imageSections: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  images: {
    width: '100%',
    height: 200,
    borderColor: 'black',
    borderWidth: 1,
  },
  btnWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: normalize(20),
  },
  btnSave: {
    backgroundColor: theme.colors.red,
    width: SCREEN_WIDTH * 0.6,
    borderRadius: 10,
    paddingVertical: 12,
    marginVertical: 5,
  },
  txtSave: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

function AddMenu({navigation}) {
  const [menuName, onChangeMenuName] = React.useState('');
  const [menuDescription, onChangeMenuDescription] = React.useState('');
  const [menuPrice, onChangeMenuPrice] = React.useState('');
  const [fileData, setFileData] = React.useState('');
  const [filePath, setFilePath] = React.useState('');

  const [errorMessage, setErrorMessage] = React.useState('');
  const [isLoading] = React.useState(false);

  const getDataTenantAdmin = async () => {
    const dataTenantAdmin = await getData('tenantAdminData');
    if (getDataTenantAdmin !== null) {
      return dataTenantAdmin.tenantId;
    } else {
      return null;
    }
  };

  async function addNewMenu() {
    const tenantId = await getDataTenantAdmin();
    try {
      const response = await axios.post(
        'http://172.18.0.1:8080/menu/generate',
        {
          tenantId: tenantId,
          name: menuName,
          description: menuDescription,
          price: menuPrice,
          image: fileData,
        },
      );
      if (response.data.msg === 'Create menu success') {
        alertMessage({
          titleMessage: 'Success',
          bodyMessage: 'Success add new menu',
          btnText: 'OK',
          onPressOK: () => navigation.goBack(),
          btnCancel: false,
        });
      }
    } catch (error) {
      alertMessage({
        titleMessage: 'Error',
        bodyMessage: 'Failed add new tenant',
        btnText: 'Try Again',
        btnCancel: false,
      });
    }
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
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: 'data:image/jpeg;base64,' + response.data};
        setFilePath(response);
        setFileData(response.data);
        console.log('THIS IS FILEDATA', response.data);
      }
    });
  }

  function renderFileData() {
    if (fileData) {
      return (
        <ButtonKit
          source={{uri: 'data:image/jpeg;base64,' + fileData}}
          wrapperStyle={styles.images}
          onPress={chooseImage}
        />
      );
    } else {
      return (
        <ButtonKit
          source={require('../assets/dummy.png')}
          wrapperStyle={styles.images}
          onPress={chooseImage}
        />
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <SpinnerKit sizeSpinner="large" style={styles.spinnerKitStyle} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <Title text="Add Menu" />
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.ImageSections}>{renderFileData()}</View>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(text) => onChangeMenuName(text)}
              value={menuName}
              autoCapitalize="none"
              placeholder="Menu Name"
            />
            <TextInput
              style={styles.textArea}
              onChangeText={(text) => onChangeMenuDescription(text)}
              value={menuDescription}
              autoCapitalize="none"
              placeholder="Menu Description"
            />
            <TextInput
              style={styles.inputStyle}
              onChangeText={(text) => onChangeMenuPrice(text)}
              value={menuPrice}
              autoCapitalize="none"
              placeholder="Menu Price"
            />
          </View>
          <View style={styles.btnWrapper}>
            <ButtonText
              title="Save"
              txtStyle={styles.txtSave}
              wrapperStyle={styles.btnSave}
              onPress={addNewMenu}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

export default AddMenu;
