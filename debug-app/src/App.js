import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams
} from "react-router-dom";

import {
  PersonS,
  PersonM
} from "./components/Person";

import {
  GroupM,
  GroupS
} from "./components/Group";

import Home from "./Home";
import Prehled from "./Prehled";

function Separate() {
  const {id}=useParams();
  const {type}=useParams();

  if(type==='person') {
    return (<PersonM id={id} name={'Stredni'} lastname={'Osoba'}/>)
  }
  else if(type==='group') {
    return (<GroupM id={id} name={'23/5KB'}/>)
  }
}

export default function App(props) {
  return (
    <Router>
      <Routes>
        <Route path={props.appRoot+'/home'} element={<Home appRoot={props.appRoot}/>} />
        <Route path={props.appRoot+'/:type/:id'} element={<Separate />} />
        <Route path={props.appRoot+'/prehled'} element={<Prehled />} />
      </Routes>
    </Router>
  );
}