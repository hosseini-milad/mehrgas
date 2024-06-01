import TextField from '@material-ui/core/TextField';

function TempAlert(props){
    //console.log(alertData)
    return(
        <div className="alertHolder">
            <div className='alertPlace errorPlace'>
                <div className="alertTitle">
                    <h3>{props.title}</h3>
                </div>
                <div className="alertText" dangerouslySetInnerHTML={{__html:
                    props.text}}>
                </div>
                <div className='alertBtn'>
                    <input type="button" className='acceptBtn' value="تایید" onClick={
                        ()=>props.action()}/>
                    
                </div>
            </div>
        </div>
    )
}
export default TempAlert
