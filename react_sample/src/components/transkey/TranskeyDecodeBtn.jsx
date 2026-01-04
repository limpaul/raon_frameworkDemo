import axios from "axios";

function TranskeyDecodeBtn({id}){
    const decode = () => {
        window.tk.fillEncData();
        const initTime = document.getElementById('initTime').value;
        const keyboardType = document.getElementById('keyboardType_'+id).value;
        const keyIndex = document.getElementById('keyIndex_'+id).value;
        const fieldType = document.getElementById('fieldType_'+id).value;
        const seedKey = document.getElementById('seedKey').value;
        const encoded = document.getElementById('transkey_'+id).value;
        const hmEncoded = document.getElementById('transkey_HM_'+id).value;

        axios.post('/api/transkey/decode', {
            id:id,
            initTime: initTime,
            keyboardType: keyboardType,
            keyIndex: keyIndex,
            fieldType: fieldType,
            seedKey: seedKey,
            encoded: encoded,
            hmEncoded: hmEncoded
        },{
            headers:{
                'Content-Type':'application/json'
            }
        }).then(res => {
            alert(res.data.status + "/ " + res.data.data);
        })
    }
    return (<>
        <button onClick={decode}>복호화</button>
    </>)
}
export default TranskeyDecodeBtn;