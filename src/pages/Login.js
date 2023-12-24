import { TextField } from "@material-ui/core"
import { useEffect, useState } from "react"
import ReactCodeInput from 'react-verification-code-input';
import env from "../env";
const userName = JSON.parse(localStorage.getItem('lenz-login'));

function Login(){
    const[step,setStep] = useState(0);
    const [otpCode,setOtp] = useState('');
    const [error,setError] = useState('');
    const [passLogin,setPassLogin] = useState('');
    const [phoneNumber,setPhoneNumber] = useState(userName?userName.phone:'');
    const[fill,setFill] = useState(phoneNumber&&(phoneNumber.length>5)?1:0);
  
    useEffect(()=>{
      if(otpCode.length===4)checkOTP()
    },[otpCode])

    const sendSms=()=>{
    const postOptions={
      method:'post',
      headers: { 
        'Content-Type': 'application/json'},
        body:JSON.stringify({
            "phone":phoneNumber
            }  )
    }

    fetch(env.siteApi+"/auth/otpSend",postOptions)
      .then(res => res.json())
      .then(
        (result) => {
          
          console.log(result)
        },
        (error) => {
          console.log(error);
        }
      )
    
        setStep(1);
        setFill(0)
    }
    const loginPassword=()=>{
      setPassLogin(1)
    }
    const checkOTP=()=>{
        const postOptions={
            method:'post',
            headers: { 
            'Content-Type': 'application/json'},
            body:JSON.stringify({
                "phone":phoneNumber,
                "otp":otpCode
                }  )
        }
        fetch(env.siteApi+"/auth/otpLogin",postOptions)
        .then(res => res.json())
        .then(
          (result) => {
            if(!result.error){
                localStorage.setItem('token-lenz',JSON.stringify(
                {"token":result.token,
                "mobile":phoneNumber,
                "access":result.access,
                "userId":result._id}));
                localStorage.setItem('lenz-login',JSON.stringify(
                  {phone:phoneNumber,date:Date.now()}));
            setError({errorText:"با موفقیت وارد سایت شدید",
                      errorColor:"green"});
                setTimeout(()=>document.location.href="/",2000);
            }
            else
            setError({errorText:"کد دریافتی اشتباه است",
                    errorColor:"red"}) 
          },
          (error) => {
              
            console.log(error);
          }
        )
      }
    const changePhone=(e)=>{
        setPhoneNumber(e.value)
        if(e.value.length>5)
            setFill(1)
        else
            fill&&setFill(0)
    }
    const checkLogin=()=>{
      const postOptions={
        method:'post',
        headers: { 
          'Content-Type': 'application/json'},
          body:JSON.stringify({
              "phone":phoneNumber,
              "password":passLogin
              }  )
      }
      setError({errorText:"لطفا صبر کنید",
      errorColor:"orange"});
      fetch(env.siteApi+"/auth/login",postOptions)
        .then(res => res.json())
        .then(
          (result) => {
            fetch(env.siteApi+"/auth/login",postOptions)
        .then(res => res.json())
        .then(
          (result) => {
            if(result.error){
            setError({errorText:result.error,
              errorColor:"red"});
              return
            }
            else{

//console.log(result)
localStorage.setItem('token-lenz',JSON.stringify(
  {"token":result.token,
  "mobile":phoneNumber,
  "access":result.access,
  "group":result.group,
  "userId":result._id}));
  localStorage.setItem('lenz-login',JSON.stringify(
    {phone:phoneNumber,date:Date.now()}));
setError({errorText:"با موفقیت وارد سایت شدید",
        errorColor:"green"});
  setTimeout(()=>document.location.pathname==="/login"?
    (result.access==="customer"?document.location.href="/profile":
     (!result.access?document.location.href="/profile#account":
      document.location.href="/manager")):
     document.location.reload(),1500);

            }
          },
          (error) => {
            setError({errorText:error.error,
                    errorColor:"red"});
            
          }
        )
            
          },
          (error) => {
            setError({errorText:error.error ,
                    errorColor:"red"});
          }
        )
        .catch((error)=>{
          console.log(error)
        })
    }

    return(
        <main className="pagesMain">
            {step===0?<div className="loginMain">
                <h2>ورود / ثبت نام</h2>
                <TextField variant="standard"
                    label="شماره موبایل/نام کاربری"
                    style={{width:"100%"}}
                    value={phoneNumber?phoneNumber:''}
                    onChange={(value)=>changePhone(value.target)}
                    onKeyDown={(e)=>{(e.key)==='Enter'&&(fill?/*sendSms()*/setStep(2):setStep(2))}}/> 
                    <br/>
                <div className="buttons">
                  <input type="button" className="loginBtn" value="ورود با رمز عبور" onClick={()=>setStep(2)}/>
                  <input type="button" className={fill?"loginBtn loginFillBtn":"disableLoginBtn loginBtn"} value="ورود با پیامک" onClick={()=>fill?sendSms():{}}/>
                </div>
                {/*<small>با ورود و یا ثبت نام در ام‌جی‌ام‌لنز، شما شرایط و قوانین استفاده از تمام سرویس های سایت ام‌جی‌ام‌لنز و قوانین حریم خصوصی آن را می‌پذیرید.</small>*/}
            </div>:""}
            {step===1?<div className="loginMain">
                <h2 style={{marginBottom: "0"}}>ورود با شماره موبایل</h2>
                <small>کد ارسال شده به شماره موبایل {phoneNumber} را وارد نمایید</small>
                <ReactCodeInput fields={4} onComplete={()=>setFill(1)}
                    value={otpCode} onChange={(e)=>setOtp(e)}/>
                <small style={{color:error.errorColor}}>{error.errorText}</small>
                <a href="" className="resend">ارسال مجدد</a>
                {/*<input type="button" className={fill?"loginBtn loginFillBtn":"loginBtn"} value="ورود" 
                onClick={()=>checkOTP()}/>*/}
                {/*<small>با ورود و یا ثبت نام در ام‌جی‌ام‌لنز، شما شرایط و قوانین استفاده از تمام سرویس های سایت ام‌جی‌ام‌لنز و قوانین حریم خصوصی آن را می‌پذیرید.</small>*/}
            </div>:""}
            {step===2?<div className="loginMain">
                <h2 style={{marginBottom: "0"}}>ورود با نام کاربری</h2>
                <small>رمز عبور خود را وارد نمایید</small><br/>
                <TextField variant="standard"
                    label="رمز عبور"
                    type="password"
                    inputRef={input => input && input.focus()}
                    style={{width:"100%"}}
                    value={passLogin?passLogin:''}
                    onChange={(value)=>setPassLogin(value.target.value)}
                    onKeyDown={(e)=>{(e.key)==='Enter'&&checkLogin()}}/> 
                <small style={{color:error.errorColor}}>{error.errorText}</small>
                <a href="" className="resend"><sub>بازگشت</sub></a>
                <input type="button" className={fill?"loginBtn loginFillBtn":"loginBtn"} value="ورود" 
                onClick={()=>checkLogin()}/>
                {/*<small>با ورود و یا ثبت نام در ام‌جی‌ام‌لنز، شما شرایط و قوانین استفاده از تمام سرویس های سایت ام‌جی‌ام‌لنز و قوانین حریم خصوصی آن را می‌پذیرید.</small>*/}
            </div>:""}
        </main>
    )
}
export default Login