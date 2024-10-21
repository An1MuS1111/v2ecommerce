import "./App.css";
import TableLayout from "./views/components/TableLayout";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "./common/Loader";

// import AuthProvider from "./auth/AuthProvider";
// import { BrowserRouter as Router } from "react-router-dom";
// import AppRoutes from "./routes/AppRoutes";

function App() {
    const [loading, setLoading] = useState(true);
    // const { pathname } = useLocation();

    // useEffect(() => {
    //     window.scrollTo(0, 0);
    // }, [pathname]);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    return loading ? (
        <Loader />
    ) : (
        // <AuthProvider>
        //     <Router>
        //         <AppRoutes />
        //     </Router>
        // </AuthProvider>

        <>
            <TableLayout />
        </>
    );
}

export default App;
