import {React, useEffect} from "react";


function Admin () {
    useEffect(()=>{
        window.location.href="http://localhost:8000/dash"
    }, []);



}

export default Admin;