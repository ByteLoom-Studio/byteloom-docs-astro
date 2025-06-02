import {useEffect} from 'react';

export function AuthenticationController() {
    useEffect(() => {
       //console.log(123)
        setTimeout(()=>{
            //go to login page
            //window.location.href = "/starlight/authentication/login";
        },1000)
    }, []);
    return <></>
}