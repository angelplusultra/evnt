import {Outlet, Navigate} from 'react-router-dom';

const Protect = () => {
const user = true

    return ( user ? <Outlet /> : <Navigate to="/login" />);
}
 
export default Protect;