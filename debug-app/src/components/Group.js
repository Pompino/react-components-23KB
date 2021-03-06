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
            <Card.Body>
                <Card.Title><GroupS id={props.id} name={props.name}/></Card.Title>
                <Card.Text>
                    <Row>Jmeno:     Prijmeni:   </Row>
                    <Row>Titul:     Rocnik:     Skupina:    </Row>
                    <Row>E-mail: Telefon: </Row>
                </Card.Text>
            </Card.Body>
        </Card>
    )
}