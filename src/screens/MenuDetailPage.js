import * as React from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import theme from '../theme';
import {normalize} from '../utils';
import SpinnerKit from '../components/SpinnerKit';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    // justifyContent: "center",
    // alignItems: "center",
    marginVertical: normalize(20),
  },
  txtTitle: {
    // marginVertical: 20,
    color: theme.colors.black,
    fontSize: 30,
    fontWeight: 'bold',
  },
  txtCategory: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tenantImg: {
    borderRadius: 9,
    width: 200,
    height: 200,
  },
});

function MenuDetail({route}) {
  const [isLoading] = React.useState('');
  const {menuName, menuDescription, menuPrice, menuImage} = route.params;

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <SpinnerKit sizeSpinner="large" style={styles.spinnerKitStyle} />
      ) : (
        <View style={styles.contentContainer}>
          <Image
            style={styles.tenantImg}
            source={{uri: `data:image/jpeg;base64,${menuImage}`}}
          />
          <Text style={styles.txtTitle}>{menuName}</Text>
          <Text>Price: {menuPrice}</Text>
          <Text style={styles.txtCategory}>Description: {menuDescription}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

export default MenuDetail;
