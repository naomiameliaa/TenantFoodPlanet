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
    paddingVertical: 5,
  },
  fcNameStyle: {
    fontWeight: 'bold',
    color: theme.colors.red,
    fontSize: normalize(15),
    width: '75%',
  },
  fcNameDateWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 7,
  },
  txtStyle: {
    fontWeight: 'bold',
    fontSize: normalize(13),
    marginVertical: 5,
  },
  totalPerTenant: {
    fontWeight: 'bold',
    fontSize: normalize(13),
    marginVertical: 5,
    alignSelf: 'flex-end',
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
});

function PastOrder({navigation}) {
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
    if (status === 'PICKED_UP') {
      return 'Status: Order already picked-up';
    } else {
      return 'Status: Your order is complete';
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
      <TouchableOpacity
        style={styles.orderContainer}
        key={idx}
        onPress={() =>
          navigation.navigate('Order Detail', {
            foodcourtName: item.foodcourtName,
            transactionDate: item.date,
            seatNum: item.seatNum,
            totalSeat: item.totalSeat,
            totalPrice: item.totalPrice,
            orderList: item.orderList,
          })
        }>
        <View style={styles.fcNameDateWrapper}>
          <Text style={styles.fcNameStyle} numberOfLines={1}>
            {item.foodcourtName}
          </Text>
          <Text>{renderDate(item.date)}</Text>
        </View>
        {item.orderList.map((itm, key) => {
          return (
            <View key={key}>
              <Text style={styles.txtStyle}>
                {`${itm.tenantName} (Order Number: ${itm.orderNum})`}
              </Text>
              <Text style={styles.itemStatusStyle}>
                {`${itm.items} items   ${renderStatus(itm.status)}`}
              </Text>
              <Text style={styles.totalPerTenant}>
                {`Total: Rp ${renderPrice(itm.subtotal)}`}
              </Text>
            </View>
          );
        })}
        <Text style={styles.txtStyle}>{`Seat Number : ${item.seatNum}`}</Text>
      </TouchableOpacity>
    );
  };

  async function getPastOrder() {
    setIsLoading(true);
    const tenantId = await getDataTenantAdmin();
    try {
      const response = await axios.get(
        `https://food-planet.herokuapp.com/orders/tenant?tenantId=${tenantId}&status=PICKED_UP&status=FINISHED`,
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
    getPastOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Title text="Past Order" txtStyle={styles.titleText} />
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
          <ScrollView>
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

export default PastOrder;
