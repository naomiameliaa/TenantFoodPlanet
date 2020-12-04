import * as React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthContext} from './context';
import {getData} from './src/utils';
import LandingPage from './src/screens/LandingPage';
import HomePage from './src/screens/HomePage';
import OngoingOrder from './src/screens/OngoingOrderPage';
import PastOrder from './src/screens/PastOrderPage';
import ManageMenu from './src/screens/ManageMenuPage';
import ChangePassword from './src/screens/ChangePasswordPage';
import AddMenu from './src/screens/AddMenuPage';
import EditMenu from './src/screens/EditMenuPage';
import MenuDetail from './src/screens/MenuDetailPage';
import ForgotPassword from './src/screens/ForgotPassword';

const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen
      name="LandingPage"
      component={LandingPage}
      options={{headerShown: false}}
    />
    <AuthStack.Screen
      name="ForgotPasswordPage"
      component={ForgotPassword}
      options={{headerShown: false}}
    />
  </AuthStack.Navigator>
);

const HomeStack = createStackNavigator();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomePage"
        component={HomePage}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="Ongoing Order"
        component={OngoingOrder}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="Past Order"
        component={PastOrder}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="Manage Menu"
        component={ManageMenu}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="Add Menu"
        component={AddMenu}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="Edit Menu"
        component={EditMenu}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="Menu Detail"
        component={MenuDetail}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="Change Password"
        component={ChangePassword}
        options={{headerShown: false}}
      />
    </HomeStack.Navigator>
  );
}

const RootStack = createStackNavigator();
const RootStackScreen = ({tenantAdminData}) => (
  <RootStack.Navigator>
    {tenantAdminData ? (
      <RootStack.Screen
        name="HomeStackScreen"
        component={HomeStackScreen}
        options={{headerShown: false}}
      />
    ) : (
      <RootStack.Screen
        name="AuthStackScreen"
        component={AuthStackScreen}
        options={{headerShown: false}}
      />
    )}
  </RootStack.Navigator>
);

function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [tenantAdminData, setTenantAdminData] = React.useState(null);

  const getDataTenantAdmin = async () => {
    const dataTenantAdmin = await getData('tenantAdminData');
    if (dataTenantAdmin !== null) {
      setTenantAdminData(dataTenantAdmin);
    } else {
      setTenantAdminData(null);
    }
  };

  React.useEffect(() => {
    getDataTenantAdmin();
  }, []);

  const authContext = React.useMemo(() => {
    return {
      signIn: () => {
        setIsLoading(false);
        setTenantAdminData(getDataTenantAdmin());
      },
      signUp: () => {
        setIsLoading(false);
      },
      signOut: () => {
        setIsLoading(false);
        setTenantAdminData(null);
      },
    };
  }, []);
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <RootStackScreen tenantAdminData={tenantAdminData} />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
export default App;
