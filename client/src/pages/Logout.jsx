import { useEffect } from "react";

const Logout = (props) => {
    useEffect(() => {
        fetch("/api/auth/logout", {
            method: "POST",
            headers: { "Authorization": "Bearer " + sessionStorage.getItem("auth_token") }
        }).then((response) => {
            return response.json();
        }).then((res) => {
            sessionStorage.clear("auth_token");
            localStorage.clear("auth_token");
            window.location = "/";
        });
    }, []);
    return (
        <div>

        </div>
    );
}

export default Logout;