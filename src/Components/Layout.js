import { useEffect, useState } from 'react'
import env from '../env'
import Footer from './Footer'
import Header from './Header'
//import SimpleFetch from './simpleFetch'
const token = JSON.parse(localStorage.getItem('token-lenz'))

function Layout(props){
    const [layout,setLayout] = useState('') 
    const [user,setUser] = useState('') 
    useEffect(()=>{
        const postOptions={
            method:'get',
            headers: {'Content-Type': 'application/json',
            userid:token&&token.userId,
        }
          }
       fetch(env.siteApi + "/layout",postOptions)
      .then(res => res.json())
      .then(
        (result) => {
            setUser(result.user)
        },
        (error) => {
          console.log(error);
        })
    },[])
    const url = document.location.pathname.split('/')[1];
    //const access = token&&token.access==="factory"
    return(
        <>
            {url!=="print"&&<Header data={layout} user={user}/>}
            {props.children}
            {url!=="print"&&<Footer data={layout}/>}
        </>
    )
}
export default Layout