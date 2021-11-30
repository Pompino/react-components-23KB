import {
    PersonS,
    PersonM
  } from "./components/Person";
  
import {
    GroupM,
    GroupS
  } from "./components/Group";

import { DepartmentM } from "./components/Department";
import { CardGroup } from "react-bootstrap";

export default function Prehled(props) {
    return (
        <CardGroup>
            <PersonM id={"765"} name={"TestSub"} />
            <GroupM id={"234"} name={"25-5KB"} />
            <DepartmentM id={"4234"} name={"k209"} {...props}/>
        </CardGroup>
    )
}