import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { Card } from "react-bootstrap";
import { TeacherS } from "../persons/Teacher";
import { FacultyS } from "../faculty/Faculty";

export function DepartmentS(props) {
    return (
        <Link to={props.appRoot + "/department/" + props.id}>{props.name}</Link>
    )
}

export function DepartmentM(props) {
    return (
        <Card className='mb-3'>
            <Card.Header>
                <Card.Title>Katedra <b><DepartmentS {...props} /></b></Card.Title>
            </Card.Header>
            <Card.Body>
                <b>Název:</b> {props.fullname}<br />
                <b>Vedoucí katedry:</b> {props.VK}<br />
                <b>Fakulta:</b> <FacultyS {...props} name={props.FacultyName} id={props.id}/><br />
            </Card.Body>
        </Card>
    )
}

export function DepartmentL(props) {
    let teachers = props.teachers.map((item) => (<li key={item.id}><TeacherS key={item.id} {...item} appRoot={props.appRoot} /></li>))

    return (
        <div className="card w-50">
            <div className="card-header mb-3">
                <h4>Karta katedry</h4>
            </div>
            <div className='col'>
                <div className='row'>
                    <div className='col'>
                        <DepartmentM {...props} FacultyName={props.faculty[0].name} id={props.faculty[0].id} />
                        <ContactInfo {...props} />
                    </div>
                    <div className='col'>
                        <SeznamUcitelu teachers={teachers} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export function DepartmentPage(props) {
    const [state, setState] = useState(
        {
            'id': props.id,
            'name': props.name,
            'fullname': 'Katedra informatiky a kybernetických operací',
            'areal': 'Kasárny Šumavská',
            'building': '3',
            'faculty': [
                { 'id': 23, 'name': 'FVT' }
            ],
            'teachers': [
                { 'id': 1, 'name': 'Honza Bernard' },
                { 'id': 2, 'name': 'Pavel Motol' },
                { 'id': 3, 'name': 'Dominik Vaněk' },
                { 'id': 4, 'name': 'Andrea Svobodova' },
                { 'id': 5, 'name': 'Michal Mrkev' },
                { 'id': 6, 'name': 'Patrik Němý' },
                { 'id': 7, 'name': 'Jiřina Stará' },
                { 'id': 8, 'name': 'Petr Filip' },
                { 'id': 9, 'name': 'Jiří Grau' },
                { 'id': 10, 'name': 'Teodor Velký' },
                { 'id': 11, 'name': 'Alexandr Veliký' },
                { 'id': 22, 'name': 'Aleš Máchal' }
            ]
        }
    )

    useEffect(() => {
        fetch('/gql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            redirect: 'follow', // manual, *follow, error
            body: JSON.stringify({
                "query":
                    `
                query {
                    user(id: ${props.id}) {
                        id
                        name
                        fullname
                        areal
                        building
                        faculty: groupsByType(type: 0) {
                            id
                            name
                        }
                        teachers: groupsByType(type: 1) {
                            id
                            name
                        }
                    }
                }
                `
            }),
        })
            .then(response => response.json())
            .then(data => setState(data.data))
            .then(() => console.log('data logged'))
            .catch(error => console.log('error nacteni'))
    }, [props.id])


    return (
        <DepartmentL {...state} {...props} />
    )
}

function SeznamUcitelu(props) {
    return (
        <div className="card mb-3">
            <Card.Header>
                <Card.Title>Vyučující</Card.Title>
            </Card.Header>
            <Card.Body>
                <ul>
                    {props.teachers}
                </ul>
            </Card.Body>
        </div>
    )
}

function ContactInfo(props) {
    return (
        <div className="card mb-3">
            <Card.Header>
                <Card.Title>Adresa</Card.Title>
            </Card.Header>
            <Card.Body>
                <b>Areál: </b> {props.areal}<br />
                <b>Budova: </b>{props.building} <br />
            </Card.Body>
        </div>
    )
}