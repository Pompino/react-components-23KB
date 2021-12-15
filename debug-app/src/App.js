import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams
} from "react-router-dom";

import { StudentL } from "./entities/persons/Student";
import { TeacherL } from "./entities/persons/Teacher";
import { GroupL } from "./entities/group/Group";
import { DepartmentL } from "./entities/department/Department"

import Home from "./Home";
import Prehled from "./Prehled";
import { PersonL } from "./entities/persons/Person";
import { FacultyL } from "./entities/faculty/Faculty";


function Separate(props) {
  const {id}=useParams();
  const {type}=useParams();

  if(type==='student') {
    return (<StudentL id={id} name={'Josef'} lastname={'Vrba'} appRoot={props.appRoot}/>)
  }
  else if(type==='group') {
    return (<GroupL id={id} name={'23-5KB'} appRoot={props.appRoot}/>)
  }
  else if (type==='department') {
    return (<DepartmentL id={id} name={'K-209'} appRoot={props.appRoot} />)
  }
  else if (type==='teacher') {
    return (<TeacherL id={id} name={'Jan'} lastname={'Kolomaz'} appRoot={props.appRoot} />)
  }
  else if (type==='faculty') {
    return (<FacultyL id={id} name={'FVK'} appRoot={props.appRoot}/>)
  }
}

function BasicPerson(props) {
  const {id}=useParams();

  return (<PersonL id={id} name={'Jan'} lastname={'Kolomaz'} {...props} />)
}

export default function App(props) {
  return (
    <Router>
      <Routes>
        <Route path={'/'} element={<Home appRoot={props.appRoot}/>} />
        <Route path={props.appRoot+'/:type/:id'} element={<Separate appRoot={props.appRoot}/>} />
        <Route path={props.appRoot+'/prehled'} element={<Prehled appRoot={props.appRoot}/>} />
        <Route path={props.appRoot+'/person/:id'} element={<BasicPerson appRoot={props.appRoot}/>} />
        <Route path={props.appRoot+'/MediumNULL'} element={<div>Z meidum komponent odkazy nefunguji</div>}/>
      </Routes>
    </Router>
  );
}