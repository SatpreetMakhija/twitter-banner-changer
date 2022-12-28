import React, {useState, useEffect} from "react";
import axios from "axios";
function Admin() {

    const [isAdmin, setIsAdmin] = useState(null);

    useEffect(() => {

        async function fetchIsAdmin() {
            try {
                
                let response = await axios.get("http://localhost:8000/admin", {withCredentials: true} );
                if (response.status == "200") {
                    setIsAdmin(true);
                } 
            } catch (err) {
                if (err.response.status == "403") {
                    setIsAdmin(false);
                    window.location.href = "/";
                }
               console.log(err);
            }
        }
        fetchIsAdmin();

    }, []);




    return (

        <div>
            {isAdmin ? (<h1>This is the admin page</h1>) : (<h1>Loadin...</h1>)}
        </div>
    )
};

export default Admin;