import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useEffect } from 'react';
import { useState } from 'react';
import env from '../../env';
const token = JSON.parse(localStorage.getItem('token-lenz'))
function Shop(props){
    const [faktorValue,setFaktorValue] = useState('');
    const [error,setError] = useState('')
    const [holdOrder,setHolderData]=useState('')
    const [faktorList,setFaktorList] = useState([])
    const [pageNumber,setPageNumber] = useState('')
    const [searchText,setSearch]=useState(0) 
    const [searchTrigger,setSearchTrigger]=useState(0)
    const [orderValue,setOrderValue] = useState()
    useEffect(()=>{
        //console.log(orderValue)
        if(!orderValue) return
        const postOptions={
            method:'post',
            headers: { 
              'Content-Type': 'application/json',
              'x-access-token':token.token,
            'userId':token.userId},
            body:JSON.stringify({status:props.status,search:orderValue,offset:pageNumber})
          }
          //console.log(postOptions)
          fetch(env.siteApi+"/order/rxSeprate/search",postOptions)
            .then(res => res.json())
            .then(
              (result) => {
                setFaktorList(existingItems => {
                    return [
                    ...existingItems.slice(0, faktorList.length),
                    result&&result[0]&&result[0].rxOrderNo,
                    ...existingItems.slice(faktorList.length + 1),
                    ]
                });
                changeOrderStatus(result&&result[0]&&result[0].rxOrderNo,"hold")
                if(result)setFaktorValue('')
              },
              (error) => {
                console.log({error:error});
              }
            )
            .catch((error)=>{
              console.log(error)
            })
          
    },[orderValue])
    useEffect(()=>{
        const postOptions={
            method:'post',
            headers: { 
              'Content-Type': 'application/json',
              'x-access-token':token.token,
            'userId':token.userId},
            body:JSON.stringify({status:"hold"})
          }
          //console.log(postOptions)
          fetch(env.siteApi+"/order/rxSeprate/search",postOptions)
            .then(res => res.json())
            .then(
              (result) => {
                setFaktorList(result&&result.map(item=>item.rxOrderNo))
              },
              (error) => {
                console.log({error:error});
              }
            )
            .catch((error)=>{
              console.log(error)
            })
        
    },[])
    const findRXOrderNo=(orderNo)=>{
        for(var i=0;i<props.orderData.length;i++)
            if(props.orderData[i].rxOrderNo&&
                props.orderData[i].rxOrderNo.includes(orderNo)){
                changeOrderStatus(props.orderData[i].rxOrderNo,"hold")
                return(props.orderData[i])
            }
        return(false)
    }
    const changeOrderStatus=(rxOrderNo,state)=>{
        //const acceptStatus = !reason&&window.confirm("تایید سفارش؟");
        const token = JSON.parse(localStorage.getItem('token-lenz'))
        const postOptions={
            method:'post',
            headers: { 
              'Content-Type': 'application/json',
              'x-access-token':token.token,
              'userId':token.userId},
              body:JSON.stringify({rxOrderNo:rxOrderNo,
                status:state})
        }
        //console.log(postOptions)
        fetch(env.siteApi+"/order/manage/addrx",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
            return(1);
            //setTimeout(()=>window.location.reload(),200)
            },
            (error) => {
            console.log(error);
            }
        )
        .catch((error)=>{
            console.log(error)
        })
    }
    const saveHolds=()=>{
        var done = 0;
        if(!faktorList.length){
            setError('سفارشی موجود نیست'); return
        }
        for(var i=0;i<faktorList.length;i++){
            const result = changeOrderStatus(faktorList[i],"completed");
            done+= result;
        }
        setError(' سفارشات تایید شد ')
        setTimeout(()=>window.location.reload(),2000)
    }
    return(

        <div className="kharidHolder">
            <div className="kharidInput">
                
                <TextField label="شماره سفارش" variant="outlined"
                value={faktorValue}
                onChange={(e)=>{setFaktorValue(e.target.value);
                var orderNo = '';
                if(e.target.value.length>5){
                    orderNo = setOrderValue(e.target.value)
                /*if(orderNo){
                    //changeOrderStatus(orderNo);
                    setFaktorList(existingItems => {
                        return [
                        ...existingItems.slice(0, faktorList.length),
                        orderNo.rxOrderNo,
                        ...existingItems.slice(faktorList.length + 1),
                        ]
                    })
                }*/
                
                }
                }}/>
            </div>
            <div className="orderTable">
                <table>
                    <tbody>
                        <tr>
                            <th>شماره سفارش</th>
                        </tr>
                        {faktorList&&faktorList.length&&faktorList.map((fl,i)=>(
                            <tr key={i}>
                                <td style={{minWidth:"200px"}}>{fl}</td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <input className='profileBtn' type="button" 
            onClick={saveHolds} value="ارسال سفارشات به مشتری"/>
            <small>{error}</small>
        </div>

    )
}
export default Shop