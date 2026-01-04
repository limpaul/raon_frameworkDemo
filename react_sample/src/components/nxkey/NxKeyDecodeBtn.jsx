import axios from "axios";

function NxKeyDecodeBtn({id}){
    const ajaxTest = () => {
        const hidKeyData = document.getElementById('hid_key_data').value;
        const e2eData = document.getElementById('E2E_'+id).value;
        axios.post('/api/nxkey/decode', {
            id:id,
            hidKeyData:hidKeyData,
            e2eData: e2eData
        }, {
            headers : {
                "Content-Type":'application/json'
            }
        }).then(res => {
            alert(`status: ${res.data.status} / plainData: ${res.data.data}`)
        })
    }
    return (<>
        <button onClick={ajaxTest}>복호화</button>
    </>)
}
export default NxKeyDecodeBtn;