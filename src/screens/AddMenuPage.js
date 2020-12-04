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
  },
  innerContainer: {
    padding: normalize(10),
  },
  titleText: {
    fontSize: normalize(22),
    marginTop: 15,
    marginBottom: 25,
    textAlign: 'center',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    top: -normalize(20),
  },
  inputStyle: {
    width: '100%',
    height: 40,
    borderRadius: 10,
    backgroundColor: theme.colors.white,
    fontSize: 18,
    paddingHorizontal: 20,
    marginVertical: 8,
    justifyContent: 'center',
  },
  textArea: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    backgroundColor: theme.colors.white,
    fontSize: 18,
    paddingHorizontal: 20,
    marginVertical: 8,
  },
  imageSections: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center',
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
    borderRadius: 20,
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
        'https://food-planet.herokuapp.com/menu/generate',
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
        <Image
          source={{uri: 'data:image/jpeg;base64,' + fileData}}
          style={styles.images}
        />
      );
    } else {
      return (
        <Image source={require('../assets/dummy.png')} style={styles.images} />
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <SpinnerKit sizeSpinner="large" style={styles.spinnerKitStyle} />
      ) : (
        <View style={styles.innerContainer}>
          <Title text="Add Menu" txtStyle={styles.titleText} />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.ImageSections}>{renderFileData()}</View>
            <ButtonKit
              source={require('../assets/photo.png')}
              wrapperStyle={styles.btnImage}
              onPress={chooseImage}
            />
            <View style={styles.contentContainer}>
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
            <ButtonText
              title="Save"
              txtStyle={styles.btnText}
              wrapperStyle={styles.btnWrapper}
              onPress={addNewMenu}
              isLoading
            />
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

export default AddMenu;
