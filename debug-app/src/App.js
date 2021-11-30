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

import {
  DepartmentM
} from "./components/Department"

import Home from "./Home";
import Prehled from "./Prehled";

function Separate(props) {
  const {id}=useParams();
  const {type}=useParams();

  if(type==='person') {
    return (<PersonM id={id} name={'Stredni'} lastname={'Osoba'}/>)
  }
  else if(type==='group') {
    return (<GroupM id={id} name={'23/5KB'} />)
  }
  else if (type==='department') {
    return (<DepartmentM id={id} name={'K209'} appRoot={props.appRoot} />)
  }
}

export default function App(props) {
  return (
    <Router>
      <Routes>
        <Route path={'/'} element={<Home appRoot={props.appRoot}/>} />
        <Route path={props.appRoot+'/:type/:id'} element={<Separate appRoot={props.appRoot}/>} />
        <Route path={props.appRoot+'/prehled'} element={<Prehled appRoot={props.appRoot}/>} />
      </Routes>
    </Router>
  );
}