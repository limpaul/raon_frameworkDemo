import { Link } from "react-router-dom";

function LinkComponent(){
    return (
        <ul>
          <li><Link to="/">메인페이지</Link></li>
          <li><Link to="/transkey">웹 가상키패드 샘플</Link></li>
          <li><Link to="/mtranskey">모바일 웹 가상키패드 샘플</Link></li>
          <li><Link to="/nxkey">키보드보안 샘플</Link></li>
          <li><Link to="/nxkey/e2e">키보드보안 구간암호화 샘플</Link></li>
          <li><Link to="/nxkey_e2e_transkey">키보드보안 웹 가상키패드 샘플</Link></li>
        </ul>
    )
}
export default LinkComponent;