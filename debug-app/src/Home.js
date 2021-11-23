import { Container, Button} from "react-bootstrap"

function DarkMode() {
    var element = document.body;
    element.classList.toggle("dark-mode");
} 

export default function Home(props) {
    return (
        <Container>
            <h1 className="display-3">Rozcestník</h1>
            <hr />
            <Container>
                <ul className="list-group">
                    <li className="list-group-item"><h5>Přehled <b>MEDIUM </b>komponent <a href={props.appRoot+"/prehled"} className="btn btn-primary float-right">Link</a></h5></li>
                    <li className="list-group-item"><h5>Osoba <b>LARGE </b>komponenta <a href={props.appRoot+"/person/23"} className="btn btn-primary float-right">Link</a></h5></li>
                    <li className="list-group-item"><h5>Skupina <b>LARGE </b>komponenta <a href={props.appRoot+"/group/65"} className="btn btn-primary float-right">Link</a></h5></li>
                    <li className="list-group-item"><h5>Katedra <b>LARGE </b>komponenta <a href={props.appRoot+"/department/6432"} className="btn btn-primary float-right">Link</a></h5></li>
                </ul>
            </Container>
            <hr />
            <p>Github: <a href="https://github.com/Pompino/react-components-23KB">odkaz</a> <Button className="float-right" variant="dark" onClick={DarkMode}>Darkmode</Button></p>
    </Container>
    )
}