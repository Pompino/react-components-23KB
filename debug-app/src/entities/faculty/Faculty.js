import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { Card } from "react-bootstrap";
import { DepartmentS } from "../department/Department";
import { PersonS } from "../persons/Person";

export function FacultyS (props) {
    return (
        <Link to={props.appRoot+"/faculty/"+props.id}>{props.name}</Link>
    )
}

export function FacultyM (props) {
    return (
        <Card className='mb-3'>
            <Card.Header>
                <Card.Title>Fakulta <b><FacultyS {...props} /></b></Card.Title>
            </Card.Header>
            <Card.Body>
                <b>Název:</b> {props.fullname}<br/>
                <b>Děkan:</b> {props.dean}<br/>
            </Card.Body>
        </Card> 
    )
}

export function FacultyL (props) {
    const [state, setState] = useState(
        {
            'id': props.id,
            'name': props.name,
            'fullname': 'Fakulta vojenských technologií',
            'dean': 'Vladimír Brzobohatý',
            'areal': 'Kasárny Šumavská',
            'building': '3',
            'departments': [
                {'id': 1, 'name': 'K-201'},
                {'id': 2, 'name': 'K-202'},
                {'id': 3, 'name': 'K-205'},
                {'id': 4, 'name': 'K-208'},
                {'id': 5, 'name': 'K-209'},
                {'id': 6, 'name': 'K-220'},
                {'id': 7, 'name': 'K-221'},
            ]
        }
    )

        useEffect(()=>{
        fetch('/gql/getFaculty/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: 
                `
                query {
                    user(id: $id$) {
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

    const departments = []
    for(var index = 0; index < state.departments.length; index++) {
        const sgItem = state.departments[index]
        departments.push(<li key={sgItem.id}><DepartmentS {...props} id={sgItem.id} name={sgItem.name} /></li>);
    }
    
    return (
        <div class="card w-50">
            <div class="card-header mb-3">
                <h4>Karta fakulty</h4>
            </div>
            <div class='col'>
                <div class='row'>
                    <div class='col'>
                        <FacultyM {...props} fullname={state.fullname} dean={<PersonS {...props} name={state.dean} />}/>
                        <ContactInfo data={state} appRoot={props.appRoot} />
                    </div>
                    <div class='col'>
                        <SeznamKateder departments={departments} />
                    </div>
                </div>
            </div>
        </div>
    )
}

function ContactInfo(props) {
    return (
        <div class="card mb-3">
            <Card.Header>
                <Card.Title>Adresa</Card.Title>
            </Card.Header>
            <Card.Body>
                <b>Areál: </b> {props.data.areal}<br />
                <b>Budova: </b>{props.data.building} <br />
            </Card.Body>
        </div>
    )
}

function SeznamKateder(props) {
    return (
        <div class="card mb-3">
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