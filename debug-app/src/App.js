import {
  BrowserRouter as Router,
  Switch,
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

function Separate() {
  const {id}=useParams();
  const {size}=useParams();
  const {type}=useParams();

  if(type==='person') {
    if(size==='m') 
      return (<PersonM id={id} name={'Stredni'} lastname={'Osoba'}/>)
    else if(size==='s') 
      return (<PersonS id={id} name={'Malej'} lastname={'Pan'}/>)
  }
  else if(type==='group') {
    if(size==='s') 
      return (<GroupS id={id} name={'23/5KB'}/>)
    else if(size==='m')
      return (<GroupM id={id} name={'23/5KB'}/>)
  }

}

export default function App(props) {
  return (
    <Router>
      <Switch>
        <Route path={props.appRoot+'/:type/:size/:id'}>
          <Separate />
        </Route>
      </Switch>
    </Router>
  );
}