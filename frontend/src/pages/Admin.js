import React, {useState, useEffect} from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
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


    function fetchJobs() {
        window.location.href="http://localhost:8000/dash";
    }


    const adminPage = <div>
        <div>This is the admin page, brother.</div>
        <Button onClick={fetchJobs}>Jobs</Button>
    </div>


    return (

        <div>
            {isAdmin ? (adminPage) : (<h1>Loadin...</h1>)}
        </div>
    )
};

export default Admin;