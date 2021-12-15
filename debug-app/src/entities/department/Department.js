import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { Card } from "react-bootstrap";
import { TeacherS } from "../persons/Teacher";
import { FacultyS } from "../faculty/Faculty";

export function DepartmentS (props) {
    return (
        <Link to={props.appRoot+"/department/"+props.id}>{props.name}</Link>
    )
}

export function DepartmentM (props) {
    return (
        <Card className='mb-3'>
            <Card.Header>
                <Card.Title>Katedra <b><DepartmentS {...props} /></b></Card.Title>
            </Card.Header>
            <Card.Body>
                <b>Název:</b> {props.fullname}<br/>
                <b>Vedoucí katedry:</b> {props.VK}<br/>
                <b>Fakulta:</b> {props.faculty}<br/>
            </Card.Body>
        </Card> 
    )
}

export function DepartmentL (props) {

    const [state, setState] = useState(
        {
            'id': props.id,
            'name': props.name,
            'fullname': 'Katedra informatiky a kybernetických operací',
            'areal': 'Kasárny Šumavská',
            'building': '3',
            'faculty': [
                {'id': 23, 'name': 'FVT'}
            ],
            'teachers': [
                {'id': 1, 'name': 'Honza Bernard'},
                {'id': 2, 'name': 'Pavel Motol'},
                {'id': 3, 'name': 'Dominik Vaněk'},
                {'id': 4, 'name': 'Andrea Svobodova'},
                {'id': 5, 'name': 'Michal Mrkev'},
                {'id': 6, 'name': 'Patrik Němý'},
                {'id': 7, 'name': 'Jiřina Stará'},
                {'id': 8, 'name': 'Petr Filip'},
                {'id': 9, 'name': 'Jiří Grau'},
                {'id': 10, 'name': 'Teodor Velký'},
                {'id': 11, 'name': 'Alexandr Veliký'},
                {'id': 22, 'name': 'Aleš Máchal'}
            ]
        }
    )

        useEffect(()=>{
        fetch('/gql/getDepartment/', {
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

    const teachers = []
    for(var index = 0; index < state.teachers.length; index++) {
        const sgItem = state.teachers[index]
        teachers.push(<li key={sgItem.id}><TeacherS {...props} id={sgItem.id} name={sgItem.name} /></li>);
    }

    return (
        <div class="card w-50">
            <div class="card-header mb-3">
                <h4>Karta katedry</h4>
            </div>
            <div class='col'>
                <div class='row'>
                    <div class='col'>
                        <DepartmentM {...props} fullname={state.fullname} faculty={<FacultyS {...props} name={state.faculty[0].name} id={state.faculty[0].id} /> }/>
                        <ContactInfo data={state} appRoot={props.appRoot} />
                    </div>
                    <div class='col'>
                        <SeznamUcitelu teachers={teachers}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

function SeznamUcitelu(props) {
    return (
        <div class="card mb-3">
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