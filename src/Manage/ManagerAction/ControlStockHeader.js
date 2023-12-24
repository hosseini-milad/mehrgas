import { useState } from "react";
import TextField from '@material-ui/core/TextField';

function ControlStockHeader(props){
    const orderData = props.orderData;
    const [description,setDescription] = useState('')
    const [ghabzValue,setGhabzValue]= useState({ghabzIn:'',ghabzOut:'',cert:''})
    //console.log(orderData)
    return(
        <>
        {orderData.status==="saleControl"?
            <div className='rxButton'>
                <TextField label="قبض دریافت" value={ghabzValue.ghabzIn} 
                onChange={(e)=>setGhabzValue(ghabz => ({
                    ...ghabz,
                    ...{ghabzIn:e.target.value}
                  }))}/>
                <br/>
                <br/>
                <TextField label="قبض پرداخت" value={ghabzValue.ghabzOut} 
                onChange={(e)=>setGhabzValue(ghabz => ({
                    ...ghabz,
                    ...{ghabzOut:e.target.value}
                  }))}/>
                <br/>
                <br/>
                <TextField label="شماره مجوز" value={ghabzValue.cert} 
                onChange={(e)=>setGhabzValue(ghabz => ({
                    ...ghabz,
                    ...{cert:e.target.value}
                  }))}/>
                <br/>
                <br/>
                <textarea className='textAreaOrder' value={description} rows="3"
                placeholder="توضیحات"
                    onChange={(e)=>setDescription(e.target.value)}></textarea>
                <br/>
                <br/>
                <button onClick={()=>props.setAlertShow(pState => {
                        return { ...pState, show: true,title:"تایید سفارش",text:"آیا از تایید سفارش و تایید موجودی اطمینان دارید؟" ,
                        part:"",status:"outVehicle", data:ghabzValue,
                        description:orderData.description+"کنترل: "+description+"<br/>",reason:""}
                        })} className='editOrderButton acceptBtn'>تایید</button>
                
                <button onClick={()=>props.setAlertShow(pState => {
                        return { ...pState, show: true,title:"لغو سفارش",text:"دلیل لغو سفارش را ذکر کنید:",
                            part:"کنترل",status:"cancel",reason:"دلیل لغو" }
                        })} className='cancelBtnHolder cancelBtn'>لغو</button>
                </div>:''}</>
    )
}
export default ControlStockHeader