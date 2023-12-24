import { useState } from "react"
import persianDate from 'persian-date';
import DateDefShow from "../ProfilePage/ProfileModules/DateDefShow";
import DateCountDown from "../ProfilePage/ProfileModules/DateCountDown";

const token = JSON.parse(localStorage.getItem('token-lenz'));
var loginDate = "";
    try{loginDate =JSON.parse(localStorage.getItem('lenz-login'));}
    catch{}

const Header = (props)=>{
    //console.log(loginDate.date)
    persianDate.toCalendar('persian');
    var pDate = ""; 
    if(loginDate&&loginDate.date)pDate=new persianDate(new Date(loginDate.date)).format();
    var pWeek = "";
    if(loginDate&&loginDate.date)pWeek=new persianDate(new Date(loginDate.date)).format('dddd');
    
    var countDown = "";
    if(loginDate&&loginDate.date)countDown=(new Date())-(new Date(loginDate.date));
    //console.log(countDown)
    
    const[megaMenu,setMegaMenu]= useState(0);
    const[convasMenu,setConvasMenu] = useState(0)

    return(
        <header>
            <div className="topHeader">
                <div className={convasMenu?"convasMenu convasActive":"convasMenu"}>
                    <div className="convasHeader">
                        <i className="icon-size fas fa-close" onClick={()=>setConvasMenu(0)}></i>
                        <a className="header3 logoTab" href="/">
                            <img src="/logo.svg" alt="MGM lens"/>
                        </a>
                    </div>
                    <div className="mainMenuConvas">
                        <a className="menuConvasItem activeMenu" href="https://mehrgaz.com">
                            صفحه اصلی
                        </a>
                        <a className="menuConvasItem" href="/order">
                            سفارش آنلاین
                        </a>
                        <a className="menuConvasItem" href="/services">
                            خدمات مهرگاز
                        </a>
                        <a className="menuConvasItem" href="/about">
                            درباره ما
                        </a>
                        <a className="menuConvasItem" href="/contact">
                            تماس با ما
                        </a>
                        <a className="menuConvasItem" href="/download/mehrgas.apk">
                            دانلود نرم افزار سفارشات
                        </a>
                    </div>
                </div>
                <div className="header3 eSpace showMobile">
                    <div className="menuConvas">
                        
                        <i className="icon-size fas fa-bars" onClick={()=>setConvasMenu(1)}></i>
                        
                    </div>
                </div>
                <a className="header3 logoTab" href="/">
                    <img src="/logo.svg" alt="MGM lens"/>
                    <div className="header3 eSpace"></div>
                </a>
                <div className="header3 eSpace showDesktop">
                </div>
                <div className="header3">
                    
                    
                    {props.user?<a className="headerTab bellTab showDesktop" >
                        <i className="icon-size fas fa-credit-card"></i>
                        <span >اعتبار: {props.user.credit}</span>
                    </a>:<></>}
                    {token&&token.access&&token.access!=="customer"?<a className="headerTab" href={"/manager"}>
                        <i className="icon-size fas fa-user-o"></i>
                        <span>مدیریت</span>
                    </a>:
                    <a className="headerTab loginTab" href={!token?"/login":"/profile"}>
                    <i className="icon-size fas fa-user-o"></i>
                    {!token?<div className="buttons topBtn">
                        <span className="loginTopBtn">ورود / ثبت نام</span>
                    </div>:<span>حساب کاربری</span>}
                </a>}
                </div>
            </div>
            <div className="mainMenu">
                <div style={{display: "flex"}}><a className="menuItem activeMenu" href="https://mehrgaz.com">
                    صفحه اصلی
                </a>
                
                <div className="menuItem">
                    <a className="menuItem activeMenu" href="/order">
                    سفارش آنلاین
                    </a>
                </div>
                <a className="menuItem" href="/services">
                    خدمات مهرگاز
                </a>
                <a className="menuItem" href="/about">
                    درباره ما
                </a>
                <a className="menuItem" href="/contact">
                    تماس با ما
                </a>
                <a className="menuItem" href="/download/mehrgas.apk">
                    دانلود نرم افزار سفارشات
                </a></div>
                {/*countDown&&token&&<DateDefShow countDown={countDown} />*/}
                {token&&<DateCountDown />}
            </div>
        </header>
    )
}
export default Header