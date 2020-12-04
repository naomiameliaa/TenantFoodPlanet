import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
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

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: normalize(10),
  },
  contentContainer: {
    height: '90%',
  },
  titleText: {
    fontSize: normalize(22),
    marginTop: 15,
    marginBottom: 25,
    textAlign: 'center',
  },
  orderContainer: {
    backgroundColor: theme.colors.white,
    marginVertical: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  spinnerKitStyle: {
    marginTop: normalize(80),
  },
  emptyOrderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyOrderStyle: {
    width: normalize(220),
    height: normalize(220),
    marginTop: 0.15 * SCREEN_HEIGHT,
  },
  titleEmptyOrder: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    marginVertical: 10,
  },
  orderNum: {
    fontSize: normalize(14),
    fontWeight: 'bold',
  },
  orderNumBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  notifyBtn: {
    backgroundColor: theme.colors.red,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  btnText: {
    color: theme.colors.white,
    fontSize: normalize(12),
    fontWeight: 'bold',
  },
  detailWrapper: {
    marginBottom: 10,
  },
  horizontalWrapper: {
    flexDirection: 'row',
  },
  quantity: {
    fontWeight: 'bold',
    width: '10%',
  },
  txtStyle: {
    fontWeight: 'bold',
  },
  notesWrapper: {
    flexDirection: 'row',
    marginLeft: '10%',
  },
  notes: {
    flex: 1,
  },
  pickedUpBtn: {
    width: '40%',
    backgroundColor: theme.colors.red,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'center',
    marginVertical: 10,
  },
});

function OngoingOrder({navigation}) {
  const [orderData, setOrderData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const getDataTenantAdmin = async () => {
    const dataTenantAdmin = await getData('tenantAdminData');
    if (getDataTenantAdmin !== null) {
      return dataTenantAdmin.tenantId;
    } else {
      return null;
    }
  };

  const renderStatus = (status) => {
    if (status === 'PROCESSING') {
      return 'Status: Processing your order';
    } else {
      return 'Status: Your order is ready';
    }
  };

  const renderDate = (dateTime) => {
    let i = 0;
    let dates = '';
    let spaces = 0;
    for (; i < dateTime.length; i++) {
      dates += dateTime[i];
      if (dateTime[i] === ' ') {
        spaces++;
        if (spaces === 2) {
          return dates;
        }
      }
    }
  };

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

  const renderItem = ({item, idx}) => {
    return (
      <TouchableOpacity style={styles.orderContainer} key={idx}>
        <View style={styles.orderNumBtnWrapper}>
          <Text style={styles.orderNum}>Order No. {item.orderNum}</Text>
          <ButtonText
            title="Notify Customer"
            wrapperStyle={styles.notifyBtn}
            txtStyle={styles.btnText}
          />
        </View>
        {item.detail.map((itm, key) => {
          return (
            <View style={styles.detailWrapper}>
              <View style={styles.horizontalWrapper}>
                <Text style={styles.quantity}>{`${itm.quantity}x`}</Text>
                <Text style={styles.txtStyle}>{itm.menuName}</Text>
              </View>
              <View style={styles.notesWrapper}>
                <Text style={styles.txtStyle}>Notes: </Text>
                <Text style={styles.notes}>{itm.notes}</Text>
              </View>
            </View>
          );
        })}
        <ButtonText
          title="Picked up"
          wrapperStyle={styles.pickedUpBtn}
          txtStyle={styles.btnText}
        />
      </TouchableOpacity>
    );
  };

  async function getOngoingOrder() {
    setIsLoading(true);
    const tenantId = await getDataTenantAdmin();
    try {
      const response = await axios.get(
        `https://food-planet.herokuapp.com/orders/tenant?tenantId=${tenantId}&status=PROCESSING&status=READY`,
        {
          auth: {
            username: 'tenantAdmin@mail.com',
            password: 'password',
          },
        },
      );
      if (response.data.msg === 'Query success') {
        console.log('OrderData: ', response.data.object);
        setOrderData(response.data.object);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  React.useEffect(() => {
    getOngoingOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Title text="Ongoing Order" txtStyle={styles.titleText} />
        {orderData.length === 0 ? (
          <View style={styles.emptyOrderContainer}>
            <Image
              source={require('../assets/dinner.png')}
              style={styles.emptyOrderStyle}
            />
            <Text style={styles.titleEmptyOrder}>
              There is No Ongoing Order
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.contentContainer}>
            {isLoading ? (
              <SpinnerKit sizeSpinner="large" style={styles.spinnerKitStyle} />
            ) : (
              <FlatList
                data={orderData}
                renderItem={({item, idx}) => renderItem({item, idx})}
                keyExtractor={(item) => item.orderId.toString()}
              />
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

export default OngoingOrder;
