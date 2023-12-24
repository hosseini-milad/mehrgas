import { useState } from "react";

function SimpleStockHeader(props){
    const orderData = props.orderData;
    const [description,setDescription] = useState('')
    //console.log(orderData)
    return(
        <div className='rxButton'>
                <textarea className='textAreaOrder' value={description} rows="3"
                    placeholder="توضیحات"
                    onChange={(e)=>setDescription(e.target.value)}></textarea>
                <br/>
                <br/>
                <button onClick={()=>props.setAlertShow(pState => {
                        return { ...pState, show: true,title:"تایید سفارش",text:"آیا از تایید سفارش و تایید موجودی اطمینان دارید؟" ,
                        part:"",status:props.status,
                        description:orderData.description+"نگهبانی: "+description+"<br/>",reason:""}
                        })} className='editOrderButton acceptBtn'>تایید</button>
                
            </div>
    )
}
export default SimpleStockHeader