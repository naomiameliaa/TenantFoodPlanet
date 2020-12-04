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
  },
  contentContainer: {
    margin: normalize(10),
  },
  txtTitle: {
    color: theme.colors.black,
    fontSize: normalize(22),
    fontWeight: 'bold',
    marginBottom: 8,
  },
  priceStyle: {
    fontWeight: 'bold',
    fontSize: normalize(14),
    marginBottom: 20,
  },
  horizontalWrapper: {
    flexDirection: 'row',
  },
  descStyle: {
    fontSize: normalize(12),
    fontWeight: 'bold',
    width: '35%',
  },
  descDetail: {
    width: '65%',
  },
  imgStyle: {
    width: '100%',
    height: 230,
  },
});

function MenuDetail({route}) {
  const [isLoading] = React.useState('');
  const {menuName, menuDescription, menuPrice, menuImage} = route.params;

  const renderPrice = (price) => {
    let i;
    let tempPrice = '';
    let ctr = 0;
    let stringPrice = price.toString();
    for (i = stringPrice.length - 1; i >= 0; i--) {
      tempPrice += stringPrice[i];
      ctr++;
      if (ctr === 3) {
        if (i > 1) {
          tempPrice += '.';
          ctr = 0;
        }
      }
    }
    let resPrice = '';
    for (i = tempPrice.length - 1; i >= 0; i--) {
      resPrice += tempPrice[i];
    }
    return resPrice;
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <SpinnerKit sizeSpinner="large" style={styles.spinnerKitStyle} />
      ) : (
        <View>
          <Image
            style={styles.imgStyle}
            source={{uri: `data:image/jpeg;base64,${menuImage}`}}
          />
          <View style={styles.contentContainer}>
            <Text style={styles.txtTitle}>{menuName}</Text>
            <Text style={styles.priceStyle}>{renderPrice(menuPrice)}</Text>
            <View style={styles.horizontalWrapper}>
              <Text style={styles.descStyle}>Description</Text>
              <Text style={styles.descDetail}>{`"${menuDescription}"`}</Text>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

export default MenuDetail;
