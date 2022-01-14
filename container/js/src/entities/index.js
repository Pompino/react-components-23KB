import { useEffect, useState } from "react";
import Card from 'react-bootstrap/Card';

export const root = '/ui'
export const rootGQL = '/gql'


export const useQueryGQL = (id, queryFunc, responseToJson, depends) => {
    const [state, setState] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() =>
        queryFunc(id)
        .then(response => response.json())
        .then(data => responseToJson(data))
        .then(data => setState(data))
        .catch(e => setError(e)), depends
    )
    return [state, error];
}

export const LoadingError = (props) =>
    (
        <Card>
            <Card.Header bg='danger' text='white'>{props.error}</Card.Header>
        </Card>
)

export const Loading = (props) => (
    <Card>
        <Card.Header bg='light' text='dark'>Nahrávám</Card.Header>
        <Card.Body>{props.children}</Card.Body>
    </Card>
)