import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useHttpRequestService } from "../../service/HttpRequestService";
import Loader from "../loader/Loader";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);
    const http = useHttpRequestService();
    const location = useLocation();

    useEffect(() => {
      const token = localStorage.getItem("token");
      // no estan loggeados
      if (!token) {
        setLoading(false);
        setIsAuth(false);
      } else {
        http.isLogged()
          .then((ok) => setIsAuth(ok))
          .catch(() => setIsAuth(false))
          .finally(() => setLoading(false));
      }
    }, [http]);

    if (loading) {
      return <Loader />;
    }

    if (!isAuth) {
      return (
        <Navigate
          to="/sign-in"
          state={{ from: location.pathname }}
          replace
        />
      );
    }

    return children;
};

export default ProtectedRoute;