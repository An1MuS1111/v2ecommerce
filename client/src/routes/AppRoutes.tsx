
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import EditProfile from '../pages/EditProfile';
// import { Login, Signin, Landing, CreateProduct, ProductPage } from '../pages';
import ProtectedRoute from './ProtectedRoute';
// import { useAuth } from '../auth/AuthProvider';

export default function AppRoutes() {
    const { token } = useAuth();

    return (
        <Routes>
            {/* Routes accessible only to non-authenticated users */}
            {!token ? (
                <>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signin" element={<Signin />} />
                    {/* Redirect any other path to login if not authenticated */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </>
            ) : (
                <>
                    {/* Protected routes for authenticated users */}
                    <Route path="/" element={<ProtectedRoute />}>
                        <Route path="/" element={<Landing />} />
                        {/* <Route path="/productpage" element={<ProductPage />} />
                        <Route path="/createproduct" element={<CreateProduct />} />
                        <Route path="/editprofile" element={<EditProfile />} /> */}

                    </Route>
                    {/* Redirect any other path to the landing page if authenticated */}
                    <Route path="*" element={<Navigate to="/" />} />
                </>
            )}
        </Routes>
    );
}