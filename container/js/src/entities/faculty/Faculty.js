import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { Card } from "react-bootstrap";
import { DepartmentS } from "../department/Department";
import { PersonS } from "../persons/Person";

export function FacultyS(props) {
    return (
        <Link to={props.appRoot + "/faculty/" + props.id}>{props.name}</Link>
    )
}

export function FacultyM(props) {
    return (
        <Card className='mb-3'>
            <Card.Header>
                <Card.Title>Fakulta <b><FacultyS {...props} /></b></Card.Title>
            </Card.Header>
            <Card.Body>
                <b>Název:</b> {props.fullname}<br />
                <b>Děkan:</b> <PersonS {...props} name={props.dean} /><br />
            </Card.Body>
        </Card>
    )
}

export function FacultyL(props) {
    let departments = props.departments.map((item) => (<li key={item.id}><DepartmentS key={item.id} {...item} appRoot={props.appRoot} /></li>))

    return (
        <div className="card w-50">
            <div className="card-header mb-3">
                <h4>Karta fakulty</h4>
            </div>
            <div className='col'>
                <div className='row'>
                    <div className='col'>
                        <FacultyM {...props} />
                        <ContactInfo {...props} />
                    </div>
                    <div className='col'>
                        <SeznamKateder departments={departments} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export function FacultyPage(props) {
    const [state, setState] = useState(
        {
            'id': props.id,
            'name': props.name,
            'fullname': 'Fakulta vojenských technologií',
            'dean': 'Vladimír Brzobohatý',
            'areal': 'Kasárny Šumavská',
            'building': '3',
            'departments': [
                { 'id': 1, 'name': 'K-201' },
                { 'id': 2, 'name': 'K-202' },
                { 'id': 3, 'name': 'K-205' },
                { 'id': 4, 'name': 'K-208' },
                { 'id': 5, 'name': 'K-209' },
                { 'id': 6, 'name': 'K-220' },
                { 'id': 7, 'name': 'K-221' },
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
                        departments: groupsByType(type: 1) {
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
        <FacultyL {...state} {...props} />
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

function SeznamKateder(props) {
    return (
        <div className="card mb-3">
            <Card.Header>
                <Card.Title>Katedry</Card.Title>
            </Card.Header>
            <Card.Body>
                <ul>
                    {props.departments}
                </ul>
            </Card.Body>
        </div>
    )
}