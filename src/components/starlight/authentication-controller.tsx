import {useEffect} from 'react';

export function AuthenticationController() {
    useEffect(() => {
        const login=localStorage.getItem('login');
        if(!login){
            window.location.href = '/authentication/authentication';
        }
    }, []);
    return <></>
}