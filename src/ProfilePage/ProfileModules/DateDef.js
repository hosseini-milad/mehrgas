import { useEffect } from "react";
import { useState } from "react";


function DateDef(props){
var tempCounter = !tempCounter&&props.countDown;
    /*const [sec,setSec] = useState(tempCounter+60*60*1000);
    useEffect(() => {

        const interval = setInterval(() => {
            setSec(sec - 1000);
          }, 1000);
          return () => clearInterval(interval);
    }, [sec]);*/
    const msToTime=(milliseconds)=>{
        
        let seconds = Math.floor(milliseconds / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);

        seconds = seconds % 60;
        minutes = seconds >= 60 ? minutes + 1 : minutes;
        minutes = minutes % 60;
        hours = hours % 24;
        return `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
    }
    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
      }
    const order = props.orderData
    return(
        <>
        {   (order.status==="inprogress"||order.status==="inVehicle"||
        order.status==="saleControl")?
            <button onClick={()=>props.setAlertShow(pState => {
                    return { ...pState, show: true,title:"لغو سفارش",text:"دلیل لغو سفارش را ذکر کنید:",
                part:"کارخانه", status:"cancel",reason:"دلیل لغو" }
                    })} className='cancelBtnHolder cancelBtn'>لغو سفارش</button>   
            :<></>    }
        </>
    )
}
export default DateDef