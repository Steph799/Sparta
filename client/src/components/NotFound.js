import React from 'react';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router';
import jwtDecode from 'jwt-decode';

const NotFound = (props) => {
    const history = useHistory();
    const token = props.history.location.state
    const user = token ? jwtDecode(token) : null 

    const redirect = () => {
        if (user && user.isAdmin) history.push(`/catalog`, { manager: 'Manager' });
        else if (user && !user.isAdmin) history.push(`/catalog`, { userMember: user.userName, userData: user });
        else history.push(`/catalog`);
    };
  
    return (
        <div>
            <h1>404 - Not Found!</h1>
            <Button
                color="primary"
                style={{ align: 'left' }}
                onClick={redirect}
            >
                Return to catalog
            </Button>
        </div>
    )
}


export default NotFound;
