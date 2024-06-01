import { useEffect, useState } from "react";
import BreadCrumb from "../Components/BreadCrumb"
import SimpleAuth from "../Components/simpleAuth";
import env from "../env";
import ProfileSection1 from "../ProfilePage/ProfileSection1";
import ProfileSection2 from "../ProfilePage/profileSection2";
import ProfileSection3 from "../ProfilePage/profileSection3";
import ProfileSection4 from "../ProfilePage/profileSection4";
import ProfileSection5 from "../ProfilePage/profileSection5";
import ProfileSection6 from "../ProfilePage/profileSection6";
import ProfileTab from "../ProfilePage/profileTab"
import ManageMessages from "../Manage/ManageMessages";

function Profile(){
    const [tabIndex,setTabIndex] = useState(0);
    const userData= SimpleAuth(env.siteApi+"/auth/userInfo")
    //console.log(userData)
    const [logs,setLogs] = useState('')
    //console.log(tabIndex)
    useEffect(() => {
        const postOptions={
            method:'post',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({status:"unread",kind:"customer"})
          }
          //console.log(postOptions)
        fetch(env.siteApi + "/setting/log",postOptions)
      .then(res => res.json())
      .then(
        (result) => {
            setLogs(result)
        },
        (error) => {
          console.log(error);
        }
        
    )},[])
    if(userData.error){
        localStorage.removeItem('token-lenz');
        window.location="/login";
    } 
    useEffect(() => {
        window.scrollTo(0, 70);
    },[tabIndex])
    return(
        <main className="pagesMain">
            <BreadCrumb />
            <ProfileTab index={tabIndex} setTabIndex={setTabIndex}/>
            {tabIndex===1&&<ProfileSection1/>}
            {tabIndex===2&&<ProfileSection2 />}
            {tabIndex===3&&<ProfileSection3 />}
            {tabIndex===4&&userData&&<ProfileSection4 addressData={userData.userAddress}/>}
            {tabIndex===5&&<ManageMessages logs={logs}/>}
            {tabIndex===6&&userData&&<ProfileSection6 jobData={userData.jobData}
                user={userData.user} userData={userData.userInfo}/>}
        </main>
    )
}
export default Profile