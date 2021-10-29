import './App.css';
import Catalog from './components/Catalog';
import { Route, Redirect, Switch } from 'react-router-dom';
import LoginForm from './components/login/LoginForm';
import AdminForm from './components/login/AdminForm';
import BuyForm from './components/BuyForm';
import ItemForm from './components/manager & members/ItemForm';
import UserForm from './components/manager & members/UserForm';
import Cart from './components/Cart';
import NotFound from './components/NotFound';


function App() {
  return (
    <div className="App">
      {/* Check React Routing V6 */}
      {/* All the routing path should be in a urlPath file in the folder const */}
      
      <Switch>
        <Route path="/catalog" render={(props) => <Catalog {...props} />}/>
        <Route path="/login" component={LoginForm} />
        <Route path="/admin" component={AdminForm} />
        <Route path="/buy" render={(props) => <BuyForm {...props} />} />
        <Route path="/cart" render={(props) => <Cart {...props} />} />
        <Route path="/additem" render={(props) => <ItemForm {...props} />} />
        <Route path="/edititem" render={(props) => <ItemForm {...props} />} />
        <Route path="/adduser" render={(props) => <UserForm {...props} />} />
        <Route path="/edituser" render={(props) => <UserForm {...props} />} />
        <Route path="/notfound" render={(props) => <NotFound {...props} />}  />
        <Redirect from="/" exact to= "/catalog" />
        <Redirect to="/notfound" />
      </Switch>
    </div>
  );
}

export default App;

