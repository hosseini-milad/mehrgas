import { useState } from "react";

function ManageStockHeader(props){
    const orderData = props.orderData;
    const [description,setDescription] = useState('')
    //console.log(orderData,props)
    return(
        <>
        {orderData.status==="inprogress"?
            <div className='rxButton'>
                <textarea className="textAreaOrder" value={description} rows="3"
                    onChange={(e)=>setDescription(e.target.value)}></textarea>
                <button onClick={()=>props.setAlertShow(pState => {
                        return { ...pState, show: true,title:"تایید سفارش",text:"آیا از تایید سفارش و تایید موجودی اطمینان دارید؟" ,
                        part:"",status:"inVehicle",
                        description:orderData.description+"مدیریت: "+description+"<br/>",reason:""}
                        })} className='editOrderButton acceptBtn'>تایید</button>
                <button onClick={()=>window.location.href="/stock-edit/"+orderData.stockOrderNo} 
                    className='editOrderButton orangeBtn'>ویرایش</button>
                <button onClick={()=>props.setAlertShow(pState => {
                        return { ...pState, show: true,title:"لغو سفارش",text:"دلیل لغو سفارش را ذکر کنید:",
                            part:"کارخانه",status:"cancel",reason:"دلیل لغو" }
                        })} className='cancelBtnHolder cancelBtn'>لغو</button>
                </div>:''}</>
    )
}
export default ManageStockHeader