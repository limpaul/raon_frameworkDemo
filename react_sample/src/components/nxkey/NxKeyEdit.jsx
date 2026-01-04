import NxKeyDecodeBtn from "./NxKeyDecodeBtn";

function NxKeyEdit({type, id, name, datatype, maxlength, datasecuirty ,enc, placeholder}){
    return (
        <>
            <input type={type} id={id} name={name} data-datatype={datatype} maxLength={maxlength} data-security={datasecuirty} data-enc={enc} placeholder={placeholder}/>
            {
                enc=="on"&&(<NxKeyDecodeBtn id={id}/>)
            }
        </>
    )
}
export default NxKeyEdit;