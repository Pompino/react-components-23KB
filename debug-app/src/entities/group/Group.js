import { Link } from "react-router-dom";

import Card from 'react-bootstrap/Card';
import { Row } from "react-bootstrap";

export function GroupS(props) {
    return (
        <Link to={props.appRoot+"/group/"+props.id}>{props.name}</Link>
    )
}

export function GroupM(props) {
    return (
        <Card>
            <Card.Header>
                <Card.Title><GroupS {...props}/></Card.Title>
            </Card.Header>
            <Card.Body>
                Jmeno:     Prijmeni:<br/>
                Titul:     Rocnik:     Skupina:<br/>
                E-mail: Telefon:
            </Card.Body>
        </Card>
    )
}

export function GroupL(props) {

    return (
        <div>
            work in progress...
        </div>
    )
}